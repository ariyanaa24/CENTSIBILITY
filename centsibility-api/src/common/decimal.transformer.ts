import { ValueTransformer } from 'typeorm';

// MySQL returns DECIMAL as a string. This makes it a number in JSON.
export const decimalTransformer: ValueTransformer = {
  // Saving: keep the number as it is.
  to: (value?: number) => value,
  // Reading: MySQL gives DECIMAL as text ("150.00"), so convert it to a number (150).
  from: (value?: string) => (value === null || value === undefined ? value : parseFloat(value)),
};
