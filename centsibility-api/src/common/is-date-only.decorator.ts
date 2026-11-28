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
        // Returns true only when the value is a real date.
        validate(value: unknown) {
          // Must be text in the form YYYY-MM-DD.
          if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

          // Convert back to text and compare, so impossible dates like 2026-02-31 are rejected.
          const d = new Date(`${value}T00:00:00Z`);
          return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
        },
      },
    });
  };
}
