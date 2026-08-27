import {
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  TriangleAlert,
  Video,
} from "lucide-react";

import {
  DeleteRenderButton,
} from "@/components/renders/DeleteRenderButton";

type RenderItem = {
  id: string;
  status: string;
  progress: number;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  outputPath: string | null;
  errorMessage: string | null;
};

type Props = {
  renders: RenderItem[];
};

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  ).format(date);
}

function getStatusLabel(
  status: string
) {
  switch (status) {
    case "COMPLETED":
      return "Concluído";

    case "RENDERING":
      return "Renderizando";

    case "PENDING":
      return "Pendente";

    case "FAILED":
      return "Falhou";

    default:
      return status;
  }
}

export function RenderHistory({
  renders,
}: Props) {
  return (
    <section
      className="
        mt-8
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
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <h2
            className="
              text-xl
              font-black
              text-white
            "
          >
            Histórico de renderizações
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-zinc-500
            "
          >
            Últimos vídeos gerados deste projeto.
          </p>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-violet-600/15
            text-violet-400
          "
        >
          <Video
            size={21}
          />
        </div>
      </div>

      {/* SEM HISTÓRICO */}

      {renders.length === 0 ? (
        <div
          className="
            mt-7
            rounded-2xl
            border
            border-dashed
            border-white/10
            bg-black/20
            p-8
            text-center
          "
        >
          <Clock3
            size={28}
            className="
              mx-auto
              text-zinc-600
            "
          />

          <p
            className="
              mt-3
              font-bold
              text-zinc-400
            "
          >
            Nenhuma renderização ainda
          </p>
        </div>
      ) : (
        <div
          className="
            mt-7
            space-y-3
          "
        >
          {renders.map(
            (render) => {
              const completed =
                render.status ===
                "COMPLETED";

              const rendering =
                render.status ===
                  "RENDERING" ||
                render.status ===
                  "PENDING";

              const failed =
                render.status ===
                  "FAILED";

              return (
                <article
                  key={
                    render.id
                  }
                  className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/20
                    p-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >
                  {/* INFORMAÇÕES */}

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        ${
                          completed
                            ? "bg-emerald-500/10 text-emerald-400"
                            : rendering
                            ? "bg-violet-500/10 text-violet-400"
                            : failed
                            ? "bg-red-500/10 text-red-400"
                            : "bg-white/5 text-zinc-400"
                        }
                      `}
                    >
                      {completed && (
                        <CheckCircle2
                          size={19}
                        />
                      )}

                      {rendering && (
                        <Loader2
                          size={19}
                          className="animate-spin"
                        />
                      )}

                      {failed && (
                        <TriangleAlert
                          size={19}
                        />
                      )}
                    </div>

                    <div>
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <strong
                          className="
                            text-sm
                            text-white
                          "
                        >
                          {getStatusLabel(
                            render.status
                          )}
                        </strong>

                        {rendering && (
                          <span
                            className="
                              rounded-full
                              bg-violet-500/10
                              px-2
                              py-0.5
                              text-xs
                              font-bold
                              text-violet-400
                            "
                          >
                            {render.progress}%
                          </span>
                        )}
                      </div>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-zinc-500
                        "
                      >
                        Criado em{" "}
                        {formatDate(
                          render.createdAt
                        )}
                      </p>

                      {render.completedAt && (
                        <p
                          className="
                            mt-1
                            text-xs
                            text-zinc-600
                          "
                        >
                          Finalizado em{" "}
                          {formatDate(
                            render.completedAt
                          )}
                        </p>
                      )}

                      {failed &&
                        render.errorMessage && (
                          <p
                            className="
                              mt-2
                              max-w-xl
                              text-xs
                              text-red-400
                            "
                          >
                            {
                              render.errorMessage
                            }
                          </p>
                        )}
                    </div>
                  </div>

                  {/* AÇÕES */}

                  <div
                    className="
                      flex
                      shrink-0
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    {completed && (
                      <a
                        href={`/api/renders/${render.id}/download`}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-emerald-600
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          text-white
                          transition
                          hover:bg-emerald-500
                        "
                      >
                        <Download
                          size={16}
                        />

                        Baixar
                      </a>
                    )}

                    {rendering && (
                      <span
                        className="
                          text-xs
                          font-semibold
                          text-zinc-500
                        "
                      >
                        Processando...
                      </span>
                    )}

                    {!rendering && (
                      <DeleteRenderButton
                        renderId={
                          render.id
                        }
                      />
                    )}
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}