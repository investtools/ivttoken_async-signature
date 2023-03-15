import { ethers } from "ethers"
import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()

export function parse(data) {
    return ethers.utils.parseUnits(Math.ceil(data) + "", "gwei")
}

export async function calcGas(gasEstimated) {
    const getBlockPrice = (await axios.get("https://api.blocknative.com/gasprices/blockprices?chainid=137", { headers: { "Authorization": process.env.BLOCKNATIVE_API_KEY } })).data
    const blockPrice = getBlockPrice.blockPrices[0].estimatedPrices[0]

    let gas = {
        gasLimit: gasEstimated.mul(200).div(100),
        maxFeePerGas: parse(Number(blockPrice.maxFeePerGas) * 1.5),
        maxPriorityFeePerGas: parse(Number(blockPrice.maxPriorityFeePerGas) * 1.5),
    }
    return gas
}