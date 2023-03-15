-- CreateTable
CREATE TABLE "Signatures" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "signerName" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionsToSign" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transaction" TEXT NOT NULL,
    "signatures" JSONB NOT NULL,

    CONSTRAINT "TransactionsToSign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignedTransactions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transaction" TEXT NOT NULL,
    "signers" JSONB NOT NULL,

    CONSTRAINT "SignedTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Signatures_signerName_key" ON "Signatures"("signerName");

-- CreateIndex
CREATE UNIQUE INDEX "Signatures_privateKey_key" ON "Signatures"("privateKey");

-- CreateIndex
CREATE UNIQUE INDEX "Signatures_address_key" ON "Signatures"("address");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionsToSign_transaction_key" ON "TransactionsToSign"("transaction");

-- CreateIndex
CREATE UNIQUE INDEX "SignedTransactions_transaction_key" ON "SignedTransactions"("transaction");
