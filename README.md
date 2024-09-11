# Arbitrum transaction enforcer

## Prequisites

- Node version: 18.18.2
- npm version: 9.8.1
- pnpm version: 9.5.0

## Run ui cypress tests

Setup a `.env` like this one.

```
PRIVATE_KEY=0xc64...
# Uncomment to skip tests involving metamask
# SKIP_METAMASK_SETUP=true
# SKIP_METAMASK_INSTALL=true
```

If metamask is involved, tests should be run one by one like:
- `npx synpress run --configFile synpress.config.js --spec tests/e2e/specs/{name}.spec.ts`

Otherwise you can run all tests together like 
- `npm run e2e:run`
- `pnpm e2e:run`


## Run UI
Install dependencies
`pnpm install`

Run dev script
`pnpm dev`

## Deploy UI

This repository is configured to deploy itself with github actions in order to simplify the process, feel free to check the github workflow files themselves.

If you want to execute it on your own, execute both infra & ui github workflows scripts manually on your machine replacing the corresponding variables. 
AWS region is defined on the samconfig.toml file. 

If you want Github workflows to deploy it configure those variables on your github repository:
- Variables
   - AWS_REGION
   - STACK_NAME
   - UI_DOMAIN
   - HOSTED_ZONE_ID
   - AWS_CERTIFICATE_ID
- Secrets
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY

The UI resources are streamlined with an AWS cloudformation template, if you want to simplify the instalation and do not use DNS, you may remove those parts from both the AWS cloudformation template and github workflow  

# Arbitrum Connect user guide
Arbitrum Connect is our dApp that allows Arbitrum users to withdraw funds to Ethereum regardless of the Sequencer working or not.
This document explains how to make use of our tool and it also briefly describes it's internals.

## Arbitrum withdrawal ideal flow
User's transactions should always reach Ethereum network if they were accepted by Arbitrum network and it's the Sequencer's job to do so, *which has a chance to fail too*.

The Sequencer is responsible of two main actions on this flow:
* Reading L2 transactions
* Batching L2 transactions into L1

## User pain point 
Users may need to bypass the Sequencer in case their transaction doesn't reach the Ethereum network, but doing so requires deep blockchain knowledge and software developing skills.

## How we solved it
Our dApp simplifies the process, giving the user a relaxed and inuitive interface to follow the required steps to safely execute a withdrawal bypassing the Sequencer, steps are described as it follows:

1. Connect your wallet & set the amount to withdraw from Arbitrum.
2. Check for estimated fees and understand the process costs.
3. Sign the Arbitrum withdraw transaction.
    * It may prompt the wallet once or twice: Firstly to ensure Arbitrum network is set and afterwards to sign your L2 transaction
4. Send the signed transaction to Arbitrum's Delayed Inbox (which lives on Ethereum network).
    * Skips the Sequencer's reading.
    * It may take 15-60 minutes to the Ethereum network to process the transaction.
    * It may prompt the wallet once or twice: Firstly to en sure Ethereum network is set and afterwards to send your L2 transaction to the Delayed Inbox.
6. Force the inclusion of the transaction.
    * Skips the Sequencer's batching.
    * Only eligible if the Sequencer didn't include the transaction past 24 hours.
    * It may prompt the wallet once or twice: Firstly to en sure Ethereum network is set and afterwards to send your L2 transaction to the Delayed Inbox.
7. Claim funds
    * It may prompt the wallet once or twice: Firstly to en sure Ethereum network is set and afterwards to claim your funds. 
    * Once the withdraw transaction efectively reached the L1, funds are ready to be claimed

The process is asynchronous in many ways, which requires the user to check later on the status to keep going forward. To resume a withdrawal or manage any withdrawal, the **Activity tab** is there to list the user's history, check their curent status and execute actions on them if required.