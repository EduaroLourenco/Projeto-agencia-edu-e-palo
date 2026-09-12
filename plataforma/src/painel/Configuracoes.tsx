import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import { Campo, Entrada, Sobrescrito } from "../design/Primitivos";
import { ControleCampo } from "../estudio/Controles";

/**
 * A ficha da loja.
 *
 * Nome, recado, telefone e se está aberta. Parece pouco, mas era tudo
 * que só existia dentro do arquivo da demo — e portanto fora do alcance
 * de quem não programa.
 */
export function Configuracoes({ loja, onMudar }: { loja: Loja; onMudar: (loja: Loja) => void }) {
  const [zap, setZap] = useState(loja.whatsapp);
  const digitos = zap.replace(/\D/g, "");
  const zapValido = digitos.length >= 12 && digitos.length <= 13;

  return (
    <div className="flex flex-col gap-4">
      <Campo rotulo="Nome da loja">
        {(p) => (
          <Entrada {...p} value={loja.nome} onChange={(e) => onMudar({ ...loja, nome: e.target.value })} />
        )}
      </Campo>

      <Campo rotulo="Recado curto" dica="Aparece embaixo do nome na lista de lojas.">
        {(p) => (
          <Entrada
            {...p}
            value={loja.descricao}
            onChange={(e) => onMudar({ ...loja, descricao: e.target.value })}
          />
        )}
      </Campo>

      <Campo
        rotulo="WhatsApp que recebe os pedidos"
        dica="Com país e DDD: 55 + 16 + o número. É pra onde o pedido vai."
      >
        {(p) => (
          <div className="flex flex-col gap-1.5">
            <Entrada
              {...p}
              type="tel"
              inputMode="numeric"
              value={zap}
              onChange={(e) => setZap(e.target.value)}
              onBlur={() => onMudar({ ...loja, whatsapp: digitos })}
              className="num-tab"
              placeholder="5516920093456"
            />
            {!zapValido && zap.length > 0 && (
              <p className="text-[12px] font-semibold text-atencao">
                Faltam dígitos. Um celular brasileiro fica com 13: 55 + DDD + 9 dígitos.
              </p>
            )}
            {zapValido && (
              <a
                href={`https://wa.me/${digitos}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--marca-600)]"
              >
                Testar este número
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        )}
      </Campo>

      <ControleCampo
        campo={{
          tipo: "simNao",
          rotulo: "Loja aberta agora",
          dica: "Fechada, o cliente ainda monta o pedido — ele só sabe que sai amanhã.",
        }}
        valor={loja.aberta}
        onMudar={(v) => onMudar({ ...loja, aberta: Boolean(v) })}
        imagensDisponiveis={[]}
      />

      <section className="mt-2 border-t border-borda pt-4">
        <Sobrescrito>Endereço da loja</Sobrescrito>
        <p className="num-tab mt-2 break-all bg-papel-3 px-3.5 py-2.5 text-[12.5px] text-tinta-70" style={{ borderRadius: "var(--canto-m)" }}>
          {location.origin}
          {location.pathname}#/{loja.slug}
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-tinta-45">
          É este link que vai na bio do Instagram e no papel de parede do WhatsApp.
        </p>
      </section>
    </div>
  );
}
