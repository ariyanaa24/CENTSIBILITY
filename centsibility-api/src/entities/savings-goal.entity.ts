import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { decimalTransformer } from '../common/decimal.transformer';

// Table: SavingsGoals (savings targets with progress tracking).
@Entity({ name: 'SavingsGoals' })
// TargetAmount must be greater than 0.
@Check(`\`TargetAmount\` > 0`)
// CurrentAmount cannot be negative.
@Check(`\`CurrentAmount\` >= 0`)
// Status can only be Active, Completed, or Cancelled.
@Check(`\`Status\` IN ('Active','Completed','Cancelled')`)
export class SavingsGoal {
  // Primary key, AUTO_INCREMENT.
  @PrimaryGeneratedColumn({ name: 'GoalID' })
  goalId: number;

  // Foreign key column to Users.
  @Column({ name: 'UserID', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'GoalName', type: 'varchar', length: 100, nullable: false })
  goalName: string;

  @Column({ name: 'TargetAmount', type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: decimalTransformer })
  targetAmount: number;

  // Starts at 0 and grows as the user saves.
  @Column({ name: 'CurrentAmount', type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0, transformer: decimalTransformer })
  currentAmount: number;

  @Column({ name: 'TargetDate', type: 'date', nullable: true })
  targetDate: string | null;

  // Active, Completed, or Cancelled (checked above).
  @Column({ name: 'Status', type: 'varchar', length: 15, nullable: false, default: 'Active' })
  status: 'Active' | 'Completed' | 'Cancelled';

  // Many goals belong to one user (deleted together: CASCADE).
  @ManyToOne(() => User, (u) => u.savingsGoals, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserID' })
  user: User;
}
