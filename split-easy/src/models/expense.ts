import pool from "../db";
import { generateBalancesBasedOnSplits } from "../helpers";
import { AllPayments } from "../services";
import { Balances } from "./balances";
import { Transactions } from "./transactions";

interface ExpenseInterface {
  id?: number;
  name?: string;
  splitId?: number;
  amount?: number;
  payees?: Array<{
    userId: number;
    amount: number;
  }>;
  users?: number[];
  amountSplits?: Array<{
    userId: number;
    amount?: number;
    percent?: number;
  }>;
}

export class Expense implements ExpenseInterface {
  id?: number;
  name?: string;
  splitId?: number;
  amount: number;
  payees?: { userId: number; amount: number }[];
  users?: number[];
  amountSplits?: { userId: number; amount?: number; percent?: number }[];

  constructor(props: ExpenseInterface) {
    this.amount = props.amount;
    this.id = props.id;
    this.name = props.name;
    this.splitId = props.splitId;
    this.payees = props.payees;
    this.users = props.users;
    this.amountSplits = props.amountSplits;
  }

  createExpense = async () => {
    const queryResult = await pool.query(
      `INSERT INTO expenses(name, split_id, amount) VALUES ('${this.name}', ${this.splitId}, ${this.amount}) RETURNING id`
    );

    for (const payee of this.payees) {
      await new Transactions({
        userId: payee.userId,
        expenseId: queryResult.rows[0].id,
        amount: payee.amount,
      }).createTransactions();
    }

    if (this.splitId === 1) {
      await this.splitEqually();
    }

    if (this.splitId === 2) {
      await this.splitBasedOnAmount();
    }

    if (this.splitId === 3) {
      await this.splitOnPercentage();
    }
  };

  storeBalances = async (balances) => {
    for (const balance of balances) {
      for (const payers of balance.payers) {
        const amount = Object.values(payers)[0];
        const userID = Object.keys(payers)[0];
        if (Number(amount) > 0)
          await new Balances({
            amount: amount.toString(),
            transactUserId: Number(userID),
            userId: balance.userId,
          }).addBalance();
      }
      for (const payee of balance.payee) {
        const amount = Number(Object.values(payee)[0]);
        const userID = Object.keys(payee)[0];
        await new Balances({
          amount: amount.toString(),
          transactUserId: Number(userID),
          userId: balance.userId,
        }).addBalance();
      }
    }
  };

  splitEqually = async () => {
    const splits = this.amount / this.users.length;
    const allPayments: AllPayments = {};
    Object.values(this.users).forEach((user) => {
      const userDetails =
        Object.values(this.payees).filter(({ userId }) => userId === user) ||
        [];

      allPayments[user] = {
        balance:
          userDetails.length > 0 ? userDetails[0].amount - splits : -splits,
        payee: [],
        payers: [],
        userId: user.toString(),
      };
    });
    generateBalancesBasedOnSplits(allPayments);
    const balances = Object.values(allPayments);
    await this.storeBalances(balances);
  };

  splitBasedOnAmount = async () => {
    const amountSplits = this.amountSplits;
    const allPayments: AllPayments = {};
    for (const split of amountSplits) {
      const { userId: user, amount: splitAmount } = split;
      const userDetails =
        Object.values(this.payees).filter(({ userId }) => userId === user) ||
        [];
      allPayments[user] = {
        balance:
          userDetails.length > 0
            ? userDetails[0].amount - splitAmount
            : -splitAmount,
        payee: [],
        payers: [],
        userId: user.toString(),
      };
      generateBalancesBasedOnSplits(allPayments);
      const balances = Object.values(allPayments);
      await this.storeBalances(balances);
    }
  };

  splitOnPercentage = async () => {
    const amountSplits = this.amountSplits;
    const allPayments: AllPayments = {};
    for (const split of amountSplits) {
      const { userId: user, percent } = split;
      const splitAmount = (percent / 100) * this.amount;
      const userDetails =
        Object.values(this.payees).filter(({ userId }) => userId === user) ||
        [];

      allPayments[user] = {
        balance:
          userDetails.length > 0
            ? userDetails[0].amount - splitAmount
            : -splitAmount,
        payee: [],
        payers: [],
        userId: user.toString(),
      };
      generateBalancesBasedOnSplits(allPayments);
      const balances = Object.values(allPayments);
      await this.storeBalances(balances);
    }
  };

  getExpenseDetails = async () => {
    const expenseDetails: {
      name?: string;
      split_type?: number;
      transactions?: any[];
      amount?: number;
      split_name?: string;
    } = {};
    const expenseRow = await pool.query(
      `SELECT s.name as split_name, e.* from splits s right join expenses e on e.split_id = s.id where e.id=${this.id}`
    );
    const expense = expenseRow.rows[0];
    expenseDetails.name = expense.name;
    expenseDetails.split_type = expense.split_id;
    expenseDetails.amount = expense.amount;
    expenseDetails.split_name = expense.split_name;
    const transactionRow = await new Transactions({
      expenseId: this.id,
    }).getTransactionDetails();
    const transactions = transactionRow.rows;
    expenseDetails.transactions = transactions;
    return expenseDetails;
  };
}
