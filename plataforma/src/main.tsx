import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App";
import { registrarBlocosDoNucleo } from "./blocos";
import { registrarModulos } from "./modulos";

// Ordem importa: os módulos publicam blocos, então o registro precisa estar
// completo antes de qualquer tela tentar montar uma página.
registrarBlocosDoNucleo();
registrarModulos();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
