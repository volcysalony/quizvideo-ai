import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  ArrowLeft,
  Film,
} from "lucide-react";

import {
  prisma,
} from "@/database/prisma";

import {
  AppShell,
} from "@/components/layout/AppShell";

import {
  RenderPanel,
} from "@/components/renders/RenderPanel";

import {
  RenderHistory,
} from "@/components/renders/RenderHistory";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export default async function RenderProjectPage({
  params,
}: Props) {
  const {
    id,
  } = await params;

  const project =
    await prisma.project.findUnique({
      where: {
        id,
      },

      include: {
        renders: {
          orderBy: {
            createdAt:
              "desc",
          },

          take:
            20,
        },

        _count: {
          select: {
            questions:
              true,
          },
        },
      },
    });

  if (!project) {
    notFound();
  }

  const latestRender =
    project.renders[0] ??
    null;

  return (
    <AppShell>
      <main
        className="
          min-h-screen
          bg-[#080d16]
          text-white
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
            px-6
            py-10
            lg:px-10
          "
        >
          {/* VOLTAR */}

          <Link
            href={`/projetos/${project.id}`}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-zinc-500
              transition
              hover:text-white
            "
          >
            <ArrowLeft
              size={17}
            />

            Voltar ao editor
          </Link>

          {/* HEADER */}

          <header
            className="
              mt-7
              border-b
              border-white/10
              pb-8
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-black
                uppercase
                tracking-[0.18em]
                text-violet-400
              "
            >
              <Film
                size={17}
              />

              Renderizar
            </div>

            <h1
              className="
                mt-3
                text-3xl
                font-black
                tracking-tight
                md:text-4xl
              "
            >
              {project.title}
            </h1>

            <p
              className="
                mt-3
                text-zinc-500
              "
            >
              {project._count.questions} perguntas
              {" • "}
              {project.width}×{project.height}
              {" • "}
              {project.fps} FPS
            </p>
          </header>

          {/* RENDER ATUAL */}

          <section
            className="
              mt-8
            "
          >
            <RenderPanel
              projectId={
                project.id
              }
              initialRender={
                latestRender
              }
            />
          </section>

          {/* HISTÓRICO */}

          <RenderHistory
            renders={
              project.renders
            }
          />
        </div>
      </main>
    </AppShell>
  );
}