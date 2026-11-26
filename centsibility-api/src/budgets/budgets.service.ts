import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Budget } from '../entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { QueryBudgetsDto } from './dto/query-budgets.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget) private readonly budgetsRepo: Repository<Budget>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(userId: number, query: QueryBudgetsDto) {
    const where: any = { userId };
    if (query.budgetMonth) where.budgetMonth = query.budgetMonth;
    const data = await this.budgetsRepo.find({ where, order: { budgetId: 'ASC' } });
    return { data: data.map((b) => this.toResponse(b)) };
  }

  async findOne(id: number, userId: number) {
    return this.toResponse(await this.findOwned(id, userId));
  }

  async create(userId: number, dto: CreateBudgetDto) {
    await this.categoriesService.findOwned(dto.categoryId, userId);
    const exists = await this.budgetsRepo.findOne({
      where: { userId, categoryId: dto.categoryId, budgetMonth: dto.budgetMonth },
    });
    if (exists) {
      throw new ConflictException({
        message: 'Budget already exists.',
        errors: [`A budget for category ${dto.categoryId} in ${dto.budgetMonth.slice(0, 7)} already exists.`],
      });
    }
    const saved = await this.budgetsRepo.save(
      this.budgetsRepo.create({
        userId,
        categoryId: dto.categoryId,
        monthlyLimit: dto.monthlyLimit,
        budgetMonth: dto.budgetMonth,
        alertThreshold: dto.alertThreshold ?? 80,
      }),
    );
    return this.toResponse(saved);
  }

  async update(id: number, userId: number, dto: UpdateBudgetDto) {
    const budget = await this.findOwned(id, userId);
    Object.assign(budget, dto);
    return this.toResponse(await this.budgetsRepo.save(budget));
  }

  async remove(id: number, userId: number) {
    const budget = await this.findOwned(id, userId);
    await this.budgetsRepo.remove(budget);
  }

  private async findOwned(id: number, userId: number) {
    const budget = await this.budgetsRepo.findOne({ where: { budgetId: id } });
    if (!budget) {
      throw new NotFoundException({ message: 'Budget not found.', errors: [`No budget exists with ID ${id}.`] });
    }
    if (budget.userId !== userId) {
      throw new ForbiddenException({ message: 'Access denied.', errors: ['This budget belongs to another user.'] });
    }
    return budget;
  }

  private toResponse(b: Budget) {
    return {
      budgetId: b.budgetId,
      userId: b.userId,
      categoryId: b.categoryId,
      monthlyLimit: b.monthlyLimit,
      budgetMonth: b.budgetMonth,
      alertThreshold: b.alertThreshold,
    };
  }
}
