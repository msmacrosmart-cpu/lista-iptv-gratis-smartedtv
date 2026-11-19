import { RotateCcw, Trash2, HardDriveDownload, PlayCircle, AlertTriangle } from "lucide-react";

const steps = [
  {
    icon: RotateCcw,
    title: "Reinicie o aparelho e tente instalar novamente",
    text: "Reiniciar limpa travamentos temporários do instalador do Android. Depois de ligar de novo, abra o arquivo .apk pela pasta Downloads e toque em instalar.",
    check: "a instalação avança e mostra a confirmação de app instalado.",
  },
  {
    icon: Trash2,
    title: "Se já existia uma versão anterior, desinstale antes",
    text: "Versão antiga com assinatura diferente ou dados presos pode bloquear a instalação por cima. Vá em Configurações > Apps, localize o app anterior, desinstale e instale o novo arquivo.",
    check: "o sistema aceita o pacote novo sem a mensagem de recusa.",
  },
  {
    icon: HardDriveDownload,
    title: "Confira o espaço livre e baixe o arquivo de novo",
    text: "Se continuar falhando, veja se há espaço no armazenamento interno e baixe o .apk novamente caso o download tenha sido interrompido.",
    check: "o arquivo abre sem erro de leitura e conclui a instalação.",
  },
  {
    icon: PlayCircle,
    title: "Abra o app e aguarde a inicialização completa",
    text: "Depois de instalar, abra o app e espere alguns segundos na tela inicial para a configuração do perfil terminar sem interrupções.",
    check: "o app abre na tela principal e abre normalmente nas próximas vezes.",
  },
];

/**
 * Artigo de apoio exibido em um card antes das seções de perguntas (sanfonadas).
 * Conteúdo enxuto, focado no que o usuário faz no aparelho para concluir a instalação.
 */
export function InstallErrorArticle() {
  return (
    <section id="erro-app-nao-instalado" className="scroll-mt-20 mx-auto max-w-[820px] px-5 pb-20">
      <article className="glass-card p-6 sm:p-9">
        <p className="label-text text-[10px] text-silver">Solução de problemas</p>
        <h2 className="title-text mt-3 text-xl sm:text-3xl">
          Como resolver o erro <span className="accent-text">"App não instalado"</span> no Android ou TV Box
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Quando aparece a mensagem <strong className="text-foreground">"App não instalado"</strong>, quase sempre é
          bloqueio temporário do instalador do sistema, arquivo de instalação incompleto ou conflito com uma versão
          anterior que ficou no aparelho. Siga a ordem abaixo — na maioria dos casos o problema se resolve no primeiro
          ou no segundo passo.
        </p>

        <ol className="mt-7 space-y-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="label-text mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-border text-[11px] text-silver">
                {i + 1}
              </span>
              <div>
                <h3 className="flex items-start gap-2 text-sm font-semibold text-foreground">
                  <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-silver" aria-hidden />
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
                <p className="mt-1.5 text-xs text-silver">
                  <span className="font-semibold">Como saber se deu certo:</span> {s.check}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex gap-3 border border-border p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-silver" aria-hidden />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Erro ao abrir o app depois de instalado?</strong> Se o SMARTEDTV
            travar, fechar sozinho ou não passar da tela inicial, basta <strong className="text-foreground">excluir
            o app e instalar novamente</strong> com o arquivo mais recente. Isso resolve a maioria dos erros de
            inicialização, porque a instalação limpa substitui os dados corrompidos da versão anterior.
          </p>
        </div>
      </article>
    </section>
  );
}
