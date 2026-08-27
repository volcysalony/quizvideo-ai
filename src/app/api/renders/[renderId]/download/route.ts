import {
  readFile,
  stat,
} from "node:fs/promises";

import path from "node:path";

import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/database/prisma";

type Props = {
  params: Promise<{
    renderId: string;
  }>;
};

export async function GET(
  _request: Request,
  {
    params,
  }: Props
) {
  try {
    const {
      renderId,
    } = await params;

    /*
     * BUSCA O RENDER
     */

    const render =
      await prisma.render.findUnique({
        where: {
          id: renderId,
        },

        include: {
          project: {
            select: {
              title: true,
              format: true,
            },
          },
        },
      });

    /*
     * VALIDAÇÃO
     */

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

    if (
      render.status !==
        "COMPLETED" ||
      !render.outputPath
    ) {
      return NextResponse.json(
        {
          message:
            "O vídeo ainda não está disponível para download.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * DIRETÓRIO PERMITIDO
     */

    const rendersDirectory =
      path.resolve(
        process.cwd(),
        "storage",
        "renders"
      );

    /*
     * CAMINHO SALVO NO BANCO
     */

    const absolutePath =
      path.resolve(
        process.cwd(),
        render.outputPath
      );

    /*
     * SEGURANÇA
     *
     * Impede que um caminho
     * arbitrário fora de
     * storage/renders seja lido.
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
            "Caminho de vídeo inválido.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * CONFIRMA QUE O ARQUIVO EXISTE
     */

    const fileStats =
      await stat(
        absolutePath
      );

    if (
      !fileStats.isFile()
    ) {
      return NextResponse.json(
        {
          message:
            "Arquivo de vídeo não encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * CARREGA MP4
     */

    const video =
      await readFile(
        absolutePath
      );

    /*
     * NOME AMIGÁVEL
     */

    const safeTitle =
      render.project.title
        .toLowerCase()
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        ) || "quiz";

    const format =
      render.project.format ===
      "HORIZONTAL"
        ? "horizontal"
        : "vertical";

    const fileName =
      `${safeTitle}-${format}.mp4`;

    /*
     * DOWNLOAD
     */

    return new NextResponse(
      video,
      {
        status: 200,

        headers: {
          "Content-Type":
            "video/mp4",

          "Content-Disposition":
            `attachment; filename="${fileName}"`,

          "Content-Length":
            String(
              video.length
            ),

          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erro ao baixar vídeo:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível baixar o vídeo.",
      },
      {
        status: 500,
      }
    );
  }
}