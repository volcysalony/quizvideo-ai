import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Film,
  Play,
  ScanText,
} from "lucide-react";

import { prisma } from "@/database/prisma";

import { AppShell } from "@/components/layout/AppShell";

import { ProjectSettingsForm } from "@/components/projects/ProjectSettingsForm";

import { QuestionEditor } from "@/components/questions/QuestionEditor";

import { AddQuestionButton } from "@/components/questions/AddQuestionButton";

import { QuizVideoPreview } from "@/components/video/QuizVideoPreview";

import type { QuizVideoProps } from "@/remotion/types/quiz";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectEditorPage({
  params,
}: Props) {
  const { id } = await params;

  const project =
    await prisma.project.findUnique({
      where: {
        id,
      },

      include: {
        questions: {
          orderBy: {
            position: "asc",
          },

          include: {
            options: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

  if (!project) {
    notFound();
  }

  const quizProps: QuizVideoProps = {
    title:
      project.title,

    fps:
      project.fps,

    introSeconds:
      project.introSeconds,

    countdownSeconds:
      project.countdownSeconds,

    revealSeconds:
      project.revealSeconds,

    questions:
      project.questions.map(
        (question) => ({
          id:
            question.id,

          question:
            question.text,

          image:
            question.imagePath ??
            undefined,

          imageFit:
            question.imageFit ===
            "COVER"
              ? "COVER"
              : "CONTAIN",

          imagePositionX:
            question.imagePositionX,

          imagePositionY:
            question.imagePositionY,

          imageScale:
            question.imageScale,

          answerMode:
            question.answerMode as
              | "TEXT"
              | "IMAGE"
              | "IMAGE_TEXT",

          correctAnswer:
            question.correctAnswer,

          backgroundColor:
            question.backgroundColor,

          options:
            question.options.map(
              (option) => ({
                text:
                  option.text,

                image:
                  option.imagePath ??
                  undefined,

                imageFit:
                  option.imageFit ===
                  "CONTAIN"
                    ? "CONTAIN"
                    : "COVER",

                imagePositionX:
                  option.imagePositionX,

                imagePositionY:
                  option.imagePositionY,

                imageScale:
                  option.imageScale,
              })
            ),
        })
      ),
  };

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
            max-w-[1500px]
            px-6
            py-8
            lg:px-8
          "
        >
          {/* VOLTAR */}

          <Link
            href="/projetos"
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
            <ArrowLeft size={17} />

            Meus projetos
          </Link>

          {/* HEADER */}

          <header
            className="
              mt-5
              flex
              flex-col
              gap-5
              border-b
              border-white/10
              pb-7
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div>
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
                <Film size={17} />

                Editar vídeo
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

              <p className="mt-2 text-zinc-500">
                {
                  project.questions
                    .length
                }{" "}
                perguntas
                {" • "}
                {project.width}
                ×
                {project.height}
                {" • "}
                {project.fps} FPS
              </p>
            </div>

            <Link
              href={`/projetos/${project.id}/renderizar`}
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
                transition
                hover:bg-violet-500
              "
            >
              <Play size={18} />

              Gerar vídeo
            </Link>
          </header>

          {/* ÁREA PRINCIPAL */}

          <section
            className="
              mt-7
              grid
              gap-6
              xl:grid-cols-[minmax(0,1.15fr)_420px]
            "
          >
            {/* PREVIEW */}

            <QuizVideoPreview
              quiz={quizProps}
              width={project.width}
              height={project.height}
            />

            {/* CONFIGURAÇÕES */}

            <ProjectSettingsForm
              project={{
                id:
                  project.id,

                title:
                  project.title,

                format:
                  project.format,

                countdownSeconds:
                  project.countdownSeconds,

                revealSeconds:
                  project.revealSeconds,
              }}
            />
          </section>

          {/* PERGUNTAS */}

          <section className="mt-10">
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h2 className="text-2xl font-black">
                  Perguntas do Quiz
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Edite manualmente ou importe várias
                  perguntas de uma só vez.
                </p>
              </div>

              {/* AÇÕES DAS PERGUNTAS */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                "
              >
                <Link
                  href={`/projetos/${project.id}/importar`}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-violet-500/30
                    bg-violet-500/[0.07]
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-violet-300
                    transition
                    hover:border-violet-500/50
                    hover:bg-violet-500/10
                    hover:text-violet-200
                  "
                >
                  <ScanText
                    size={18}
                  />

                  Importar perguntas
                </Link>

                <AddQuestionButton
                  projectId={
                    project.id
                  }
                />
              </div>
            </div>

            {project.questions
              .length > 0 ? (
              <div
                className="
                  mt-6
                  grid
                  gap-5
                  xl:grid-cols-2
                "
              >
                {project.questions.map(
                  (
                    question
                  ) => (
                    <QuestionEditor
                      key={
                        question.id
                      }
                      projectId={
                        project.id
                      }
                      question={
                        question
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  mt-6
                  rounded-3xl
                  border
                  border-dashed
                  border-white/10
                  bg-white/[0.02]
                  p-14
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-violet-500/10
                    text-violet-400
                  "
                >
                  <ScanText
                    size={26}
                  />
                </div>

                <h3 className="mt-4 font-black">
                  Nenhuma pergunta ainda
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-zinc-500
                  "
                >
                  Adicione uma pergunta manualmente
                  ou importe várias perguntas em massa
                  para montar o quiz mais rápido.
                </p>

                <Link
                  href={`/projetos/${project.id}/importar`}
                  className="
                    mt-6
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-violet-600
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-violet-500
                  "
                >
                  <ScanText
                    size={18}
                  />

                  Importar perguntas
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}