import Link from "next/link";

import {
  Download,
  Film,
  Monitor,
  MoreVertical,
  Pencil,
  Play,
} from "lucide-react";

type Props = {
  id: string;
  title: string;
  questionCount: number;
  format: string;
  width: number;
  height: number;
  fps: number;

  /*
   * Último render COMPLETED.
   *
   * Opcional para não quebrar outras
   * telas que usam ProjectCard.
   */
  latestRenderId?: string | null;
};

export function ProjectCard({
  id,
  title,
  questionCount,
  format,
  width,
  height,
  fps,
  latestRenderId = null,
}: Props) {
  const formatLabel =
    format === "VERTICAL"
      ? "Vertical"
      : "Horizontal";

  return (
    <article
      className="
        relative
        rounded-3xl
        border
        border-white/10
        bg-[#101722]
        p-6
        shadow-xl
        transition
        hover:-translate-y-1
        hover:border-violet-500/40
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
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
          <Film
            size={24}
          />
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              rounded-full
              border
              border-white/10
              bg-white/5
              px-3
              py-1
              text-xs
              font-semibold
              text-zinc-400
            "
          >
            {questionCount} perguntas
          </span>

          {/* MENU */}

          <details
            className="
              relative
            "
          >
            <summary
              title="Mais opções"
              className="
                flex
                h-9
                w-9
                cursor-pointer
                list-none
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/5
                text-zinc-400
                transition
                hover:bg-white/10
                hover:text-white
                [&::-webkit-details-marker]:hidden
              "
            >
              <MoreVertical
                size={18}
              />
            </summary>

            <div
              className="
                absolute
                right-0
                top-11
                z-30
                w-60
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#151c28]
                p-2
                shadow-2xl
              "
            >
              {/* DOWNLOAD */}

              {latestRenderId ? (
                <a
                  href={`/api/renders/${latestRenderId}/download`}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-semibold
                    text-zinc-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <Download
                    size={17}
                    className="
                      text-emerald-400
                    "
                  />

                  Baixar último vídeo
                </a>
              ) : (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-zinc-600
                  "
                >
                  <Download
                    size={17}
                  />

                  Nenhum vídeo gerado
                </div>
              )}

              <div
                className="
                  my-1
                  h-px
                  bg-white/10
                "
              />

              {/* EDITAR */}

              <Link
                href={`/projetos/${id}`}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-semibold
                  text-zinc-300
                  transition
                  hover:bg-white/5
                  hover:text-white
                "
              >
                <Pencil
                  size={17}
                />

                Editar projeto
              </Link>

              {/* RENDER */}

              <Link
                href={`/projetos/${id}/renderizar`}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-semibold
                  text-zinc-300
                  transition
                  hover:bg-white/5
                  hover:text-white
                "
              >
                <Play
                  size={17}
                />

                Gerar novo vídeo
              </Link>
            </div>
          </details>
        </div>
      </div>

      {/* INFORMAÇÕES */}

      <div className="mt-6">
        <h2
          className="
            text-xl
            font-black
            tracking-tight
          "
        >
          {title}
        </h2>

        <div
          className="
            mt-3
            flex
            items-center
            gap-2
            text-sm
            text-zinc-400
          "
        >
          <Monitor
            size={16}
          />

          <span>
            {formatLabel}
            {" • "}
            {width}×{height}
            {" • "}
            {fps} FPS
          </span>
        </div>
      </div>

      {/* AÇÕES PRINCIPAIS */}

      <div
        className="
          mt-7
          grid
          grid-cols-2
          gap-3
        "
      >
        <Link
          href={`/projetos/${id}`}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            text-sm
            font-bold
            transition
            hover:bg-white/10
          "
        >
          <Pencil
            size={17}
          />

          Editar
        </Link>

        <Link
          href={`/projetos/${id}/renderizar`}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-violet-600
            px-4
            py-3
            text-sm
            font-bold
            transition
            hover:bg-violet-500
          "
        >
          <Play
            size={17}
          />

          Gerar vídeo
        </Link>
      </div>
    </article>
  );
}