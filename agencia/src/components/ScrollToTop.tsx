import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }

    // Em navegação full-page (ex: /servicos -> /#setores), o elemento com o id
    // ainda não existe no primeiro paint, então o scroll nativo do navegador
    // pro anchor falha. Tentamos de novo depois que o React termina de montar.
    const id = hash.slice(1);
    const tentarScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    };
    tentarScroll();
    const timeout = setTimeout(tentarScroll, 100);
    return () => clearTimeout(timeout);
  }, [pathname, hash]);

  return null;
}
