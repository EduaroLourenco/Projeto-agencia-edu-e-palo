import { useEffect } from "react";
import { Catalogo } from "../components/Catalogo";
import { Contato } from "../components/Contato";
import { FaixaSitra } from "../components/Secoes";

export function ServicosPage() {
  useEffect(() => {
    const anterior = document.title;
    document.title = "Catálogo de serviços — BEPA";
    return () => {
      document.title = anterior;
    };
  }, []);

  return (
    <>
      <div className="-mt-[79px]">
        <Catalogo completo />
      </div>
      <div className="pt-[clamp(4rem,8vw,7rem)]">
        <FaixaSitra />
        <Contato />
      </div>
    </>
  );
}
