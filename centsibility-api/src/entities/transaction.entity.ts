import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { decimalTransformer } from '../common/decimal.transformer';

// Table: Transactions (every income or expense entry).
@Entity({ name: 'Transactions' })
// Amount must be greater than 0.
@Check(`\`Amount\` > 0`)
export class Transaction {
  // Primary key, AUTO_INCREMENT.
  @PrimaryGeneratedColumn({ name: 'TransactionID' })
  transactionId: number;

  // Foreign key columns to Users and Categories.
  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'CategoryID', type: 'int', nullable: false })
  categoryId: number;

  // DECIMAL(10,2). The transformer turns MySQL's text value into a number.
  @Column({ name: 'Amount', type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: decimalTransformer })
  amount: number;

  @Column({ name: 'TransactionDate', type: 'date', nullable: false })
  transactionDate: string;

  // Optional fields (NULL is allowed).
  @Column({ name: 'Description', type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ name: 'ReceiptImagePath', type: 'varchar', length: 255, nullable: true })
  receiptImagePath: string | null;

  // Many transactions belong to one user (deleted together: CASCADE).
  @ManyToOne(() => User, (u) => u.transactions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;

  // No cascade: a category with transactions cannot be deleted (gives the 409 in Lab 05)
  @ManyToOne(() => Category, (c) => c.transactions, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'CategoryID' })
  category: Category;
}
