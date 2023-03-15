import { SignaturesDatabaseService } from "../database/signaturesDatabaseService.js"
import { TransactionsToSignDatabaseService } from "../database/transactionsToSignDatabaseService.js"
import { SignedTransactionsDatabaseService } from "../database/signedTransactionsDatabaseService.js"
import { expect } from "chai"
import { config } from "dotenv"; config()

const signaturesDbService = new SignaturesDatabaseService()
const transactionsToSignDbService = new TransactionsToSignDatabaseService()
const signedTransactionsDbService = new SignedTransactionsDatabaseService()

const signerName = "BlockchainStudio"
const blockchainStudioAddress = process.env.BLOCKCHAIN_STUDIO_ADDRESS
const blockchainStudioPK = process.env.BLOCKCHAIN_STUDIO_PRIVATE_KEY
const transaction = "0xb4bc234e01246da62a"
const signature2 = "1xc4bc234e01246da62a2"


describe("Signatures Database Test", () => {
    it("Should create signer at Signatures database", async () => {
        const create = await signaturesDbService.create(signerName, blockchainStudioPK, blockchainStudioAddress)

        expect(create.signerName).to.be.equal(signerName)
        expect(create.privateKey).to.be.equal(blockchainStudioPK)
        expect(create.address).to.be.equal(blockchainStudioAddress)
    })

    it("Should find signer data by its name", async () => {
        const findSigner = await signaturesDbService.findBySignerName(signerName)

        expect(findSigner.signerName).to.be.equal(signerName)
        expect(findSigner.privateKey).to.be.equal(blockchainStudioPK)
        expect(findSigner.address).to.be.equal(blockchainStudioAddress)
    })

    it("Should find signer data by its address", async () => {
        const findSigner = await signaturesDbService.findByAddress(blockchainStudioAddress)

        expect(findSigner.signerName).to.be.equal(signerName)
        expect(findSigner.privateKey).to.be.equal(blockchainStudioPK)
        expect(findSigner.address).to.be.equal(blockchainStudioAddress)
    })

    it("Should find signer data by its private key", async () => {
        const findSigner = await signaturesDbService.findByPrivateKey(blockchainStudioPK)

        expect(findSigner.signerName).to.be.equal(signerName)
        expect(findSigner.privateKey).to.be.equal(blockchainStudioPK)
        expect(findSigner.address).to.be.equal(blockchainStudioAddress)
    })
})

describe("TransactionsToSign Database Test", () => {
    it("Should create a transaction to sign", async () => {
        const signatures = {
            signature1: blockchainStudioPK
        }
        const create = await transactionsToSignDbService.create(transaction, signatures)

        expect(create.transaction).to.be.equal(transaction)
        expect(Object.keys(create.signatures).length).to.be.equal(1)
    })

    it("Should get signatures of a transaction", async () => {
        const dbTransaction = await transactionsToSignDbService.getSignaturesByTransaction(transaction)

        expect(Object.keys(dbTransaction.signatures).length).to.be.equal(1)
    })

    it("Should update signatures of a transaction", async () => {
        const dbTransaction = await transactionsToSignDbService.getSignaturesByTransaction(transaction)

        expect(Object.keys(dbTransaction.signatures).length).to.be.equal(1)

        const signatures = {
            signature1: dbTransaction.signatures.signature1,
            signature2: signature2
        }

        const updateTransaction = await transactionsToSignDbService.update(transaction, signatures)

        expect(updateTransaction.transaction).to.be.equal(transaction)
        expect(Object.keys(updateTransaction.signatures).length).to.be.equal(2)
    })

    it("Should delete a transaction", async () => {
        const deleteTransaction = await transactionsToSignDbService.delete(transaction)

        expect(deleteTransaction.transaction).to.be.equal(transaction)
    })
})

describe("SignedTransactions Database Test", () => {
    it("Should create a signed transaction", async () => {
        const signers = {
            signature1: blockchainStudioPK,
            signature2: signature2
        }
        
        const create = await signedTransactionsDbService.create(transaction, signers)

        expect(create.transaction).to.be.equal(transaction)
        expect(Object.keys(create.signers).length).to.be.equal(2)
    })

    it("Should get transaction data", async () => {
        const dbTransaction = await signedTransactionsDbService.findByTransaction(transaction)

        expect(dbTransaction.transaction).to.be.equal(transaction)
        expect(Object.keys(dbTransaction.signers).length).to.be.equal(2)
    })
})