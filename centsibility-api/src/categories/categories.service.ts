import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryDto } from './dto/category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

/**
 * Business logic for categories: ownership checks and conflict handling.
 */
@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoriesRepo: Repository<Category>) {}

  /**
   * Lists the logged-in user's categories (optionally only one type).
   */
  async findAll(userId: number, query: QueryCategoryDto) {
    // Always limit the query to the logged-in user's rows.
    const where: any = { userId };
    if (query.categoryType) where.categoryType = query.categoryType;
    const data = await this.categoriesRepo.find({ where, order: { categoryId: 'ASC' } });
    return { data: data.map((c) => this.toResponse(c)) };
  }

  /**
   * Gets one category. 404 if missing, 403 if it belongs to another user.
   */
  async findOne(id: number, userId: number) {
    return this.toResponse(await this.findOwned(id, userId));
  }

  /**
   * Creates a category for the logged-in user (userId comes from the token).
   */
  async create(userId: number, dto: CategoryDto) {
    const saved = await this.categoriesRepo.save(this.categoriesRepo.create({ ...dto, userId }));
    return this.toResponse(saved);
  }

  // PUT: replace all editable fields
  async replace(id: number, userId: number, dto: CategoryDto) {
    const category = await this.findOwned(id, userId);
    category.categoryName = dto.categoryName;
    category.categoryType = dto.categoryType;
    return this.toResponse(await this.categoriesRepo.save(category));
  }

  /**
   * Deletes a category. Returns 409 if transactions still use it.
   */
  async remove(id: number, userId: number) {
    const category = await this.findOwned(id, userId);
    try {
      await this.categoriesRepo.remove(category);
    } catch (err) {
      // MySQL foreign key error: transactions still use this category
      if (err instanceof QueryFailedError && (err as any).errno === 1451) {
        throw new ConflictException({
          message: 'Category cannot be deleted.',
          errors: [`Category ${id} still has transactions linked to it.`],
        });
      }
      throw err;
    }
  }

  // Also used later by the transactions module
  async findOwned(id: number, userId: number) {
    const category = await this.categoriesRepo.findOne({ where: { categoryId: id } });

    // 404: the category does not exist.
    if (!category) {
      throw new NotFoundException({ message: 'Category not found.', errors: [`No category exists with ID ${id}.`] });
    }

    // 403: the category belongs to someone else.
    if (category.userId !== userId) {
      throw new ForbiddenException({
        message: 'Access denied.',
        errors: ['This category belongs to another user.'],
      });
    }
    return category;
  }

  private toResponse(c: Category) {
    return { categoryId: c.categoryId, userId: c.userId, categoryName: c.categoryName, categoryType: c.categoryType };
  }
}
