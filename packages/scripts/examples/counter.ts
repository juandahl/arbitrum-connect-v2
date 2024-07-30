
import { ethers, providers, Wallet } from "ethers";
import { sendWithDelayedInbox } from "../src/delayed-inbox";

const walletPrivateKey = process.env.DEVNET_PRIVKEY as string

const l1Provider = new providers.JsonRpcProvider(process.env.L1RPC)
const l2Provider = new providers.JsonRpcProvider(process.env.L2RPC)

const l1Wallet = new Wallet(walletPrivateKey, l1Provider)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

const l2CounterContractAddress = "0x362698Add3e652B9422Ac669d4e228608C6cFecd"

async function readCount() {
    const contract = new ethers.Contract(l2CounterContractAddress, ["function count() view returns (uint256)"], l2Provider);
    console.log(await contract.count())
}

async function incrementCount() {
    const contract = new ethers.Contract(l2CounterContractAddress, ["function increment() public"], l2Wallet);
    console.log(await contract.increment())
}

async function incrementCountWithDelayed() {
    const contract = new ethers.utils.Interface(["function increment() public"]);
    const tx = {
        to: l2CounterContractAddress,
        data: await contract.encodeFunctionData("increment"),
    }

    return await sendWithDelayedInbox(tx, l1Wallet, l2Wallet)
}

// =========================================================================
// Force include a random transaction ======================================
// =========================================================================

// get current contract count, to check if it's incremented after
// readCount()

// increment the count without delayed inbox
// incrementCount()

// increment count with delayed inbox
// incrementCountWithDelayed().then(console.log)