import { prisma } from "./prisma.js"

export class SignedTransactionsDatabaseService {
    db
    constructor() {
        this.db = prisma.signedTransactions
    }

    create(transaction, signers) {
        return this.db.create({
            data: {
                transaction,
                signers
            }
        })
    }

    findByTransaction(transaction) {
        return this.db.findUnique({
            where: {
                transaction
            }
        })
    }
}