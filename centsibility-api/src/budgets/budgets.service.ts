import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Budget } from '../entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { QueryBudgetsDto } from './dto/query-budgets.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

/**
 * Business logic for budgets: ownership checks and the one-budget-per-month rule.
 */
@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget) private readonly budgetsRepo: Repository<Budget>,
    private readonly categoriesService: CategoriesService,
  ) {}

  /**
   * Lists the user's budgets (optionally for one month).
   */
  async findAll(userId: number, query: QueryBudgetsDto) {
    const where: any = { userId };
    if (query.budgetMonth) where.budgetMonth = query.budgetMonth;
    const data = await this.budgetsRepo.find({ where, order: { budgetId: 'ASC' } });
    return { data: data.map((b) => this.toResponse(b)) };
  }

  /**
   * Gets one budget. 404 if missing, 403 if it belongs to another user.
   */
  async findOne(id: number, userId: number) {
    return this.toResponse(await this.findOwned(id, userId));
  }

  /**
   * Sets a budget. The category must be the user's.
   */
  async create(userId: number, dto: CreateBudgetDto) {
    await this.categoriesService.findOwned(dto.categoryId, userId);

    // Only one budget per category per month: 409 if it already exists.
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
        // Default alert at 80% of the limit when the client does not send one.
        alertThreshold: dto.alertThreshold ?? 80,
      }),
    );
    return this.toResponse(saved);
  }

  /**
   * Changes the limit and/or the alert percentage.
   */
  async update(id: number, userId: number, dto: UpdateBudgetDto) {
    const budget = await this.findOwned(id, userId);
    Object.assign(budget, dto);
    return this.toResponse(await this.budgetsRepo.save(budget));
  }

  /**
   * Deletes a budget (ownership is checked first).
   */
  async remove(id: number, userId: number) {
    const budget = await this.findOwned(id, userId);
    await this.budgetsRepo.remove(budget);
  }

  /**
   * Finds a budget by ID. Throws 404 if it does not exist and 403 if it is not the user's.
   */
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

  /**
   * Only these fields are sent to the client.
   */
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
