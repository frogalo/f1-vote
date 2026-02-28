import "dotenv/config"
import { defineConfig, env } from "@prisma/config";


console.log("POSTGRES_URL in config:", process.env.POSTGRES_URL);

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        seed: "npx tsx prisma/seed.ts"
    },
    datasource: {
        url: env("POSTGRES_URL") || env("DATABASE_URL")
    }
})
