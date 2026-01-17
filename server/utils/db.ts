import { db } from 'hub:db'
import * as schema from '../db/schema'

export const tables = schema

export function useDrizzle() {
  return db
}
