import { prisma } from "../src/database/prisma";

import { renderProject } from "../src/features/renders/renderProject";

async function main() {
  console.log("");
  console.log(
    "🔎 Procurando projeto no banco..."
  );

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

  console.log(
    `✅ Projeto encontrado: ${project.title}`
  );

  await renderProject(
    project.id
  );
}

main()
  .catch((error) => {
    console.error("");
    console.error(
      "❌ Falha na renderização:"
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });