import express from "express";
import {
  addExpense,
  addUser,
  fetchAllBalances,
  fetchBalanceByUserId,
  getExpenseById,
} from "./services";

const router = express.Router();
router.post("/add-user", addUser);
router.post("/add-expense", addExpense);
router.get("/balances", fetchAllBalances);
router.get("/balance", fetchBalanceByUserId);
router.get("/expense", getExpenseById);

export { router as Routes };
