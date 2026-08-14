import Link from "next/link";

import {
  Film,
  Plus,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/database/prisma";

import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/projects/ProjectCard";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: {
      updatedAt: "desc",
    },

    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  const totalQuestions = projects.reduce(
    (total, project) =>
      total + project._count.questions,
    0
  );

  return (
    <AppShell>
      <main className="min-h-screen bg-[#080d16] text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">

          {/* CABEÇALHO */}

          <header
            className="
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <div
                className="
                  mb-3
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
                <Sparkles size={17} />

                QuizVideo AI
              </div>

              <h1
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  md:text-5xl
                "
              >
                Meus projetos
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-zinc-400
                "
              >
                Crie, organize e gere seus vídeos
                de quiz automaticamente.
              </p>
            </div>

            <Link
              href="/projetos/novo"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-violet-600
                px-5
                py-3
                font-bold
                text-white
                shadow-lg
                shadow-violet-950/30
                transition
                hover:bg-violet-500
              "
            >
              <Plus size={20} />

              Novo projeto
            </Link>
          </header>

          {/* ESTATÍSTICAS */}

          <section
            className="
              mt-10
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {/* PROJETOS */}

            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
              "
            >
              <p className="text-sm text-zinc-500">
                Projetos
              </p>

              <strong
                className="
                  mt-2
                  block
                  text-3xl
                  font-black
                "
              >
                {projects.length}
              </strong>
            </div>

            {/* PERGUNTAS */}

            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
              "
            >
              <p className="text-sm text-zinc-500">
                Perguntas
              </p>

              <strong
                className="
                  mt-2
                  block
                  text-3xl
                  font-black
                "
              >
                {totalQuestions}
              </strong>
            </div>

            {/* MOTOR */}

            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
              "
            >
              <p className="text-sm text-zinc-500">
                Motor de vídeo
              </p>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-emerald-400
                  "
                />

                <strong
                  className="
                    text-lg
                    font-black
                    text-emerald-400
                  "
                >
                  Remotion ativo
                </strong>
              </div>
            </div>
          </section>

          {/* LISTA DE PROJETOS */}

          {projects.length > 0 ? (
            <section
              className="
                mt-8
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  questionCount={
                    project._count.questions
                  }
                  format={project.format}
                  width={project.width}
                  height={project.height}
                  fps={project.fps}
                />
              ))}
            </section>
          ) : (
            /* ESTADO VAZIO */

            <section
              className="
                mt-10
                flex
                min-h-[380px]
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-dashed
                border-white/10
                bg-white/[0.02]
                px-6
                text-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-violet-600/15
                  text-violet-400
                "
              >
                <Film size={30} />
              </div>

              <h2
                className="
                  mt-5
                  text-xl
                  font-black
                "
              >
                Nenhum projeto ainda
              </h2>

              <p
                className="
                  mt-2
                  max-w-md
                  text-zinc-500
                "
              >
                Crie seu primeiro projeto para
                começar a produzir vídeos de quiz
                automaticamente.
              </p>

              <Link
                href="/projetos/novo"
                className="
                  mt-6
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
                "
              >
                <Plus size={18} />

                Criar primeiro projeto
              </Link>
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}