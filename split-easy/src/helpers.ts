import { AllPayments } from "./services";

export const getAllBalancesForUsers = (balancesRows) => {
  const balances = {};
  for (const balance of balancesRows) {
    balances[balance.user_id] = {
      ...(balances[balance.user_id] || {}),
      [balance.transact_user_id]:
        Number(balance.amount) +
        (balances[balance.user_id]?.[balance.transact_user_id] || 0),
    };
  }
  return balances;
};

export const generateBalancesBasedOnSplits = (
  allPayments: AllPayments = {}
) => {
  const payeesData = Object.values(allPayments).filter(
    ({ balance }) => balance < 0
  );
  const payersData = Object.values(allPayments).filter(
    ({ balance }) => balance > 0
  );
  for (const payee of payeesData) {
    for (const payer of payersData) {
      const payerAmount = allPayments[payer.userId].balance;
      const payeeAmount = allPayments[payee.userId].balance;
      if (payerAmount === 0) continue;
      const minBalance = Math.min(Math.abs(payeeAmount), payerAmount);
      const temp = allPayments[payer.userId];
      allPayments[payer.userId] = {
        ...temp,
        balance: temp.balance - minBalance,
        payers: [
          ...temp.payers,
          {
            [payee.userId]: minBalance,
          },
        ],
      };
      const temp1 = allPayments[payee.userId];
      if (minBalance > 0)
        allPayments[payee.userId] = {
          ...temp1,
          balance: -temp1.balance - minBalance,
          payee: [
            ...temp1.payee,
            {
              [payer.userId]: -minBalance,
            },
          ],
        };
    }
  }
};



