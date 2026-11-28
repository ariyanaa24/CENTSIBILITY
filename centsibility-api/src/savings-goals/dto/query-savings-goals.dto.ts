import { IsIn, IsOptional } from 'class-validator';

/**
 * Optional query string: ?status=Active, Completed, or Cancelled.
 */
export class QuerySavingsGoalsDto {
  @IsOptional()
  @IsIn(['Active', 'Completed', 'Cancelled'], { message: "status must be 'Active', 'Completed', or 'Cancelled'." })
  status?: 'Active' | 'Completed' | 'Cancelled';
}
