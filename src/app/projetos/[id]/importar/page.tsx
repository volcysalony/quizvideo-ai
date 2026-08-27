import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  ArrowLeft,
  ScanText,
} from "lucide-react";

import {
  prisma,
} from "@/database/prisma";

import {
  AppShell,
} from "@/components/layout/AppShell";

import {
  QuizTextImporter,
} from "@/components/questions/QuizTextImporter";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export default async function ImportQuestionsPage({
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

      select: {
        id:
          true,

        title:
          true,

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
              <ScanText
                size={17}
              />

              Importação inteligente
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
              Importar perguntas
            </h1>

            <p
              className="
                mt-3
                text-zinc-500
              "
            >
              {project.title}
              {" • "}
              {project._count.questions} pergunta(s) atualmente
            </p>
          </header>

          <div
            className="
              mt-8
            "
          >
            <QuizTextImporter
              projectId={
                project.id
              }
              existingQuestionCount={
                project._count.questions
              }
            />
          </div>
        </div>
      </main>
    </AppShell>
  );
}