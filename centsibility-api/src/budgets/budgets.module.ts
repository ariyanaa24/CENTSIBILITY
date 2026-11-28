import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { Budget } from '../entities/budget.entity';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';

/**
 * Budgets feature.
 */
@Module({
  // CategoriesModule gives us CategoriesService.findOwned() to check the category.
  imports: [TypeOrmModule.forFeature([Budget]), CategoriesModule],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}
