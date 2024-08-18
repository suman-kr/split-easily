import { Pool } from "pg";

const pool = new Pool({
  user: "user",
  host: "postgres",
  database: "splitwise",
  password: "pass",
  port: 5432,
});

const userQuery = `
CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username VARCHAR ( 50 ) UNIQUE NOT NULL,
    created_on TIMESTAMP without time zone default (now() at time zone 'utc')
);
`;

const splitQuery = `
CREATE TABLE IF NOT EXISTS splits (
    id INT PRIMARY KEY,
    name VARCHAR ( 50 )
);
`;

const expenseQuery = `
CREATE TABLE IF NOT EXISTS expenses (
    id serial PRIMARY KEY,
    name VARCHAR ( 50 ),
    split_id INT,
    amount INT,
    CONSTRAINT fk_split FOREIGN KEY(split_id) REFERENCES splits(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`;

const transactionsQuery = `
CREATE TABLE IF NOT EXISTS transactions (
    id serial PRIMARY KEY,
    user_id INT,
    expense_id INT,
    amount VARCHAR ( 50 ),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_expense FOREIGN KEY(expense_id) REFERENCES expenses(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`;

const balances = `
CREATE TABLE IF NOT EXISTS balances (
    id SERIAL PRIMARY KEY,
    user_id INT,
    amount VARCHAR ( 50 ),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    transact_user_id INT,
    CONSTRAINT fk_transact_user FOREIGN KEY(transact_user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`;

const cleatTables = `
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE splits RESTART IDENTITY CASCADE;
TRUNCATE TABLE expenses RESTART IDENTITY CASCADE;
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE balances RESTART IDENTITY CASCADE;
`;

const splitTypes = ["Equally", "Non Equally", "Percentage"];

const databaseInit = async () => {
  await pool.connect().then(() => console.log("DB connected..."));
  await pool.query(userQuery);
  await pool.query(splitQuery);
  await pool.query(expenseQuery);
  await pool.query(transactionsQuery);
  await pool.query(balances);
  await pool.query(cleatTables);
  splitTypes.forEach(async (split, index) => {
    await pool.query(`INSERT INTO splits VALUES (${index + 1}, '${split}')`);
  });
};

export { databaseInit };
export default pool;
