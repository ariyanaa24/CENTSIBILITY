import { IsIn, IsOptional } from 'class-validator';

export class QuerySavingsGoalsDto {
  @IsOptional()
  @IsIn(['Active', 'Completed', 'Cancelled'], { message: "status must be 'Active', 'Completed', or 'Cancelled'." })
  status?: 'Active' | 'Completed' | 'Cancelled';
}
