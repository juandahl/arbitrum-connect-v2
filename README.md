# Arbitrum Transaction Enforcer

## Prerequisites

- Node version: 18.18.2
- npm version: 9.8.1
- pnpm version: 9.5.0

## Install dependencies:

Install dependencies running from the root:

`pnpm i`

## Environments Variables

Inside the ui folder, set up a `.env` file like this:

```sh
# /ui/.env
PRIVATE_KEY=0xc64...

VITE_IS_TESTNET=true
VITE_HTTPS_ETH_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_HTTPS_ARB_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Uncomment to skip tests involving MetaMask
# SKIP_METAMASK_SETUP=true
# SKIP_METAMASK_INSTALL=true
```

## Run UI

Then, navigate to the ui folder:

`cd packages/ui`

Run the development script:

`pnpm dev`

## Run UI Cypress Tests

> To run the tests, be sure to have the ui running in another console

If MetaMask is involved, tests should be run one by one like:

`pnpm dlx synpress run --configFile synpress.config.js --spec tests/e2e/specs/{name}.spec.ts`

Otherwise, you can run all tests together with:

`pnpm e2e:run`

## Deploy UI

This repository is configured to deploy itself using GitHub Actions to simplify the process. Feel free to check the GitHub workflow files.

If you want GitHub workflows to handle the deployment, configure the following variables in your GitHub repository:

### Variables:

- `AWS_REGION`
- `STACK_NAME`
- `UI_DOMAIN`
- `HOSTED_ZONE_ID`
- `AWS_CERTIFICATE_ID`

### Secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

If you want to execute it manually, run both the _infra.yml_ and _ui.yml_ workflow scripts on your machine, replacing the corresponding variables.

The AWS region is defined in the `samconfig.toml` file.

The UI resources are streamlined with an AWS CloudFormation template. If you want to simplify the installation and not use DNS, you can remove those parts from both the CloudFormation template and the GitHub workflow.

# Arbitrum Connect User Guide

Arbitrum Connect is our dApp that allows Arbitrum users to withdraw funds to Ethereum, whether or not the Sequencer is operational.

This document explains how to use our tool and briefly describes its internals.

## Arbitrum Withdrawal Ideal Flow

Users' transactions should always reach the Ethereum network if they were accepted by the Arbitrum network, but this relies on the Sequencer, which can occasionally fail.

The Sequencer has two primary responsibilities in this process:

- Reading L2 transactions
- Batching L2 transactions into L1

## User Pain Point

Users may need to bypass the Sequencer if their transaction doesn't reach the Ethereum network. However, doing this requires deep blockchain knowledge and software development skills.

## Our Solution

Our dApp simplifies the process, providing users with an intuitive interface to follow the required steps to safely execute a withdrawal while bypassing the Sequencer. The steps are as follows:

1. Connect your wallet and set the amount to withdraw from Arbitrum.

2. Check the estimated fees and understand the process costs.

3. Sign the Arbitrum withdrawal transaction.

   - This may prompt the wallet once or twice: first to ensure the Arbitrum network is set, then to sign your L2 transaction.

4. Send the signed transaction to Arbitrum's Delayed Inbox (on the Ethereum network).

   - This bypasses the Sequencer’s reading.
   - It may take 15-60 minutes for the Ethereum network to process the transaction.
   - The wallet may prompt you again to ensure the Ethereum network is set and to send your L2 transaction to the Delayed Inbox.

5. Force the inclusion of the transaction.

   - This bypasses the Sequencer’s batching.
   - This step is only necessary if the Sequencer hasn’t included the transaction within 24 hours.
   - Again, the wallet may prompt you to ensure the Ethereum network is set and to send your L2 transaction.

6. Claim funds.
   - The wallet may prompt you again to ensure the Ethereum network is set and to claim your funds.
   - Once the withdrawal transaction reaches L1, the funds are ready to be claimed.

The process is asynchronous in several ways, so users will need to check the status and resume the withdrawal if necessary. The **Activity tab** lists the user's transaction history, current statuses, and available actions for ongoing withdrawals.
