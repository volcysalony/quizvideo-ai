import { prisma } from "../src/database/prisma";
import { getProjectForRender } from "../src/features/projects/getProjectForRender";

async function main() {
  const project =
    await prisma.project.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

  if (!project) {
    throw new Error(
      "Nenhum projeto encontrado no banco."
    );
  }

  const quiz =
    await getProjectForRender(
      project.id
    );

  console.log("");
  console.log(
    "🎬 Projeto preparado para render"
  );

  console.log("");
  console.log(
    JSON.stringify(
      quiz,
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(
      "❌ Erro:"
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });