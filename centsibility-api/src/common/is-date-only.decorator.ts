import { registerDecorator, ValidationOptions } from 'class-validator';

// Checks for a real calendar date written as YYYY-MM-DD (matches the DATE type in the Data Dictionary)
export function IsDateOnly(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isDateOnly',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be a valid date in YYYY-MM-DD format.`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
          const d = new Date(`${value}T00:00:00Z`);
          return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
        },
      },
    });
  };
}
