import {
  unlink,
} from "node:fs/promises";

import path from "node:path";

import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/database/prisma";

export const runtime = "nodejs";

type Props = {
  params: Promise<{
    renderId: string;
  }>;
};

/*
 * =====================================================
 * CONSULTAR RENDER
 * =====================================================
 */

export async function GET(
  _request: Request,
  {
    params,
  }: Props
) {
  const {
    renderId,
  } = await params;

  const render =
    await prisma.render.findUnique({
      where: {
        id: renderId,
      },

      select: {
        id: true,
        status: true,
        progress: true,
        outputPath: true,
        errorMessage: true,
        createdAt: true,
        startedAt: true,
        completedAt: true,
      },
    });

  if (!render) {
    return NextResponse.json(
      {
        message:
          "Renderização não encontrada.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    render
  );
}

/*
 * =====================================================
 * EXCLUIR RENDER
 * =====================================================
 */

export async function DELETE(
  _request: Request,
  {
    params,
  }: Props
) {
  try {
    const {
      renderId,
    } = await params;

    const render =
      await prisma.render.findUnique({
        where: {
          id: renderId,
        },

        select: {
          id: true,
          status: true,
          outputPath: true,
        },
      });

    if (!render) {
      return NextResponse.json(
        {
          message:
            "Renderização não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Nunca devemos apagar um arquivo
     * enquanto ele ainda está sendo
     * produzido pelo Remotion.
     */

    if (
      render.status ===
        "PENDING" ||
      render.status ===
        "RENDERING"
    ) {
      return NextResponse.json(
        {
          message:
            "Não é possível excluir uma renderização em andamento.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * ===================================================
     * REMOVE O MP4
     * ===================================================
     */

    if (render.outputPath) {
      const rendersDirectory =
        path.resolve(
          process.cwd(),
          "storage",
          "renders"
        );

      const absolutePath =
        path.resolve(
          process.cwd(),
          render.outputPath
        );

      /*
       * Segurança contra caminhos fora de
       * storage/renders.
       */

      const relativePath =
        path.relative(
          rendersDirectory,
          absolutePath
        );

      if (
        relativePath.startsWith(
          ".."
        ) ||
        path.isAbsolute(
          relativePath
        )
      ) {
        return NextResponse.json(
          {
            message:
              "O caminho do arquivo de vídeo é inválido.",
          },
          {
            status: 400,
          }
        );
      }

      try {
        await unlink(
          absolutePath
        );
      } catch (error) {
        /*
         * Se o arquivo já não existe,
         * ainda queremos remover o
         * registro órfão do banco.
         */

        const nodeError =
          error as NodeJS.ErrnoException;

        if (
          nodeError.code !==
          "ENOENT"
        ) {
          throw error;
        }
      }
    }

    /*
     * ===================================================
     * REMOVE DO BANCO
     * ===================================================
     */

    await prisma.render.delete({
      where: {
        id: renderId,
      },
    });

    return NextResponse.json({
      success: true,

      message:
        "Renderização excluída com sucesso.",
    });
  } catch (error) {
    console.error(
      "Erro ao excluir render:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível excluir a renderização.",
      },
      {
        status: 500,
      }
    );
  }
}