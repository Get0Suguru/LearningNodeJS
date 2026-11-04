import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(':memory:');


db.exec(`
  CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
  `)


db.exec(`
    CREATE TABLE todos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      user_id INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `)

  export default db;