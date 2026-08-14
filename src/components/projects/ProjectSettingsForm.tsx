"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Loader2,
  Monitor,
  Save,
  Settings2,
  TriangleAlert,
} from "lucide-react";

import {
  updateProject,
  type UpdateProjectState,
} from "@/app/projetos/[id]/actions";

type VideoFormat =
  | "VERTICAL"
  | "HORIZONTAL";

type Props = {
  project: {
    id: string;
    title: string;
    format: string;
    countdownSeconds: number;
    revealSeconds: number;
  };
};

const initialState: UpdateProjectState = {
  success: false,
  message: "",
  submissionId: 0,
};

export function ProjectSettingsForm({
  project,
}: Props) {
  /*
   * CAMPOS CONTROLADOS
   */

  const [
    title,
    setTitle,
  ] = useState(
    project.title
  );

  const [
    format,
    setFormat,
  ] = useState<VideoFormat>(
    project.format ===
      "HORIZONTAL"
      ? "HORIZONTAL"
      : "VERTICAL"
  );

  const [
    countdownSeconds,
    setCountdownSeconds,
  ] = useState(
    project.countdownSeconds
  );

  const [
    revealSeconds,
    setRevealSeconds,
  ] = useState(
    project.revealSeconds
  );

  /*
   * FEEDBACK VISUAL
   */

  const [
    feedbackMessage,
    setFeedbackMessage,
  ] = useState("");

  const [
    feedbackSuccess,
    setFeedbackSuccess,
  ] = useState(false);

  /*
   * SINCRONIZA COM O BANCO
   * QUANDO A PÁGINA RECEBER
   * NOVOS DADOS DO SERVIDOR.
   */

  useEffect(() => {
    setTitle(
      project.title
    );

    setFormat(
      project.format ===
        "HORIZONTAL"
        ? "HORIZONTAL"
        : "VERTICAL"
    );

    setCountdownSeconds(
      project.countdownSeconds
    );

    setRevealSeconds(
      project.revealSeconds
    );
  }, [
    project.title,
    project.format,
    project.countdownSeconds,
    project.revealSeconds,
  ]);

  /*
   * SERVER ACTION
   */

  const actionWithProjectId =
    updateProject.bind(
      null,
      project.id
    );

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    actionWithProjectId,
    initialState
  );

  /*
   * FEEDBACK DE CADA SALVAMENTO.
   *
   * submissionId muda em toda
   * execução, mesmo quando a
   * mensagem é idêntica.
   */

  useEffect(() => {
    if (
      !state.submissionId ||
      !state.message
    ) {
      return;
    }

    setFeedbackMessage(
      state.message
    );

    setFeedbackSuccess(
      state.success
    );

    /*
     * ERROS PERMANECEM VISÍVEIS.
     */

    if (!state.success) {
      return;
    }

    /*
     * SUCESSO SOME APÓS 3s.
     */

    const timer =
      setTimeout(
        () => {
          setFeedbackMessage("");
        },
        3000
      );

    return () => {
      clearTimeout(timer);
    };
  }, [
    state.submissionId,
    state.message,
    state.success,
  ]);

  /*
   * RESOLUÇÃO
   */

  const resolution =
    format === "VERTICAL"
      ? "1080 × 1920"
      : "1920 × 1080";

  /*
   * TEMPO TOTAL
   */

  const totalSeconds =
    1 +
    countdownSeconds +
    revealSeconds;

  return (
    <form
      action={formAction}
      className="
        rounded-3xl
        border
        border-white/10
        bg-[#101722]
        p-6
      "
    >
      {/* CABEÇALHO */}

      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-violet-600/15
            text-violet-400
          "
        >
          <Settings2
            size={21}
          />
        </div>

        <div>
          <h2 className="text-lg font-black text-white">
            Configurações do vídeo
          </h2>

          <p className="text-sm text-zinc-500">
            Configure formato e duração.
          </p>
        </div>
      </div>

      {/* CAMPOS */}

      <div
        className="
          mt-7
          grid
          gap-5
          md:grid-cols-2
        "
      >
        {/* TÍTULO */}

        <label className="md:col-span-2">
          <span
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-zinc-400
            "
          >
            Título do quiz
          </span>

          <input
            name="title"
            value={title}
            onChange={(
              event
            ) =>
              setTitle(
                event.target.value
              )
            }
            required
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/30
              px-4
              py-3
              font-semibold
              text-white
              outline-none
              transition
              focus:border-violet-500
            "
          />
        </label>

        {/* FORMATO */}

        <label>
          <span
            className="
              mb-2
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-zinc-400
            "
          >
            <Monitor
              size={15}
            />

            Formato
          </span>

          <select
            name="format"
            value={format}
            onChange={(
              event
            ) =>
              setFormat(
                event.target
                  .value as VideoFormat
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#18181b]
              px-4
              py-3
              text-white
              outline-none
              transition
              focus:border-violet-500
            "
          >
            <option value="VERTICAL">
              Vertical — 1080×1920
            </option>

            <option value="HORIZONTAL">
              Horizontal — 1920×1080
            </option>
          </select>
        </label>

        {/* CONTAGEM */}

        <label>
          <span
            className="
              mb-2
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-zinc-400
            "
          >
            <Clock3
              size={15}
            />

            Contagem
          </span>

          <select
            name="countdownSeconds"
            value={
              countdownSeconds
            }
            onChange={(
              event
            ) =>
              setCountdownSeconds(
                Number(
                  event.target
                    .value
                )
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#18181b]
              px-4
              py-3
              text-white
              outline-none
              transition
              focus:border-violet-500
            "
          >
            {[
              3,
              4,
              5,
              6,
              7,
              8,
            ].map(
              (seconds) => (
                <option
                  key={
                    seconds
                  }
                  value={
                    seconds
                  }
                >
                  {seconds} segundos
                </option>
              )
            )}
          </select>
        </label>

        {/* RESPOSTA */}

        <label>
          <span
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-zinc-400
            "
          >
            Exibir resposta
          </span>

          <select
            name="revealSeconds"
            value={
              revealSeconds
            }
            onChange={(
              event
            ) =>
              setRevealSeconds(
                Number(
                  event.target
                    .value
                )
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#18181b]
              px-4
              py-3
              text-white
              outline-none
              transition
              focus:border-violet-500
            "
          >
            {[
              1,
              2,
              3,
              4,
            ].map(
              (seconds) => (
                <option
                  key={
                    seconds
                  }
                  value={
                    seconds
                  }
                >
                  {seconds} segundos
                </option>
              )
            )}
          </select>
        </label>

        {/* RESOLUÇÃO */}

        <div
          className="
            rounded-xl
            border
            border-white/10
            bg-black/20
            p-4
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-zinc-600
            "
          >
            Resolução
          </p>

          <p
            className="
              mt-1
              font-bold
              text-zinc-300
            "
          >
            {resolution}
          </p>
        </div>
      </div>

      {/* TEMPO POR PERGUNTA */}

      <div
        className="
          mt-5
          rounded-2xl
          border
          border-white/10
          bg-black/20
          p-4
        "
      >
        <p className="text-sm font-bold text-white">
          Tempo por pergunta
        </p>

        <div
          className="
            mt-3
            grid
            grid-cols-4
            gap-3
            text-sm
          "
        >
          <div>
            <p className="text-zinc-600">
              Entrada
            </p>

            <strong>
              1s
            </strong>
          </div>

          <div>
            <p className="text-zinc-600">
              Responder
            </p>

            <strong>
              {countdownSeconds}s
            </strong>
          </div>

          <div>
            <p className="text-zinc-600">
              Resposta
            </p>

            <strong>
              {revealSeconds}s
            </strong>
          </div>

          <div>
            <p className="text-zinc-600">
              Total
            </p>

            <strong className="text-violet-400">
              {totalSeconds}s
            </strong>
          </div>
        </div>
      </div>

      {/* FEEDBACK */}

      {feedbackMessage && (
        <div
          className={`
            mt-5
            flex
            items-center
            gap-2
            rounded-xl
            border
            px-4
            py-3
            text-sm
            font-semibold

            ${
              feedbackSuccess
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }
          `}
        >
          {feedbackSuccess ? (
            <CheckCircle2
              size={17}
            />
          ) : (
            <TriangleAlert
              size={17}
            />
          )}

          {feedbackMessage}
        </div>
      )}

      {/* SALVAR */}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="
            inline-flex
            min-w-[210px]
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isPending ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Salvando...
            </>
          ) : (
            <>
              <Save
                size={18}
              />

              Salvar configurações
            </>
          )}
        </button>
      </div>
    </form>
  );
}