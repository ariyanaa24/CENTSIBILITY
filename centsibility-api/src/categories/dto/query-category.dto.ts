import { IsIn, IsOptional } from 'class-validator';

/**
 * Optional query string: ?categoryType=Income or ?categoryType=Expense.
 */
export class QueryCategoryDto {
  @IsOptional()
  @IsIn(['Income', 'Expense'], { message: "categoryType must be 'Income' or 'Expense'." })
  categoryType?: 'Income' | 'Expense';
}
