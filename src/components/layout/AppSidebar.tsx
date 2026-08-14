import Link from "next/link";

import {
  AudioLines,
  FolderKanban,
  Gauge,
  Image,
  Library,
  Music,
  Plus,
  Settings,
  Sparkles,
  Video,
  WandSparkles,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: Gauge,
  },
  {
    label: "Projetos",
    href: "/projetos",
    icon: FolderKanban,
  },
  {
    label: "Perguntas",
    href: "/perguntas",
    icon: Sparkles,
  },
  {
    label: "Templates",
    href: "/templates",
    icon: WandSparkles,
  },
];

export function AppSidebar() {
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        hidden
        h-screen
        w-[230px]
        flex-col
        border-r
        border-white/10
        bg-[#0b111c]
        lg:flex
      "
    >
      {/* LOGO */}

      <div className="px-5 py-6">
        <Link
          href="/projetos"
          className="flex items-center gap-3"
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-violet-600
              text-white
            "
          >
            <Video size={21} />
          </div>

          <div className="text-lg font-black text-white">
            QuizVideo{" "}
            <span className="text-violet-400">
              AI
            </span>
          </div>
        </Link>

        {/* NOVO PROJETO */}

        <Link
          href="/projetos/novo"
          className="
            mt-7
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-violet-600
            px-4
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-violet-500
          "
        >
          <Plus size={18} />

          Novo Projeto
        </Link>
      </div>

      {/* MENU */}

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-zinc-400
                  transition
                  hover:bg-white/5
                  hover:text-white
                "
              >
                <Icon size={18} />

                {item.label}
              </Link>
            );
          })}
        </div>

        {/* BIBLIOTECA */}

        <div className="mt-7">
          <div
            className="
              px-4
              text-xs
              font-bold
              uppercase
              tracking-widest
              text-zinc-600
            "
          >
            Biblioteca
          </div>

          <div className="mt-2 space-y-1">
            <Link
              href="/biblioteca/imagens"
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-2.5
                text-sm
                text-zinc-400
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <Image size={17} />

              Imagens
            </Link>

            <Link
              href="/biblioteca/audios"
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-2.5
                text-sm
                text-zinc-400
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <AudioLines size={17} />

              Áudios
            </Link>

            <Link
              href="/biblioteca/musicas"
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-2.5
                text-sm
                text-zinc-400
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <Music size={17} />

              Músicas
            </Link>

            <Link
              href="/biblioteca"
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-2.5
                text-sm
                text-zinc-400
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <Library size={17} />

              Biblioteca
            </Link>
          </div>
        </div>

        {/* OUTROS */}

        <div className="mt-7 space-y-1">
          <Link
            href="/renderizacoes"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-zinc-400
              transition
              hover:bg-white/5
              hover:text-white
            "
          >
            <Video size={18} />

            Renderizações
          </Link>

          <Link
            href="/configuracoes"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-zinc-400
              transition
              hover:bg-white/5
              hover:text-white
            "
          >
            <Settings size={18} />

            Configurações
          </Link>
        </div>
      </nav>
    </aside>
  );
}