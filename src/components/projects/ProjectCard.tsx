import Link from "next/link";
import {
  Film,
  Monitor,
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
};

export function ProjectCard({
  id,
  title,
  questionCount,
  format,
  width,
  height,
  fps,
}: Props) {
  const formatLabel =
    format === "VERTICAL"
      ? "Vertical"
      : "Horizontal";

  return (
    <article
      className="
        group
        rounded-3xl
        border border-white/10
        bg-zinc-900/80
        p-6
        shadow-xl
        transition
        hover:-translate-y-1
        hover:border-violet-500/40
        hover:shadow-violet-950/30
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex h-12 w-12
            items-center justify-center
            rounded-2xl
            bg-violet-600/15
            text-violet-400
          "
        >
          <Film size={24} />
        </div>

        <span
          className="
            rounded-full
            border border-white/10
            bg-white/5
            px-3 py-1
            text-xs font-semibold
            text-zinc-400
          "
        >
          {questionCount} perguntas
        </span>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-black tracking-tight text-white">
          {title}
        </h2>

        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
          <Monitor size={16} />

          <span>
            {formatLabel} • {width}×{height} • {fps} FPS
          </span>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <Link
          href={`/projetos/${id}`}
          className="
            flex items-center justify-center
            gap-2
            rounded-xl
            border border-white/10
            bg-white/5
            px-4 py-3
            text-sm font-bold
            text-white
            transition
            hover:bg-white/10
          "
        >
          <Pencil size={17} />

          Editar
        </Link>

        <Link
          href={`/projetos/${id}/renderizar`}
          className="
            flex items-center justify-center
            gap-2
            rounded-xl
            bg-violet-600
            px-4 py-3
            text-sm font-bold
            text-white
            transition
            hover:bg-violet-500
          "
        >
          <Play size={17} />

          Gerar vídeo
        </Link>
      </div>
    </article>
  );
}