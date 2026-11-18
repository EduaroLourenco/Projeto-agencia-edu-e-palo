import assert from "node:assert/strict";
import { mensagem } from "../src/data/content.ts";

assert.equal(mensagem([], "vendas"), "Olá, BEPA. Quero vender mais.");
assert.equal(mensagem([], "tempo"), "Olá, BEPA. Quero ganhar tempo.");
assert.equal(mensagem(["loja-virtual"], "tempo"), "Olá, BEPA. Quero vender mais com loja virtual.");
assert.equal(
  mensagem(["marketplaces", "loja-virtual", "trafego"], "vendas"),
  "Olá, BEPA. Quero vender mais com marketplaces, loja virtual e tráfego e redes sociais.",
);
assert.equal(
  mensagem(["fluxo-caixa", "catalogo-whatsapp"], "vendas"),
  "Olá, BEPA. Quero vender mais com catálogo no WhatsApp e controlar as finanças com fluxo de caixa.",
);
console.log("mensagem ok");
