import { useState } from "react";
import { Abertura } from "./components/Abertura";
import { Mensagem } from "./components/Mensagem";
import { ScrollDepthTracker } from "./components/ScrollDepthTracker";
import { Cabecalho, Contato, Sitra, Time, Trabalho } from "./components/Secoes";

export default function App() {
  const [ids, setIds] = useState<string[]>([]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-marca focus:px-5 focus:py-3"
      >
        Pular para o conteúdo
      </a>
      <ScrollDepthTracker />
      <Cabecalho />
      <main id="conteudo">
        <Mensagem ids={ids} onIds={setIds} />
        <Trabalho />
        <Time />
        <Sitra />
        <Contato />
      </main>
      {/* Espaço para a barra de envio não cobrir o fim da página. */}
      {ids.length > 0 && <div aria-hidden className="h-12 bg-marca" />}
      <Abertura />
    </>
  );
}
