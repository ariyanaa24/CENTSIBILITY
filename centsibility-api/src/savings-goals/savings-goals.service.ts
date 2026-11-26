import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from '../entities/savings-goal.entity';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { QuerySavingsGoalsDto } from './dto/query-savings-goals.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';

@Injectable()
export class SavingsGoalsService {
  constructor(@InjectRepository(SavingsGoal) private readonly goalsRepo: Repository<SavingsGoal>) {}

  async findAll(userId: number, query: QuerySavingsGoalsDto) {
    const where: any = { userId };
    if (query.status) where.status = query.status;
    const data = await this.goalsRepo.find({ where, order: { goalId: 'ASC' } });
    return { data: data.map((g) => this.toResponse(g)) };
  }

  async findOne(id: number, userId: number) {
    return this.toResponse(await this.findOwned(id, userId));
  }

  async create(userId: number, dto: CreateSavingsGoalDto) {
    const saved = await this.goalsRepo.save(
      this.goalsRepo.create({
        userId,
        goalName: dto.goalName,
        targetAmount: dto.targetAmount,
        currentAmount: 0,
        targetDate: dto.targetDate ?? null,
        status: 'Active',
      }),
    );
    return this.toResponse(saved);
  }

  async update(id: number, userId: number, dto: UpdateSavingsGoalDto) {
    const goal = await this.findOwned(id, userId);
    Object.assign(goal, dto);
    return this.toResponse(await this.goalsRepo.save(goal));
  }

  async remove(id: number, userId: number) {
    const goal = await this.findOwned(id, userId);
    await this.goalsRepo.remove(goal);
  }

  private async findOwned(id: number, userId: number) {
    const goal = await this.goalsRepo.findOne({ where: { goalId: id } });
    if (!goal) {
      throw new NotFoundException({ message: 'Savings goal not found.', errors: [`No savings goal exists with ID ${id}.`] });
    }
    if (goal.userId !== userId) {
      throw new ForbiddenException({ message: 'Access denied.', errors: ['This savings goal belongs to another user.'] });
    }
    return goal;
  }

  private toResponse(g: SavingsGoal) {
    return {
      goalId: g.goalId,
      userId: g.userId,
      goalName: g.goalName,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      targetDate: g.targetDate ?? null,
      status: g.status,
    };
  }
}
