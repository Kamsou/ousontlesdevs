import Database from 'better-sqlite3'
import { join } from 'path'
import { readFileSync } from 'fs'

export default defineNitroPlugin(() => {
  const dbPath = join(process.cwd(), 'data.db')
  const sqlite = new Database(dbPath)

  // Run migrations
  const migrationPath = join(process.cwd(), 'server/database/migrations/0001_init.sql')
  try {
    const migration = readFileSync(migrationPath, 'utf-8')
    sqlite.exec(migration)
    console.log('Database initialized successfully')
  } catch (error) {
    console.log('Database already initialized or migration error:', error)
  }

  sqlite.close()
})
