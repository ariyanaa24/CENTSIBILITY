import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

/**
 * Categories feature: the controller, the service, and the Categories table.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  // TransactionsModule and BudgetsModule use findOwned() to check a category.
  exports: [CategoriesService],
})
export class CategoriesModule {}
