import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { Budget } from './budget.entity';
import { RecurringExpense } from './recurring-expense.entity';

// Table: Categories (the income and expense categories of a user).
@Entity({ name: 'Categories' })
// Only 'Income' or 'Expense' is allowed.
@Check(`\`CategoryType\` IN ('Income','Expense')`)
export class Category {
  // Primary key, AUTO_INCREMENT.
  @PrimaryGeneratedColumn({ name: 'CategoryID' })
  categoryId: number;

  // Foreign key column to Users.
  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'CategoryName', type: 'varchar', length: 50, nullable: false })
  categoryName: string;

  @Column({ name: 'CategoryType', type: 'varchar', length: 10, nullable: false })
  categoryType: 'Income' | 'Expense';

  // Many categories belong to one user. If the user is deleted, the categories are deleted too (CASCADE).
  @ManyToOne(() => User, (u) => u.categories, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  // Relations (not columns): one category has many transactions, budgets, and recurring expenses.
  @OneToMany(() => Transaction, (t) => t.category)
  transactions: Transaction[];

  @OneToMany(() => Budget, (b) => b.category)
  budgets: Budget[];

  @OneToMany(() => RecurringExpense, (r) => r.category)
  recurringExpenses: RecurringExpense[];
}
