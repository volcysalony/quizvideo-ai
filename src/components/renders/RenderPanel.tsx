"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  CheckCircle2,
  Download,
  Loader2,
  Play,
  RefreshCw,
  TriangleAlert,
  Video,
} from "lucide-react";

type RenderStatus =
  | "PENDING"
  | "RENDERING"
  | "COMPLETED"
  | "FAILED";

type RenderData = {
  id: string;
  status: string;
  progress: number;
  outputPath: string | null;
  errorMessage: string | null;
  createdAt?: string | Date;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
};

type Props = {
  projectId: string;
  initialRender: RenderData | null;
};

export function RenderPanel({
  projectId,
  initialRender,
}: Props) {
  const router =
    useRouter();

  const [
    render,
    setRender,
  ] = useState<RenderData | null>(
    initialRender
  );

  const [
    starting,
    setStarting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * Evita chamar router.refresh()
   * várias vezes para o mesmo render.
   *
   * Se o render já estava finalizado
   * quando a página abriu, não precisamos
   * atualizar novamente.
   */
  const refreshedRenderId =
    useRef<string | null>(
      initialRender &&
        (
          initialRender.status ===
            "COMPLETED" ||
          initialRender.status ===
            "FAILED"
        )
        ? initialRender.id
        : null
    );

  const status =
    render?.status as
      | RenderStatus
      | undefined;

  const isActive =
    status === "PENDING" ||
    status === "RENDERING";

    /*
 * Mantém o estado local sincronizado
 * quando router.refresh() entrega
 * um novo último render.
 */
useEffect(() => {
  setRender(
    initialRender
  );

  if (
    initialRender &&
    (
      initialRender.status ===
        "COMPLETED" ||
      initialRender.status ===
        "FAILED"
    )
  ) {
    refreshedRenderId.current =
      initialRender.id;
  } else {
    refreshedRenderId.current =
      null;
  }
}, [
  initialRender?.id,
  initialRender?.status,
]);


  /*
   * =====================================================
   * POLLING
   * =====================================================
   */

  useEffect(() => {
    if (
      !render?.id ||
      !isActive
    ) {
      return;
    }

    const interval =
      window.setInterval(
        async () => {
          try {
            const response =
              await fetch(
                `/api/renders/${render.id}`,
                {
                  cache:
                    "no-store",
                }
              );

            if (!response.ok) {
              return;
            }

            const data =
              (await response.json()) as RenderData;

            setRender(data);
          } catch (pollError) {
            console.error(
              "Erro ao consultar render:",
              pollError
            );
          }
        },
        1000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    render?.id,
    isActive,
  ]);

  /*
   * =====================================================
   * ATUALIZA SERVER COMPONENTS
   * =====================================================
   *
   * Quando o render terminar, atualizamos
   * automaticamente a página.
   *
   * Isso faz o histórico abaixo receber
   * o novo registro sem F5.
   */

  useEffect(() => {
    if (!render?.id) {
      return;
    }

    const finished =
      status === "COMPLETED" ||
      status === "FAILED";

    if (!finished) {
      return;
    }

    if (
      refreshedRenderId.current ===
      render.id
    ) {
      return;
    }

    refreshedRenderId.current =
      render.id;

    router.refresh();
  }, [
    render?.id,
    status,
    router,
  ]);

  /*
   * =====================================================
   * INICIAR RENDER
   * =====================================================
   */

  async function startRender() {
    try {
      setStarting(true);
      setError("");

      const response =
        await fetch(
          `/api/projetos/${projectId}/renders`,
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      /*
       * Já existe um render ativo.
       */
      if (
        response.status === 409 &&
        data.renderId
      ) {
        refreshedRenderId.current =
          null;

        setRender({
          id:
            data.renderId,

          status:
            data.status ??
            "RENDERING",

          progress:
            0,

          outputPath:
            null,

          errorMessage:
            null,
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Não foi possível iniciar a renderização."
        );
      }

      /*
       * Novo render.
       *
       * Liberamos novamente o refresh
       * automático quando ele terminar.
       */
      refreshedRenderId.current =
        null;

      setRender({
        id:
          data.renderId,

        status:
          data.status ??
          "PENDING",

        progress:
          0,

        outputPath:
          null,

        errorMessage:
          null,
      });
    } catch (startError) {
      const message =
        startError instanceof Error
          ? startError.message
          : "Não foi possível iniciar o render.";

      setError(message);
    } finally {
      setStarting(false);
    }
  }

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-[#101722]
        p-6
        md:p-8
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-violet-600/15
              text-violet-400
            "
          >
            <Video
              size={24}
            />
          </div>

          <div>
            <h2
              className="
                text-xl
                font-black
                text-white
              "
            >
              Renderização
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Gere o arquivo MP4 final do quiz.
            </p>
          </div>
        </div>
      </div>

      {/* SEM RENDER */}

      {!render && (
        <div
          className="
            mt-8
            rounded-2xl
            border
            border-dashed
            border-white/10
            bg-black/20
            p-10
            text-center
          "
        >
          <Play
            size={34}
            className="
              mx-auto
              text-zinc-600
            "
          />

          <h3
            className="
              mt-4
              font-black
              text-white
            "
          >
            Pronto para gerar
          </h3>

          <p
            className="
              mx-auto
              mt-2
              max-w-md
              text-sm
              text-zinc-500
            "
          >
            O sistema usará as configurações,
            perguntas, imagens e formato atuais.
          </p>

          <button
            type="button"
            onClick={
              startRender
            }
            disabled={
              starting
            }
            className="
              mt-6
              inline-flex
              min-w-[180px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-violet-600
              px-5
              py-3
              font-bold
              text-white
              transition
              hover:bg-violet-500
              disabled:opacity-60
            "
          >
            {starting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Preparando...
              </>
            ) : (
              <>
                <Play
                  size={18}
                />

                Gerar vídeo
              </>
            )}
          </button>
        </div>
      )}

      {/* RENDER ATIVO */}

      {render &&
        isActive && (
          <div
            className="
              mt-8
              rounded-2xl
              border
              border-violet-500/20
              bg-violet-500/[0.05]
              p-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Loader2
                  size={20}
                  className="
                    animate-spin
                    text-violet-400
                  "
                />

                <div>
                  <p
                    className="
                      font-bold
                      text-white
                    "
                  >
                    {status ===
                    "PENDING"
                      ? "Preparando render..."
                      : "Gerando vídeo..."}
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-zinc-500
                    "
                  >
                    Não feche o servidor enquanto o vídeo estiver sendo processado.
                  </p>
                </div>
              </div>

              <strong
                className="
                  text-xl
                  text-violet-400
                "
              >
                {render.progress}%
              </strong>
            </div>

            <div
              className="
                mt-6
                h-3
                overflow-hidden
                rounded-full
                bg-black/30
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-violet-500
                  transition-all
                  duration-500
                "
                style={{
                  width:
                    `${render.progress}%`,
                }}
              />
            </div>
          </div>
        )}

      {/* COMPLETO */}

      {render &&
        status ===
          "COMPLETED" && (
          <div
            className="
              mt-8
              rounded-2xl
              border
              border-emerald-500/20
              bg-emerald-500/[0.05]
              p-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <CheckCircle2
                size={24}
                className="
                  text-emerald-400
                "
              />

              <div>
                <h3
                  className="
                    font-black
                    text-white
                  "
                >
                  Vídeo gerado com sucesso
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-500
                  "
                >
                  Seu MP4 está pronto para download.
                </p>
              </div>
            </div>

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >
              <a
                href={`/api/renders/${render.id}/download`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-emerald-600
                  px-5
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-emerald-500
                "
              >
                <Download
                  size={18}
                />

                Baixar MP4
              </a>

              <button
                type="button"
                onClick={
                  startRender
                }
                disabled={
                  starting
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-5
                  py-3
                  font-bold
                  text-zinc-300
                  transition
                  hover:bg-white/10
                  hover:text-white
                  disabled:opacity-60
                "
              >
                {starting ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <RefreshCw
                    size={18}
                  />
                )}

                Gerar novamente
              </button>
            </div>
          </div>
        )}

      {/* FALHOU */}

      {render &&
        status ===
          "FAILED" && (
          <div
            className="
              mt-8
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/[0.05]
              p-6
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              <TriangleAlert
                size={22}
                className="
                  mt-0.5
                  text-red-400
                "
              />

              <div>
                <h3
                  className="
                    font-black
                    text-white
                  "
                >
                  Falha ao gerar vídeo
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-red-300
                  "
                >
                  {render.errorMessage ??
                    "Ocorreu um erro durante a renderização."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                startRender
              }
              disabled={
                starting
              }
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-violet-600
                px-5
                py-3
                font-bold
                text-white
                transition
                hover:bg-violet-500
                disabled:opacity-60
              "
            >
              {starting ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw
                  size={18}
                />
              )}

              Tentar novamente
            </button>
          </div>
        )}

      {/* ERRO HTTP */}

      {error && (
        <div
          className="
            mt-5
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-sm
            font-semibold
            text-red-400
          "
        >
          {error}
        </div>
      )}
    </div>
  );
}