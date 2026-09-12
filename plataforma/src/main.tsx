import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App";
import { registrarBlocosDoNucleo } from "./blocos";
import { registrarModulos } from "./modulos";

// Ordem importa: os módulos publicam blocos, então o registro precisa estar
// completo antes de qualquer tela tentar montar uma página.
registrarBlocosDoNucleo();
registrarModulos();

// Hospedagem sem regra de reescrita (um HTML só, mandado por link pro cliente)
// não sabe servir /vale-verde/estudio. Nesse caso a rota vive depois do #.
const Roteador = import.meta.env.VITE_ROTA_HASH ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Roteador>
      <App />
    </Roteador>
  </StrictMode>,
);
