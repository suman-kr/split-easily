# Splitwise

- Built using Node.js

## Running the project
```
yarn
docker-compose up --build
```
> Note: Clean the containers in case of failure and retry the docker build

## API Endpoints
- `/add-user` : Add a new user
- `/add-expense`: Create a new expense
- `/balances` : View all the balances across all the users
- `/balance` : View individual balance for an user 
> Negative balance means the user is in debt. Positive denotes the credit to be recieved.
- `/expense` : View the details of an expense

## Relations
- users table
```
                                        Table "public.users"
   Column   |            Type             | Collation | Nullable |              Default
------------+-----------------------------+-----------+----------+-----------------------------------
 id         | integer                     |           | not null | nextval('users_id_seq'::regclass)
 username   | character varying(50)       |           | not null |
 created_on | timestamp without time zone |           |          | timezone('utc'::text, now())
```
- splits table
```
                      Table "public.splits"
 Column |         Type          | Collation | Nullable | Default
--------+-----------------------+-----------+----------+---------
 id     | integer               |           | not null |
 name   | character varying(50) |           |          |
```

- expenses table
```
                                    Table "public.expenses"
  Column  |         Type          | Collation | Nullable |               Default
----------+-----------------------+-----------+----------+--------------------------------------
 id       | integer               |           | not null | nextval('expenses_id_seq'::regclass)
 name     | character varying(50) |           |          |
 split_id | integer               |           |          |
 amount   | integer               |           |          |
```

- transactions table
```
                                     Table "public.transactions"
   Column   |         Type          | Collation | Nullable |                 Default
------------+-----------------------+-----------+----------+------------------------------------------
 id         | integer               |           | not null | nextval('transactions_id_seq'::regclass)
 user_id    | integer               |           |          |
 expense_id | integer               |           |          |
 amount     | character varying(50) |           |          |
```

- balances table
```
                                        Table "public.balances"
      Column      |         Type          | Collation | Nullable |               Default
------------------+-----------------------+-----------+----------+--------------------------------------
 id               | integer               |           | not null | nextval('balances_id_seq'::regclass)
 user_id          | integer               |           |          |
 amount           | character varying(50) |           |          |
 transact_user_id | integer               |           |          |
```

## Assumptions 
- Total amount spent consistency throughout the expense
- Percentage share and amount share per user should be equal to the spent amount in the expense

