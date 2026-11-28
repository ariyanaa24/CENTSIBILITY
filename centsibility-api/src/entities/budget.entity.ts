import { Check, Column, Entity, Unique, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { decimalTransformer } from '../common/decimal.transformer';

// Table: Budgets (the monthly spending limit of a category).
@Entity({ name: 'Budgets' })
// Only one budget per user, category, and month.
@Unique(['userId', 'categoryId', 'budgetMonth'])
// MonthlyLimit must be greater than 0.
@Check(`\`MonthlyLimit\` > 0`)
// AlertThreshold is a percentage from 1 to 100.
@Check(`\`AlertThreshold\` BETWEEN 1 AND 100`)
export class Budget {
  // Primary key, AUTO_INCREMENT.
  @PrimaryGeneratedColumn({ name: 'BudgetID' })
  budgetId: number;

  // Foreign key columns to Users and Categories.
  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'CategoryID', type: 'int', nullable: false })
  categoryId: number;

  @Column({ name: 'MonthlyLimit', type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: decimalTransformer })
  monthlyLimit: number;

  // The first day of the month the budget is for (for example 2026-11-01).
  @Column({ name: 'BudgetMonth', type: 'date', nullable: false })
  budgetMonth: string;

  // Percent of the limit that should trigger an alert (default 80).
  @Column({ name: 'AlertThreshold', type: 'int', nullable: false, default: 80 })
  alertThreshold: number;

  // Many budgets belong to one user (deleted together: CASCADE).
  @ManyToOne(() => User, (u) => u.budgets, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  // Many budgets belong to one category (deleted together: CASCADE).
  @ManyToOne(() => Category, (c) => c.budgets, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CategoryID' })
  category: Category;
}
