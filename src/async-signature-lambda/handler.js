"use strict"

import { SignaturesDatabaseService } from "../../database/signaturesDatabaseService.js"
import { SignedTransactionsDatabaseService } from "../../database/signedTransactionsDatabaseService.js"
import { TransactionsToSignDatabaseService } from "../../database/transactionsToSignDatabaseService.js"
import { ethers } from "ethers"
import { signMessages } from "../signing-utils.cjs"
import { multiSigAbi } from "../multiSigAbi.cjs"
import * as dotenv from "dotenv"
import { calcGas } from "../calcGas.js"
dotenv.config()

export async function createSignature(event) {
  try {
    const bodyParsed = JSON.parse(event.body)
    const signerName = bodyParsed.signerName
    const privateKey = bodyParsed.privateKey
    const address = bodyParsed.address

    const signaturesDbService = new SignaturesDatabaseService()
    const createSignature = await signaturesDbService.create(signerName, privateKey, address)

    const response = {
      signatureId: createSignature.id,
      createdAt: createSignature.createdAt
    }

    return {
      statusCode: 201,
      body: JSON.stringify(response)
    }

  } catch (err) {
    return err
  }
}

async function signTransaction(signer1pk, signer2pk, signer3pk, transaction) {
  const provider = new ethers.providers.AlchemyProvider(process.env.PROVIDER_NETWORK, process.env.PROVIDER_API_KEY)
  const wallet1 = new ethers.Wallet(signer1pk, provider)
  const wallet2 = new ethers.Wallet(signer2pk, provider)
  const wallet3 = new ethers.Wallet(signer3pk, provider)
  const multisig = new ethers.Contract(process.env.MULTISIG_CONTRACT_ADDRESS, multiSigAbi, wallet1)

  const nonce = ethers.utils.hexlify(ethers.utils.randomBytes(32))
  const params = {
    to: process.env.CONTRACT_ADDRESS,
    value: "0",
    data: ethers.utils.hexlify(transaction),
    nonce: nonce
  }

  const signatures = await signMessages([wallet1, wallet2, wallet3], process.env.MULTISIG_CONTRACT_ADDRESS, params)
  const gasEstimated = await multisig.connect(wallet1).estimateGas.executeTransaction(signatures, params.to, params.value, params.data, params.nonce)
  const gasPrice = await calcGas(gasEstimated)
  const multisigTx = await multisig.connect(wallet1).executeTransaction(signatures, params.to, params.value, params.data, params.nonce, gasPrice)
  const transactionHash = multisigTx.hash
  return transactionHash
}

export async function submitSignature(event) {
  try {
    const bodyParsed = JSON.parse(event.body)
    const privateKey = bodyParsed.privateKey
    const transaction = bodyParsed.transaction

    const transactionsToSignDbService = new TransactionsToSignDatabaseService()
    const dbTransaction = await transactionsToSignDbService.getSignaturesByTransaction(transaction)

    if (dbTransaction == null) {
      const createTransactionToSign = await transactionsToSignDbService.create(transaction, { signer1: privateKey })
      const response = {
        message: `Waiting for others to sign transaction ${transaction}`,
        signatureId: createTransactionToSign.id,
        createdAt: createTransactionToSign.createdAt
      }

      return {
        statusCode: 201,
        body: JSON.stringify(response)
      }
    }

    const signaturesAmount = Object.keys(dbTransaction.signatures).length
    if (signaturesAmount == 1) {
      const signers = dbTransaction.signatures
      signers.signer2 = privateKey

      const updateTransaction = await transactionsToSignDbService.update(transaction, signers)

      const response = {
        message: `Waiting for others to sign transaction ${transaction}, 2 already signed`,
        signatureId: updateTransaction.id,
        updatedAt: updateTransaction.updatedAt,
        signers: updateTransaction.signatures
      }

      return {
        statusCode: 201,
        body: JSON.stringify(response)
      }
    }

    if (signaturesAmount == 2) {
      const signers = dbTransaction.signatures
      signers.signer3 = privateKey

      const transactionHash = await signTransaction(signers.signer1, signers.signer2, signers.signer3, transaction)

      const signedTransactionsDbService = new SignedTransactionsDatabaseService()
      const signedTransaction = await signedTransactionsDbService.create(transaction, signers)
      await transactionsToSignDbService.delete(transaction)

      const response = {
        message: `Transaction ${transaction} successfully signed`,
        signatureId: signedTransaction.id,
        createdAt: signedTransaction.createdAt,
        signers: signedTransaction.signers,
        transactionHash: transactionHash
      }

      return {
        statusCode: 201,
        body: JSON.stringify(response)
      }
    }

  } catch (err) {
    return err
  }
}