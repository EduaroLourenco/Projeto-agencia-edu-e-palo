-- CreateTable
CREATE TABLE "Loja" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nomeLoja" TEXT NOT NULL,
    "aberto" BOOLEAN NOT NULL DEFAULT true,
    "whatsappNumero" TEXT NOT NULL,
    "mensagemSaudacao" TEXT NOT NULL DEFAULT 'Oi! Recebi seu pedido, já te confirmo o estoque 💕',
    "senhaHash" TEXT NOT NULL,
    "regraAtacadoTipo" TEXT NOT NULL DEFAULT 'quantidade',
    "regraAtacadoMinimo" REAL NOT NULL DEFAULT 6,
    "corDestaque" TEXT NOT NULL DEFAULT '#f22e69',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PontoRetirada" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lojaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    CONSTRAINT "PontoRetirada_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lojaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "precoVarejo" REAL NOT NULL,
    "precoAtacado" REAL NOT NULL,
    "categoriasJson" TEXT NOT NULL,
    "tamanhosJson" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "instagramReelsUrl" TEXT,
    "isUltimasPecas" BOOLEAN NOT NULL DEFAULT false,
    "isAtivo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Produto_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Loja_slug_key" ON "Loja"("slug");
