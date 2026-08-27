"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ImageIcon,
  Loader2,
  Save,
  Trash2,
  Type,
} from "lucide-react";

import {
  deleteQuestion,
} from "@/app/projetos/[id]/actions";

import {
  updateQuestionDetails,
  type QuestionEditorState,
} from "@/app/projetos/[id]/question-editor-actions";

import {
  QuestionImageUpload,
} from "./QuestionImageUpload";

import {
  OptionImageUpload,
} from "./OptionImageUpload";

type AnswerMode =
  | "TEXT"
  | "IMAGE"
  | "IMAGE_TEXT";

type Option = {
  id: string;
  text: string;
  imagePath: string | null;
  position: number;
};

type Props = {
  projectId: string;

  question: {
    id: string;
    text: string;
    imagePath: string | null;
    answerMode: string;
    correctAnswer: number;
    backgroundColor: string;
    position: number;
    options: Option[];
  };
};

const INITIAL_STATE: QuestionEditorState = {
  success: false,
  message: "",
  submissionId: 0,
};

const MODE_LABELS: Record<
  AnswerMode,
  string
> = {
  TEXT:
    "Texto",

  IMAGE:
    "Só imagens",

  IMAGE_TEXT:
    "Imagem + texto",
};

export function QuestionEditor({
  projectId,
  question,
}: Props) {
  const formId =
    `question-${question.id}`;

  const initialMode =
    (
      [
        "TEXT",
        "IMAGE",
        "IMAGE_TEXT",
      ].includes(
        question.answerMode
      )
        ? question.answerMode
        : "TEXT"
    ) as AnswerMode;

  const [
    answerMode,
    setAnswerMode,
  ] =
    useState<AnswerMode>(
      initialMode
    );

  const [
    correctAnswer,
    setCorrectAnswer,
  ] = useState(
    question.correctAnswer
  );

  const [
    showFeedback,
    setShowFeedback,
  ] = useState(false);

  const [
    optionImages,
    setOptionImages,
  ] = useState<
    Record<
      string,
      string | null
    >
  >(
    () =>
      Object.fromEntries(
        question.options.map(
          (option) => [
            option.id,
            option.imagePath,
          ]
        )
      )
  );

  const updateAction =
    updateQuestionDetails.bind(
      null,
      projectId,
      question.id
    );

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    updateAction,
    INITIAL_STATE
  );

  const deleteAction =
    deleteQuestion.bind(
      null,
      projectId,
      question.id
    );

  useEffect(() => {
    if (
      !state.submissionId
    ) {
      return;
    }

    setShowFeedback(
      true
    );

    const timer =
      window.setTimeout(
        () =>
          setShowFeedback(
            false
          ),
        3000
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    state.submissionId,
  ]);

  const imageCount =
    useMemo(
      () =>
        Object.values(
          optionImages
        ).filter(
          Boolean
        ).length,
      [
        optionImages,
      ]
    );

  const missingImages =
    question.options.length -
    imageCount;

  const correctLetter =
    String.fromCharCode(
      65 +
        correctAnswer
    );

  function handleImageChange(
    optionId: string,
    imagePath:
      string | null
  ) {
    setOptionImages(
      (current) => ({
        ...current,

        [optionId]:
          imagePath,
      })
    );
  }

  return (
    <details
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#101722]
        transition
        open:border-violet-500/20
      "
    >
      {/* ===================================================
          CABEÇALHO RECOLHIDO
          =================================================== */}

      <summary
        className="
          flex
          cursor-pointer
          list-none
          items-center
          gap-3
          px-5
          py-4
          transition
          hover:bg-white/[0.025]
          [&::-webkit-details-marker]:hidden
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-violet-600/15
            text-sm
            font-black
            text-violet-400
          "
        >
          {String(
            question.position
          ).padStart(
            2,
            "0"
          )}
        </div>

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <p
            className="
              truncate
              font-bold
              text-white
            "
          >
            {question.text}
          </p>

          <div
            className="
              mt-1
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                rounded-full
                bg-white/5
                px-2
                py-0.5
                text-[11px]
                font-semibold
                text-zinc-500
              "
            >
              {MODE_LABELS[
                answerMode
              ]}
            </span>

            <span
              className="
                rounded-full
                bg-emerald-500/10
                px-2
                py-0.5
                text-[11px]
                font-bold
                text-emerald-400
              "
            >
              Correta:{" "}
              {
                correctLetter
              }
            </span>

            {imageCount >
              0 && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-violet-500/10
                  px-2
                  py-0.5
                  text-[11px]
                  font-semibold
                  text-violet-400
                "
              >
                <ImageIcon
                  size={11}
                />

                {imageCount} img.
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          size={20}
          className="
            shrink-0
            text-zinc-600
            transition-transform
            duration-200
            group-open:rotate-180
          "
        />
      </summary>

      {/* ===================================================
          CONTEÚDO
          =================================================== */}

      <div
        className="
          border-t
          border-white/10
          p-5
        "
      >
        {/*
          Formulário principal vazio.

          Os campos abaixo usam form={formId}.
          Isso é importante porque cada imagem
          possui seu próprio formulário de upload.

          Assim não criamos forms dentro de forms.
        */}

        <form
          id={
            formId
          }
          action={
            formAction
          }
        />

        <input
          type="hidden"
          name="answerMode"
          value={
            answerMode
          }
          form={
            formId
          }
        />

        {/* PERGUNTA */}

        <div>
          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-zinc-400
            "
          >
            Pergunta
          </label>

          <textarea
            name="text"
            form={
              formId
            }
            defaultValue={
              question.text
            }
            required
            rows={2}
            className="
              w-full
              resize-none
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
        </div>

        {/* CONFIGURAÇÕES COMPACTAS */}

        <div
          className="
            mt-5
            grid
            gap-4
            lg:grid-cols-[1fr_auto]
          "
        >
          {/* TIPO */}

          <div>
            <span
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-zinc-400
              "
            >
              Tipo das alternativas
            </span>

            <div
              className="
                grid
                grid-cols-3
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  setAnswerMode(
                    "TEXT"
                  )
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-3
                  py-2.5
                  text-xs
                  font-bold
                  transition

                  ${
                    answerMode ===
                    "TEXT"
                      ? "border-violet-500 bg-violet-500/15 text-violet-300"
                      : "border-white/10 bg-black/20 text-zinc-500 hover:bg-white/5"
                  }
                `}
              >
                <Type
                  size={15}
                />

                Texto
              </button>

              <button
                type="button"
                onClick={() =>
                  setAnswerMode(
                    "IMAGE"
                  )
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-3
                  py-2.5
                  text-xs
                  font-bold
                  transition

                  ${
                    answerMode ===
                    "IMAGE"
                      ? "border-violet-500 bg-violet-500/15 text-violet-300"
                      : "border-white/10 bg-black/20 text-zinc-500 hover:bg-white/5"
                  }
                `}
              >
                <ImageIcon
                  size={15}
                />

                Imagens
              </button>

              <button
                type="button"
                onClick={() =>
                  setAnswerMode(
                    "IMAGE_TEXT"
                  )
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-3
                  py-2.5
                  text-xs
                  font-bold
                  transition

                  ${
                    answerMode ===
                    "IMAGE_TEXT"
                      ? "border-violet-500 bg-violet-500/15 text-violet-300"
                      : "border-white/10 bg-black/20 text-zinc-500 hover:bg-white/5"
                  }
                `}
              >
                <ImageIcon
                  size={15}
                />

                Imagem + texto
              </button>
            </div>
          </div>

          {/* COR */}

          <div>
            <span
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-zinc-400
              "
            >
              Fundo
            </span>

            <input
              name="backgroundColor"
              form={
                formId
              }
              type="color"
              defaultValue={
                question.backgroundColor
              }
              title="Cor do fundo"
              className="
                h-[42px]
                w-16
                cursor-pointer
                rounded-xl
                border
                border-white/10
                bg-black/20
                p-1
              "
            />
          </div>
        </div>

        {/* ALERTA IMAGENS */}

        {answerMode !==
          "TEXT" &&
          missingImages >
            0 && (
            <div
              className="
                mt-4
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-amber-500/20
                bg-amber-500/[0.06]
                px-3
                py-2.5
                text-xs
                text-amber-300
              "
            >
              <AlertTriangle
                size={15}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              Adicione imagem às{" "}
              {missingImages} alternativa(s)
              restantes antes de gerar o vídeo.
            </div>
          )}

        {/* IMAGEM PRINCIPAL COMPACTA */}

        <div className="mt-5">
          <QuestionImageUpload
            projectId={
              projectId
            }
            questionId={
              question.id
            }
            imagePath={
              question.imagePath
            }
          />
        </div>

        {/* ALTERNATIVAS */}

        <div className="mt-6">
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              className="
                text-sm
                font-semibold
                text-zinc-400
              "
            >
              Alternativas
            </span>

            <span
              className="
                text-xs
                text-zinc-600
              "
            >
              Marque a resposta correta
            </span>
          </div>

          <div
            className="
              space-y-2
            "
          >
            {question.options.map(
              (
                option
              ) => {
                const letter =
                  String.fromCharCode(
                    65 +
                      option.position
                  );

                const isCorrect =
                  correctAnswer ===
                  option.position;

                return (
                  <div
                    key={
                      option.id
                    }
                    className={`
                      rounded-2xl
                      border
                      p-3
                      transition

                      ${
                        isCorrect
                          ? "border-emerald-500/35 bg-emerald-500/[0.045]"
                          : "border-white/10 bg-black/20"
                      }
                    `}
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      {/* CORRETA */}

                      <input
                        type="radio"
                        name="correctAnswer"
                        form={
                          formId
                        }
                        value={
                          option.position
                        }
                        checked={
                          isCorrect
                        }
                        onChange={() =>
                          setCorrectAnswer(
                            option.position
                          )
                        }
                        className="
                          h-5
                          w-5
                          shrink-0
                          accent-emerald-500
                        "
                      />

                      {/* LETRA */}

                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          text-sm
                          font-black

                          ${
                            isCorrect
                              ? "border-emerald-400 bg-emerald-500 text-white"
                              : "border-white/15 bg-zinc-900 text-zinc-300"
                          }
                        `}
                      >
                        {
                          letter
                        }
                      </div>

                      {/* TEXTO
                          Continua montado mesmo no
                          modo IMAGE para não perder
                          alterações ao alternar modos.
                      */}

                      <div
                        className={
                          answerMode ===
                          "IMAGE"
                            ? "hidden"
                            : "min-w-0 flex-1"
                        }
                      >
                        <input
                          name={`option-${option.id}`}
                          form={
                            formId
                          }
                          defaultValue={
                            option.text
                          }
                          required={
                            answerMode !==
                            "IMAGE"
                          }
                          placeholder={`Texto da alternativa ${letter}`}
                          className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-black/30
                            px-3
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            outline-none
                            transition
                            focus:border-violet-500
                          "
                        />
                      </div>

                      {/* NO MODO SOMENTE IMAGEM */}

                      {answerMode ===
                        "IMAGE" && (
                        <div
                          className="
                            min-w-0
                            flex-1
                            text-xs
                            font-semibold
                            text-zinc-500
                          "
                        >
                          Resposta por imagem
                        </div>
                      )}

                      {/* IMAGEM INLINE */}

                      <div
                        className={
                          answerMode ===
                          "TEXT"
                            ? "hidden"
                            : "shrink-0"
                        }
                      >
                        <OptionImageUpload
                          projectId={
                            projectId
                          }
                          questionId={
                            question.id
                          }
                          optionId={
                            option.id
                          }
                          letter={
                            letter
                          }
                          imagePath={
                            option.imagePath
                          }
                          onImageChange={(
                            path
                          ) =>
                            handleImageChange(
                              option.id,
                              path
                            )
                          }
                        />
                      </div>

                      {isCorrect && (
                        <Check
                          size={18}
                          className="
                            hidden
                            shrink-0
                            text-emerald-400
                            sm:block
                          "
                        />
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* FEEDBACK */}

        {showFeedback &&
          state.message && (
            <div
              className={`
                mt-4
                rounded-xl
                border
                px-4
                py-3
                text-sm
                font-semibold

                ${
                  state.success
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
                }
              `}
            >
              {state.message}
            </div>
          )}

        {/* FOOTER */}

        <div
          className="
            mt-6
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-t
            border-white/10
            pt-4
          "
        >
          <form
            action={
              deleteAction
            }
            onSubmit={(
              event
            ) => {
              if (
                !window.confirm(
                  "Excluir esta pergunta?"
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                px-3
                py-2
                text-sm
                font-semibold
                text-red-400
                transition
                hover:bg-red-500/10
              "
            >
              <Trash2
                size={16}
              />

              Excluir
            </button>
          </form>

          <button
            type="submit"
            form={
              formId
            }
            disabled={
              pending
            }
            className="
              inline-flex
              min-w-[155px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-white
              px-4
              py-2.5
              text-sm
              font-black
              text-black
              transition
              hover:bg-zinc-200
              disabled:opacity-60
            "
          >
            {pending ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Salvando...
              </>
            ) : (
              <>
                <Save
                  size={16}
                />

                Salvar pergunta
              </>
            )}
          </button>
        </div>
      </div>
    </details>
  );
}