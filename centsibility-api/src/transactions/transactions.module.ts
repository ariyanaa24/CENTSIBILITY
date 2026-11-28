import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { Transaction } from '../entities/transaction.entity';
import { CategoryTransactionsController, TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

/**
 * Transactions feature.
 */
@Module({
  // CategoriesModule gives us CategoriesService.findOwned() to check the category.
  imports: [TypeOrmModule.forFeature([Transaction]), CategoriesModule],
  // Two controllers: /transactions and the nested /categories/:id/transactions.
  controllers: [TransactionsController, CategoryTransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
