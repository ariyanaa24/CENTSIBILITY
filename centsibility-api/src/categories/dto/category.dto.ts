import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Used for POST and PUT (PUT replaces the whole category, so both fields are required)
export class CategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'categoryName is required.' })
  @MaxLength(50, { message: 'categoryName must be at most 50 characters.' })
  categoryName: string;

  // Only 'Income' or 'Expense' is allowed (same as the CHECK rule in MySQL).
  @IsIn(['Income', 'Expense'], { message: "categoryType must be 'Income' or 'Expense'." })
  categoryType: 'Income' | 'Expense';
}
