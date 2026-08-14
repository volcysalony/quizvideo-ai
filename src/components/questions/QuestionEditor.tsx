import {
  Check,
  Save,
  Trash2,
} from "lucide-react";

import {
  deleteQuestion,
  updateQuestion,
} from "@/app/projetos/[id]/actions";

import {
  QuestionImageUpload,
} from "./QuestionImageUpload";

type Option = {
  id: string;
  text: string;
  position: number;
};

type Props = {
  projectId: string;

  question: {
    id: string;
    text: string;
    imagePath: string | null;
    correctAnswer: number;
    backgroundColor: string;
    position: number;
    options: Option[];
  };
};

export function QuestionEditor({
  projectId,
  question,
}: Props) {
  const updateAction =
    updateQuestion.bind(
      null,
      projectId,
      question.id
    );

  const deleteAction =
    deleteQuestion.bind(
      null,
      projectId,
      question.id
    );

  const letters = [
    "A",
    "B",
    "C",
    "D",
  ];

  return (
    <article
      className="
        rounded-3xl
        border
        border-white/10
        bg-[#101722]
        p-6
      "
    >
      <form action={updateAction}>
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-violet-600/15
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

            <div>
              <h3 className="font-black">
                Pergunta{" "}
                {
                  question.position
                }
              </h3>

              <p
                className="
                  text-xs
                  text-zinc-500
                "
              >
                Configure conteúdo,
                mídia e resposta.
              </p>
            </div>
          </div>

          <input
            name="backgroundColor"
            type="color"
            defaultValue={
              question.backgroundColor
            }
            title="Cor do fundo"
            className="
              h-10
              w-14
              cursor-pointer
              rounded-lg
              border
              border-white/10
              bg-transparent
              p-1
            "
          />
        </div>

        {/* PERGUNTA */}

        <div className="mt-6">
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
              focus:border-violet-500
            "
          />
        </div>

        {/* ALTERNATIVAS */}

        <div className="mt-7">
          <div
            className="
              mb-3
              flex
              justify-between
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
              Selecione a correta
            </span>
          </div>

          <div className="space-y-3">
            {question.options.map(
              (
                option,
                index
              ) => {
                const isCorrect =
                  question.correctAnswer ===
                  option.position;

                return (
                  <label
                    key={
                      option.id
                    }
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      p-3

                      ${
                        isCorrect
                          ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                          : "border-white/10 bg-black/20"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={
                        option.position
                      }
                      defaultChecked={
                        isCorrect
                      }
                      className="
                        h-5
                        w-5
                        accent-emerald-500
                      "
                    />

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        font-black

                        ${
                          isCorrect
                            ? "border-emerald-400 bg-emerald-500 text-white"
                            : "border-white/15 bg-zinc-900 text-zinc-300"
                        }
                      `}
                    >
                      {letters[index]}
                    </div>

                    <input
                      name={`option-${option.id}`}
                      defaultValue={
                        option.text
                      }
                      required
                      className="
                        min-w-0
                        flex-1
                        rounded-xl
                        border
                        border-white/10
                        bg-black/30
                        px-4
                        py-3
                        font-semibold
                        text-white
                        outline-none
                        focus:border-violet-500
                      "
                    />

                    {isCorrect && (
                      <Check
                        size={20}
                        className="
                          text-emerald-400
                        "
                      />
                    )}
                  </label>
                );
              }
            )}
          </div>
        </div>

        {/* SALVAR CONTEÚDO */}

        <div
          className="
            mt-6
            flex
            justify-end
          "
        >
          <button
            type="submit"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-white
              px-4
              py-3
              text-sm
              font-black
              text-black
              transition
              hover:bg-zinc-200
            "
          >
            <Save size={17} />

            Salvar pergunta
          </button>
        </div>
      </form>

      {/* IMAGEM */}

      <div
        className="
          mt-6
          border-t
          border-white/10
          pt-6
        "
      >
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

      {/* EXCLUIR */}

      <form
        action={
          deleteAction
        }
        className="
          mt-6
          border-t
          border-white/10
          pt-4
        "
      >
        <button
          type="submit"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-red-400
            transition
            hover:text-red-300
          "
        >
          <Trash2
            size={16}
          />

          Excluir pergunta
        </button>
      </form>
    </article>
  );
}