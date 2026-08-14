import Link from "next/link";

import {
  ArrowLeft,
  Monitor,
  Smartphone,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";

import { createProject } from "./actions";

export default function NewProjectPage() {
  return (
    <AppShell>
      <main className="min-h-screen px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-4xl">

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

            Voltar para projetos
          </Link>

          <header className="mt-8">
            <p
              className="
                text-sm
                font-black
                uppercase
                tracking-[0.18em]
                text-violet-400
              "
            >
              Novo projeto
            </p>

            <h1
              className="
                mt-3
                text-4xl
                font-black
                tracking-tight
                text-white
                md:text-5xl
              "
            >
              Criar vídeo de quiz
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-zinc-500
              "
            >
              Defina as configurações iniciais.
              Depois você poderá adicionar
              perguntas, imagens, áudio e estilos.
            </p>
          </header>

          <form
            action={createProject}
            className="
              mt-10
              rounded-3xl
              border
              border-white/10
              bg-[#101722]
              p-6
              shadow-2xl
              md:p-8
            "
          >
            {/* NOME */}

            <div>
              <label
                htmlFor="title"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-zinc-400
                "
              >
                Nome do quiz
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                autoFocus
                placeholder="Ex: Quiz de Matemática"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/25
                  px-4
                  py-4
                  text-lg
                  font-bold
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-violet-500
                "
              />

              <p className="mt-2 text-xs text-zinc-600">
                Esse título será usado também no
                topo do vídeo.
              </p>
            </div>

            {/* FORMATO */}

            <div className="mt-8">
              <h2 className="text-sm font-semibold text-zinc-400">
                Formato do vídeo
              </h2>

              <div
                className="
                  mt-4
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                {/* VERTICAL */}

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="VERTICAL"
                    defaultChecked
                    className="peer sr-only"
                  />

                  <div
                    className="
                      h-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-5
                      transition

                      hover:border-violet-500/50

                      peer-checked:border-violet-500
                      peer-checked:bg-violet-500/10
                    "
                  >
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-500/10
                        text-violet-400
                      "
                    >
                      <Smartphone size={26} />
                    </div>

                    <h3 className="mt-5 text-lg font-black">
                      Vertical
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Shorts, Reels e TikTok
                    </p>

                    <div
                      className="
                        mt-5
                        inline-flex
                        rounded-lg
                        border
                        border-white/10
                        bg-black/20
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-zinc-300
                      "
                    >
                      1080 × 1920 • 9:16
                    </div>
                  </div>
                </label>

                {/* HORIZONTAL */}

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="HORIZONTAL"
                    className="peer sr-only"
                  />

                  <div
                    className="
                      h-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-5
                      transition

                      hover:border-violet-500/50

                      peer-checked:border-violet-500
                      peer-checked:bg-violet-500/10
                    "
                  >
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-500/10
                        text-blue-400
                      "
                    >
                      <Monitor size={26} />
                    </div>

                    <h3 className="mt-5 text-lg font-black">
                      Horizontal
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      YouTube
                    </p>

                    <div
                      className="
                        mt-5
                        inline-flex
                        rounded-lg
                        border
                        border-white/10
                        bg-black/20
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-zinc-300
                      "
                    >
                      1920 × 1080 • 16:9
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* CONFIGURAÇÃO PADRÃO */}

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-white/10
                bg-black/20
                p-5
              "
            >
              <h3 className="text-sm font-bold text-white">
                Configuração inicial
              </h3>

              <div
                className="
                  mt-4
                  grid
                  gap-4
                  text-sm
                  sm:grid-cols-3
                "
              >
                <div>
                  <p className="text-zinc-600">
                    Resolução
                  </p>

                  <p className="mt-1 font-bold text-zinc-300">
                    Full HD
                  </p>
                </div>

                <div>
                  <p className="text-zinc-600">
                    Contagem
                  </p>

                  <p className="mt-1 font-bold text-zinc-300">
                    6 segundos
                  </p>
                </div>

                <div>
                  <p className="text-zinc-600">
                    FPS
                  </p>

                  <p className="mt-1 font-bold text-zinc-300">
                    30 FPS
                  </p>
                </div>
              </div>
            </div>

            {/* AÇÕES */}

            <div
              className="
                mt-8
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >
              <Link
                href="/projetos"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-6
                  py-3
                  font-bold
                  text-zinc-300
                  transition
                  hover:bg-white/[0.07]
                "
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="
                  rounded-xl
                  bg-violet-600
                  px-6
                  py-3
                  font-black
                  text-white
                  transition
                  hover:bg-violet-500
                "
              >
                Criar projeto →
              </button>
            </div>
          </form>
        </div>
      </main>
    </AppShell>
  );
}