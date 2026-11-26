# Centsibility API

Backend for Centsibility, an expense tracker and savings goal app (ITEC 116).

**Stack:** NestJS, TypeORM, MySQL, JWT, Postman, Git & GitHub

## Setup
1. Install Node.js and MySQL.
2. Run `database/schema.sql` in MySQL (phpMyAdmin Import, or `mysql -u root -p < database/schema.sql`). It creates the `centsibility` database and all tables.
3. Copy `.env.example` to `.env` and fill in your MySQL password and JWT secret. Keep `DB_SYNC=false` when using the SQL script.
4. `npm install`
5. `npm run start:dev`
6. Optional: register `demo@centsibility.com` through the API, then run `database/sample-data.sql`.

The API runs at `http://localhost:3000/api/v1`.

## Endpoints (all under /api/v1)
| Module | Endpoints |
|---|---|
| Auth | POST /auth/login |
| Users | POST /users, GET /users/:id, PATCH /users/:id |
| Categories | GET /categories, GET /categories/:id, POST /categories, PUT /categories/:id, DELETE /categories/:id |
| Transactions | GET /transactions, GET /transactions/:id, POST /transactions, PATCH /transactions/:id, DELETE /transactions/:id, GET /categories/:id/transactions |
| Budgets | GET /budgets, GET /budgets/:id, POST /budgets, PATCH /budgets/:id, DELETE /budgets/:id |
| Savings goals | GET /savings-goals, GET /savings-goals/:id, POST /savings-goals, PATCH /savings-goals/:id, DELETE /savings-goals/:id |

Every route except `POST /users` and `POST /auth/login` needs `Authorization: Bearer <token>`.
