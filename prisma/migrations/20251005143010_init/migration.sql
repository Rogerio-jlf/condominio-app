-- CreateEnum
CREATE TYPE "TipoDespesa" AS ENUM ('AGUA', 'GERAL');

-- CreateTable
CREATE TABLE "Condominio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "taxaFundoReserva" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Condominio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartamento" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "morador" TEXT,
    "area" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Apartamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoDespesa" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DespesaRateio" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "apartamentoId" INTEGER NOT NULL,
    "despesaId" INTEGER NOT NULL,

    CONSTRAINT "DespesaRateio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Apartamento_numero_key" ON "Apartamento"("numero");

-- AddForeignKey
ALTER TABLE "DespesaRateio" ADD CONSTRAINT "DespesaRateio_apartamentoId_fkey" FOREIGN KEY ("apartamentoId") REFERENCES "Apartamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DespesaRateio" ADD CONSTRAINT "DespesaRateio_despesaId_fkey" FOREIGN KEY ("despesaId") REFERENCES "Despesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
