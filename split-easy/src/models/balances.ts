import pool from "../db";
import { getAllBalancesForUsers } from "../helpers";

interface BalancesInterface {
  id?: number;
  userId?: number;
  amount?: string;
  transactUserId?: number;
}

export class Balances implements BalancesInterface {
  id?: number;
  userId?: number;
  amount?: string;
  transactUserId?: number;

  constructor(props: BalancesInterface) {
    this.amount = props.amount;
    this.id = props.id;
    this.transactUserId = props.transactUserId;
    this.userId = props.userId;
  }

  addBalance = async () => {
    await pool.query(
      `INSERT INTO balances(user_id, amount, transact_user_id) VALUES (${this.userId}, ${this.amount}, ${this.transactUserId})`
    );
  };

  getAllBalances = async () => {
    const balancesResult = await pool.query(`SELECT * FROM balances`);
    const balancesRows = balancesResult.rows;
    const balances = getAllBalancesForUsers(balancesRows);
    return balances;
  };

  getBalanceByUserId = async () => {
    const balancesResult = await pool.query(
      `SELECT * FROM balances where user_id = ${this.userId}`
    );
    const balancesRows = balancesResult.rows;
    const balances = getAllBalancesForUsers(balancesRows);
    return balances;
  };
}
