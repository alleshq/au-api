# Au API
This is the API for Au Accounts. It uses Basic HTTP Auth, with the account id and secret. The api is at `https://au.alles.cx/api/v1`.

### Endpoints:
- Account Info: `GET /account`
- Reset Secret: `POST /account/secret`
- Get Transactions: `GET /transactions`
- Get Specific Transaction: `GET /transaction/:id`
- Create Transaction: `POST /transaction/:accountid`
- Refund Transaction: `DELETE /transaction/:id`

You can only refund a transaction if you were the reciever and the sender still exists. When you refund a transaction, the transaction fee is not refunded.

You can only get transaction data about transactions that you were involved in.

Specify the amount of Au with the `amount` body parameter. The minimum amount of Au you are allowed to send is 10, the maximum is 1000000, and a 1 Au fee is deducted from each transaction in order to prevent abuse. The fee is added to the Vault account, and the Au will be redistributed through various means.

When you create a transaction, you can pass an optional `meta` string, that must be between 5 and 100 characters. This is designed for automated transaction systems.