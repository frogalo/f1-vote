# Database Setup Instructions

This project uses **PostgreSQL** as the database and **Prisma ORM** for data access. Follow these steps to set up your local database environment.

## 1. Prerequisites

Ensure you have **PostgreSQL** installed and running on your machine.

- [Download PostgreSQL](https://www.postgresql.org/download/) if you haven't already.
- Alternatively, you can run PostgreSQL via Docker:
  ```bash
  docker run --name f1-vote-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
  ```

## 2. Configure Environment Variables

1. Open the `.env` file in the root of your project.
2. Locate the `DATABASE_URL` variable.
3. Replace the placeholder value with your actual PostgreSQL connection string.

**Format:**

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Example (Local):**

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/f1_vote?schema=public"
```

> **Note:** If the database (e.g., `f1_vote`) does not exist, Prisma will attempt to create it in the next step.

## 3. Push Schema to Database

Once your `.env` is configured, run the following command to create the tables in your database based on the schema defined in `prisma/schema.prisma`.

```bash
npx prisma db push
```

You should see output indicating that the database is now in sync with your schema.

## 4. Generate Prisma Client

To ensure your TypeScript types are up-to-date with your schema, run:

```bash
npx prisma generate
```

## 5. View & Manage Data (Optional)

Prisma comes with a built-in GUI to view and edit your database data.

```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555`.

## 6. Accessing the Database in Code

You can import the pre-configured Prisma client instance from `@/lib/prisma`:

```typescript
import { prisma } from "@/lib/prisma";

// Example usage
const users = await prisma.user.findMany();
```
