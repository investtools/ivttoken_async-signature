import { prisma } from "./prisma.js"

export class SignaturesDatabaseService {
    db
    constructor() {
        this.db = prisma.signatures
    }

    create(signerName, privateKey, address) {
        return this.db.create({
            data: {
                signerName,
                privateKey,
                address
            }
        })
    }

    findBySignerName(signerName) {
        return this.db.findUnique({
            where: {
                signerName
            }
        })
    }

    findByPrivateKey(privateKey) {
        return this.db.findUnique({
            where: {
                privateKey
            }
        })
    }

    findByAddress(address) {
        return this.db.findUnique({
            where: {
                address
            }
        })
    }
}