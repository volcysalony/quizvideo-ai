import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/database/prisma";

import {
  renderProject,
} from "@/features/renders/renderProject";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  {
    params,
  }: Props
) {
  const {
    id: projectId,
  } = await params;

  /*
   * CONFIRMA PROJETO
   */

  const project =
    await prisma.project.findUnique({
      where: {
        id:
          projectId,
      },

      select: {
        id:
          true,

        questions: {
          select: {
            id:
              true,
          },

          take:
            1,
        },
      },
    });

  if (!project) {
    return NextResponse.json(
      {
        message:
          "Projeto não encontrado.",
      },

      {
        status:
          404,
      }
    );
  }

  if (
    project.questions.length ===
    0
  ) {
    return NextResponse.json(
      {
        message:
          "Adicione pelo menos uma pergunta antes de gerar o vídeo.",
      },

      {
        status:
          400,
      }
    );
  }

  /*
   * EVITA DOIS RENDERS SIMULTÂNEOS
   * DO MESMO PROJETO.
   */

  const activeRender =
    await prisma.render.findFirst({
      where: {
        projectId,

        status: {
          in: [
            "PENDING",
            "RENDERING",
          ],
        },
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });

  if (activeRender) {
    return NextResponse.json(
      {
        renderId:
          activeRender.id,

        status:
          activeRender.status,

        message:
          "Já existe uma renderização em andamento.",
      },

      {
        status:
          409,
      }
    );
  }

  /*
   * CRIA REGISTRO
   */

  const render =
    await prisma.render.create({
      data: {
        projectId,

        status:
          "PENDING",

        progress:
          0,
      },
    });

  /*
   * INICIA O PROCESSO SEM
   * BLOQUEAR A RESPOSTA HTTP.
   *
   * Esta estratégia é adequada
   * para o uso local deste sistema.
   */

  void renderProject(
    projectId,
    render.id
  ).catch(
    (error) => {
      console.error(
        "Falha no processo de render:",
        error
      );
    }
  );

  return NextResponse.json(
    {
      renderId:
        render.id,

      status:
        render.status,
    },

    {
      status:
        202,
    }
  );
}