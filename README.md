[README.md](https://github.com/user-attachments/files/35539117/README.md)
# Centsibility API

## Project Description

Centsibility is a backend REST API for an expense tracker and savings goal app. Users register, log in, and then manage their own categories, transactions, monthly budgets, and savings goals. Every route except register and login is protected with a JWT, and passwords are stored as bcrypt hashes. The API has 25 endpoints under `/api/v1`.

This is the final project for ITEC 116 - Systems Integration and Architecture 2, built from the designs in Laboratory Activities 03 to 06.

## Tech Stack

- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** MySQL
- **Authentication:** JWT, with bcrypt for password hashing
- **Validation:** class-validator
- **API testing:** Postman
- **Version control:** Git and GitHub

## How to Run Locally

**Requirements:** Node.js (LTS) and MySQL.

1. Clone the repository and open the folder:
   ```bash
   git clone https://github.com/<your-username>/<your-repository-name>.git
   cd <your-repository-name>
   ```
2. Create the database by importing `database/schema.sql` (phpMyAdmin Import tab, or run `mysql -u root -p < database/schema.sql`).
3. Copy `.env.example` to `.env` and fill in your MySQL password and a JWT secret.
4. Install the packages:
   ```bash
   npm install
   ```
5. Start the backend:
   ```bash
   npm run start:dev
   ```

The API runs at `http://localhost:3000/api/v1`. Register with `POST /api/v1/users`, log in with `POST /api/v1/auth/login`, and send the token as `Authorization: Bearer <token>` on every other request.
