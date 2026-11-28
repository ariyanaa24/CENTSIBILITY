import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { decimalTransformer } from '../common/decimal.transformer';

// Table: RecurringExpenses (bills and subscriptions that repeat).
// The table exists, but the API for it is not built yet.
@Entity({ name: 'RecurringExpenses' })
// Amount must be greater than 0.
@Check(`\`Amount\` > 0`)
// Frequency can only be Weekly, Monthly, or Yearly.
@Check(`\`Frequency\` IN ('Weekly','Monthly','Yearly')`)
export class RecurringExpense {
  // Primary key, AUTO_INCREMENT.
  @PrimaryGeneratedColumn({ name: 'RecurringID' })
  recurringId: number;

  // Foreign key columns to Users and Categories.
  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'CategoryID', type: 'int', nullable: false })
  categoryId: number;

  @Column({ name: 'Description', type: 'varchar', length: 100, nullable: false })
  description: string;

  @Column({ name: 'Amount', type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: decimalTransformer })
  amount: number;

  // Weekly, Monthly, or Yearly (checked above).
  @Column({ name: 'Frequency', type: 'varchar', length: 10, nullable: false })
  frequency: 'Weekly' | 'Monthly' | 'Yearly';

  @Column({ name: 'NextDueDate', type: 'date', nullable: false })
  nextDueDate: string;

  // How many days before the due date a reminder should be sent (default 3).
  @Column({ name: 'ReminderDaysBefore', type: 'int', nullable: false, default: 3 })
  reminderDaysBefore: number;

  // Many recurring expenses belong to one user (deleted together: CASCADE).
  @ManyToOne(() => User, (u) => u.recurringExpenses, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  // Many recurring expenses belong to one category (deleted together: CASCADE).
  @ManyToOne(() => Category, (c) => c.recurringExpenses, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CategoryID' })
  category: Category;
}
