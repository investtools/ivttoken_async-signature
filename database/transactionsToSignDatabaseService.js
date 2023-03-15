import { prisma } from "./prisma.js"

export class TransactionsToSignDatabaseService {
    db
    constructor() {
        this.db = prisma.transactionsToSign
    }

    create(transaction, signatures) {
        return this.db.create({
            data: {
                transaction,
                signatures
            }
        })
    }

    getSignaturesByTransaction(transaction) {
        return this.db.findFirst({
            where: {
                transaction
            }
        })
    }

    update(transaction, signatures) {
        return this.db.update({
            where: {
                transaction
            },
            data: {
                signatures
            }
        })
    }

    delete(transaction) {
        return this.db.delete({
            where: {
                transaction
            }
        })
    }
}