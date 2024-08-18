import { Request, Response } from "express";
import { User } from "../models/user";
import { sendResponse } from "../utils";
import { Expense } from "../models/expense";
import { Balances } from "../models/balances";

export const addUser = async (req: Request, res: Response) => {
  const payload = req.body as UserPayload;
  try {
    await new User({
      username: payload.username,
    }).addUser();
    return sendResponse(res, 201, {
      response: "user added",
      status: 201,
    });
  } catch (err) {
    return sendResponse(res, 500, {
      response: "error occured",
      status: 500,
    });
  }
};

export const addExpense = async (req: Request, res: Response) => {
  const payload = req.body as ExpensePayload;
  try {
    await new Expense({
      amount: payload.amount,
      name: payload.name,
      splitId: payload.split_id,
      payees: payload.payees,
      users: payload.users,
      amountSplits: payload?.amount_splits,
    }).createExpense();
    return sendResponse(res, 201, {
      response: "expense added",
      status: 201,
    });
  } catch (err) {
    return sendResponse(res, 500, {
      response: "error occured",
      status: 500,
    });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const expenseDetails = await new Expense({
      id: id as unknown as number,
    }).getExpenseDetails();
    return sendResponse(res, 200, {
      response: expenseDetails,
      status: 200,
    });
  } catch (err) {
    return sendResponse(res, 500, {
      response: "error occured",
      status: 500,
    });
  }
};

export const fetchAllBalances = async (req: Request, res: Response) => {
  try {
    const balances = await new Balances({}).getAllBalances();
    return sendResponse(res, 200, {
      response: balances,
      status: 200,
    });
  } catch (err) {
    return sendResponse(res, 500, {
      response: "error occured",
      status: 500,
    });
  }
};

export const fetchBalanceByUserId = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const balances = await new Balances({
      userId: id as unknown as number,
    }).getBalanceByUserId();
    return sendResponse(res, 200, {
      response: balances,
      status: 200,
    });
  } catch (err) {
    return sendResponse(res, 500, {
      response: "error occured",
      status: 500,
    });
  }
};

interface UserPayload {
  username: string;
}

interface ExpensePayload {
  name: string;
  split_id: number;
  payees: Array<{
    userId: number;
    amount: number;
  }>;
  amount: number;
  users: number[];
  amount_splits?: Array<{
    userId: number;
    amount?: number;
    percent?: number;
  }>;
}

export interface AllPayments {
  user?: {
    amount: number;
    balance: number;
    payee: any[];
    payers: any[];
    userId: string;
  };
}
