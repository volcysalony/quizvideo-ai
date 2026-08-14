import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não foi definida.");
}

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Iniciando seed do QuizVideo AI...");

  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.render.deleteMany();
  await prisma.project.deleteMany();

  const project = await prisma.project.create({
    data: {
      title: "QUIZ DE HISTÓRIA",

      format: "VERTICAL",

      width: 1080,
      height: 1920,
      fps: 30,

      introSeconds: 1,
      countdownSeconds: 6,
      revealSeconds: 2,

      questions: {
        create: [
          {
            text: "QUEM CHEGOU AO BRASIL EM 1500?",
            correctAnswer: 0,
            backgroundColor: "#9333EA",
            position: 1,

            options: {
              create: [
                {
                  text: "Pedro Álvares Cabral",
                  position: 0,
                },
                {
                  text: "Dom Pedro I",
                  position: 1,
                },
                {
                  text: "Tiradentes",
                  position: 2,
                },
              ],
            },
          },

          {
            text: "EM QUE ANO FOI PROCLAMADA A INDEPENDÊNCIA DO BRASIL?",
            correctAnswer: 1,
            backgroundColor: "#22C55E",
            position: 2,

            options: {
              create: [
                {
                  text: "1500",
                  position: 0,
                },
                {
                  text: "1822",
                  position: 1,
                },
                {
                  text: "1889",
                  position: 2,
                },
              ],
            },
          },

          {
            text: "QUEM PROCLAMOU A REPÚBLICA DO BRASIL?",
            correctAnswer: 2,
            backgroundColor: "#FACC15",
            position: 3,

            options: {
              create: [
                {
                  text: "Dom Pedro II",
                  position: 0,
                },
                {
                  text: "Getúlio Vargas",
                  position: 1,
                },
                {
                  text: "Marechal Deodoro",
                  position: 2,
                },
              ],
            },
          },
        ],
      },
    },

    include: {
      questions: {
        include: {
          options: true,
        },

        orderBy: {
          position: "asc",
        },
      },
    },
  });

  console.log("");
  console.log("✅ Seed concluído!");
  console.log(`Projeto: ${project.title}`);
  console.log(`Perguntas: ${project.questions.length}`);

  for (const question of project.questions) {
    console.log("");
    console.log(
      `${question.position}. ${question.text}`
    );

    const sortedOptions = [...question.options].sort(
      (a, b) => a.position - b.position
    );

    for (const option of sortedOptions) {
      console.log(
        `   ${String.fromCharCode(
          65 + option.position
        )}) ${option.text}`
      );
    }
  }
}

main()
  .catch((error) => {
    console.error("❌ Erro durante o seed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });