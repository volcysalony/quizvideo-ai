"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/database/prisma";

export async function createProject(
  formData: FormData
) {
  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const format = String(
    formData.get("format") ??
      "VERTICAL"
  );

  if (!title) {
    throw new Error(
      "Informe o nome do quiz."
    );
  }

  const isVertical =
    format === "VERTICAL";

  const project =
    await prisma.project.create({
      data: {
        title,

        format,

        width: isVertical
          ? 1080
          : 1920,

        height: isVertical
          ? 1920
          : 1080,

        fps: 30,

        introSeconds: 1,
        countdownSeconds: 6,
        revealSeconds: 2,
      },
    });

  redirect(
    `/projetos/${project.id}`
  );
}