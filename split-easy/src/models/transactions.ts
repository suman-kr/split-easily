import pool from "../db";

interface TransactionInterface {
  id?: number;
  userId?: number;
  expenseId?: number;
  amount?: number;
}

export class Transactions implements TransactionInterface {
  id?: number;
  userId?: number;
  expenseId?: number;
  amount?: number;

  constructor(props: TransactionInterface) {
    this.amount = props.amount;
    this.expenseId = props.expenseId;
    this.id = props.id;
    this.userId = props.userId;
  }
  createTransactions = async () => {
    await pool.query(
      `INSERT INTO transactions(user_id, expense_id, amount) VALUES (${this.userId}, ${this.expenseId}, ${this.amount})`
    );
  };

  getTransactionDetails = async () => {
    return await pool.query(
      `SELECT u.username, t.* from users u right join transactions t on t.user_id = u.id where t.expense_id=${this.expenseId}`
    );
  };
}
