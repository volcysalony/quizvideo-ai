"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Play,
  ScanText,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  parseQuizText,
  type QuizTextParseResult,
} from "@/features/questions/quizTextParser";

type Props = {
  projectId: string;
  existingQuestionCount: number;
};

type ImportMode =
  | "APPEND"
  | "REPLACE";

const EXAMPLE_TEXT = `Pergunta: Qual é a capital do Brasil?
A: Brasília
B: São Paulo
C: Rio de Janeiro
Resposta: A

Pergunta: Quanto é 10 + 10?
A: 10
B: 20
C: 30
Resposta: B`;

export function QuizTextImporter({
  projectId,
  existingQuestionCount,
}: Props) {
  const router =
    useRouter();

  const [
    rawText,
    setRawText,
  ] = useState("");

  const [
    analysis,
    setAnalysis,
  ] =
    useState<QuizTextParseResult | null>(
      null
    );

  const [
    mode,
    setMode,
  ] =
    useState<ImportMode>(
      "APPEND"
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    generating,
    setGenerating,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  function updateText(
    value: string
  ) {
    setRawText(
      value
    );

    /*
     * Se o usuário alterou o texto,
     * a análise anterior não é mais válida.
     */
    setAnalysis(
      null
    );

    setError("");
    setSuccess("");
  }

  function analyzeText() {
    setError("");
    setSuccess("");

    const result =
      parseQuizText(
        rawText
      );

    setAnalysis(
      result
    );
  }

  async function saveQuestions(
    generateVideo:
      boolean
  ) {
    if (
      !analysis ||
      !analysis.valid
    ) {
      setError(
        "Analise e corrija as perguntas antes de salvar."
      );

      return;
    }

    /*
     * Substituir é destrutivo.
     */
    if (
      mode ===
        "REPLACE" &&
      existingQuestionCount >
        0
    ) {
      const confirmed =
        window.confirm(
          `Este projeto possui ${existingQuestionCount} pergunta(s).\n\nTodas serão excluídas e substituídas pelas ${analysis.questions.length} perguntas importadas.\n\nDeseja continuar?`
        );

      if (
        !confirmed
      ) {
        return;
      }
    }

    try {
      setError("");
      setSuccess("");

      if (
        generateVideo
      ) {
        setGenerating(
          true
        );
      } else {
        setSaving(
          true
        );
      }

      /*
       * ===============================================
       * SALVA
       * ===============================================
       */

      const response =
        await fetch(
          `/api/projetos/${projectId}/questions/import`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                rawText,
                mode,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        if (
          Array.isArray(
            data.issues
          )
        ) {
          const messages =
            data.issues
              .slice(
                0,
                5
              )
              .map(
                (
                  issue: {
                    message?: string;
                  }
                ) =>
                  issue.message
              )
              .filter(
                Boolean
              )
              .join(
                "\n"
              );

          throw new Error(
            messages ||
              data.message
          );
        }

        if (
          Array.isArray(
            data.duplicates
          )
        ) {
          throw new Error(
            `${data.message}\n\n${data.duplicates.join(
              "\n"
            )}`
          );
        }

        throw new Error(
          data.message ??
            "Não foi possível importar as perguntas."
        );
      }

      /*
       * ===============================================
       * SOMENTE SALVAR
       * ===============================================
       */

      if (
        !generateVideo
      ) {
        setSuccess(
          `${data.importedCount} pergunta(s) salvas. O projeto agora possui ${data.totalQuestions} pergunta(s).`
        );

        router.refresh();

        return;
      }

      /*
       * ===============================================
       * SALVAR + GERAR
       * ===============================================
       */

      const renderResponse =
        await fetch(
          `/api/projetos/${projectId}/renders`,
          {
            method:
              "POST",
          }
        );

      const renderData =
        await renderResponse.json();

      /*
       * 409 pode significar que
       * já existe um render ativo.
       *
       * Nesse caso, simplesmente
       * levamos o usuário à tela
       * de renderização.
       */
      if (
        !renderResponse.ok &&
        renderResponse.status !==
          409
      ) {
        setSuccess(
          `${data.importedCount} pergunta(s) foram salvas com sucesso.`
        );

        throw new Error(
          renderData.message ??
            "As perguntas foram salvas, mas não foi possível iniciar o vídeo."
        );
      }

      router.push(
        `/projetos/${projectId}/renderizar`
      );
    } catch (
      saveError
    ) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Ocorreu um erro inesperado.";

      setError(
        message
      );
    } finally {
      setSaving(
        false
      );

      setGenerating(
        false
      );
    }
  }

  const busy =
    saving ||
    generating;

  return (
    <div
      className="
        space-y-6
      "
    >
      {/* FORMATO */}

      <section
        className="
          rounded-3xl
          border
          border-white/10
          bg-[#101722]
          p-6
          md:p-8
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-violet-600/15
              text-violet-400
            "
          >
            <FileText
              size={21}
            />
          </div>

          <div>
            <h2
              className="
                text-xl
                font-black
                text-white
              "
            >
              Formato das perguntas
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              O importador não tenta adivinhar
              textos aleatórios. Use a estrutura
              abaixo para garantir uma importação
              segura.
            </p>
          </div>
        </div>

        <pre
          className="
            mt-6
            overflow-x-auto
            rounded-2xl
            border
            border-white/10
            bg-black/30
            p-5
            text-sm
            leading-7
            text-zinc-300
          "
        >
{`Pergunta: Qual é a capital do Brasil?
A: Brasília
B: São Paulo
C: Rio de Janeiro
Resposta: A

Pergunta: Quanto é 10 + 10?
A: 10
B: 20
C: 30
Resposta: B`}
        </pre>

        <button
          type="button"
          onClick={() =>
            updateText(
              EXAMPLE_TEXT
            )
          }
          className="
            mt-4
            text-sm
            font-bold
            text-violet-400
            transition
            hover:text-violet-300
          "
        >
          Usar exemplo
        </button>
      </section>

      {/* MODO */}

      <section
        className="
          rounded-3xl
          border
          border-white/10
          bg-[#101722]
          p-6
        "
      >
        <h2
          className="
            font-black
            text-white
          "
        >
          O que fazer com as perguntas existentes?
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-zinc-500
          "
        >
          Este projeto possui atualmente{" "}
          {existingQuestionCount} pergunta(s).
        </p>

        <div
          className="
            mt-5
            grid
            gap-3
            md:grid-cols-2
          "
        >
          <button
            type="button"
            onClick={() =>
              setMode(
                "APPEND"
              )
            }
            className={`
              rounded-2xl
              border
              p-4
              text-left
              transition

              ${
                mode ===
                "APPEND"
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }
            `}
          >
            <strong
              className="
                text-white
              "
            >
              Adicionar ao projeto
            </strong>

            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Mantém as perguntas atuais e
              adiciona as novas no final.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setMode(
                "REPLACE"
              )
            }
            className={`
              rounded-2xl
              border
              p-4
              text-left
              transition

              ${
                mode ===
                "REPLACE"
                  ? "border-red-500/60 bg-red-500/10"
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }
            `}
          >
            <strong
              className="
                text-white
              "
            >
              Substituir todas
            </strong>

            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Exclui as perguntas atuais antes
              da importação.
            </p>
          </button>
        </div>
      </section>

      {/* TEXTAREA */}

      <section
        className="
          rounded-3xl
          border
          border-white/10
          bg-[#101722]
          p-6
          md:p-8
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-black
                text-white
              "
            >
              Cole suas perguntas
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Você pode colar dezenas de perguntas de uma vez.
            </p>
          </div>

          {rawText && (
            <button
              type="button"
              onClick={() =>
                updateText(
                  ""
                )
              }
              disabled={
                busy
              }
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-zinc-500
                transition
                hover:text-red-400
              "
            >
              <Trash2
                size={16}
              />

              Limpar
            </button>
          )}
        </div>

        <textarea
          value={
            rawText
          }
          onChange={(
            event
          ) =>
            updateText(
              event.target.value
            )
          }
          disabled={
            busy
          }
          spellCheck={
            false
          }
          placeholder={`Pergunta: ...
A: ...
B: ...
C: ...
Resposta: A`}
          className="
            mt-6
            min-h-[430px]
            w-full
            resize-y
            rounded-2xl
            border
            border-white/10
            bg-black/30
            p-5
            font-mono
            text-sm
            leading-7
            text-zinc-200
            outline-none
            transition
            placeholder:text-zinc-700
            focus:border-violet-500/60
            disabled:opacity-60
          "
        />

        <div
          className="
            mt-5
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
          "
        >
          <span
            className="
              text-xs
              text-zinc-600
            "
          >
            {rawText.length.toLocaleString(
              "pt-BR"
            )} caracteres
          </span>

          <button
            type="button"
            onClick={
              analyzeText
            }
            disabled={
              !rawText.trim() ||
              busy
            }
            className="
              inline-flex
              items-center
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
              disabled:opacity-40
            "
          >
            <ScanText
              size={18}
            />

            Analisar perguntas
          </button>
        </div>
      </section>

      {/* RESULTADO COM ERROS */}

      {analysis &&
        !analysis.valid && (
          <section
            className="
              rounded-3xl
              border
              border-red-500/20
              bg-red-500/[0.05]
              p-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <XCircle
                size={23}
                className="
                  text-red-400
                "
              />

              <div>
                <h2
                  className="
                    font-black
                    text-white
                  "
                >
                  O texto precisa ser corrigido
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-red-300/70
                  "
                >
                  Nenhuma pergunta será salva
                  enquanto houver erros.
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                space-y-2
              "
            >
              {analysis.issues.map(
                (
                  issue,
                  index
                ) => (
                  <div
                    key={
                      `${issue.line}-${index}`
                    }
                    className="
                      flex
                      gap-3
                      rounded-xl
                      bg-black/20
                      px-4
                      py-3
                      text-sm
                    "
                  >
                    <AlertTriangle
                      size={17}
                      className="
                        mt-0.5
                        shrink-0
                        text-red-400
                      "
                    />

                    <div>
                      <span
                        className="
                          text-red-300
                        "
                      >
                        {issue.block
                          ? `Pergunta ${issue.block}`
                          : "Importação"}

                        {issue.line
                          ? ` • linha ${issue.line}`
                          : ""}
                      </span>

                      <p
                        className="
                          mt-1
                          text-zinc-400
                        "
                      >
                        {issue.message}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

      {/* RESULTADO VÁLIDO */}

      {analysis &&
        analysis.valid && (
          <section
            className="
              rounded-3xl
              border
              border-emerald-500/20
              bg-[#101722]
              p-6
              md:p-8
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <CheckCircle2
                size={25}
                className="
                  text-emerald-400
                "
              />

              <div>
                <h2
                  className="
                    text-xl
                    font-black
                    text-white
                  "
                >
                  {analysis.questions.length} pergunta(s) válida(s)
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-500
                  "
                >
                  Todas passaram pela validação.
                </p>
              </div>
            </div>

            {/* PREVIEW */}

            <div
              className="
                mt-6
                space-y-3
              "
            >
              {analysis.questions
                .slice(
                  0,
                  10
                )
                .map(
                  (
                    question,
                    index
                  ) => (
                    <article
                      key={
                        `${question.sourceLine}-${index}`
                      }
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/20
                        p-5
                      "
                    >
                      <div
                        className="
                          flex
                          gap-3
                        "
                      >
                        <span
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-violet-500/10
                            text-xs
                            font-black
                            text-violet-400
                          "
                        >
                          {index +
                            1}
                        </span>

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <h3
                            className="
                              font-bold
                              text-white
                            "
                          >
                            {question.text}
                          </h3>

                          <div
                            className="
                              mt-4
                              grid
                              gap-2
                              text-sm
                            "
                          >
                            {question.options.map(
                              (
                                option,
                                optionIndex
                              ) => {
                                const letter =
                                  [
                                    "A",
                                    "B",
                                    "C",
                                  ][
                                    optionIndex
                                  ];

                                const correct =
                                  question.correctAnswer ===
                                  optionIndex;

                                return (
                                  <div
                                    key={
                                      letter
                                    }
                                    className={`
                                      flex
                                      items-center
                                      gap-2
                                      rounded-lg
                                      px-3
                                      py-2

                                      ${
                                        correct
                                          ? "bg-emerald-500/10 text-emerald-300"
                                          : "bg-white/[0.03] text-zinc-400"
                                      }
                                    `}
                                  >
                                    <strong>
                                      {letter}.
                                    </strong>

                                    <span>
                                      {option}
                                    </span>

                                    {correct && (
                                      <Check
                                        size={15}
                                        className="ml-auto"
                                      />
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                )}

              {analysis.questions.length >
                10 && (
                <p
                  className="
                    py-2
                    text-center
                    text-sm
                    font-semibold
                    text-zinc-500
                  "
                >
                  +{" "}
                  {analysis.questions.length -
                    10}{" "}
                  outras perguntas
                </p>
              )}
            </div>

            {/* AÇÕES */}

            <div
              className="
                mt-7
                flex
                flex-col
                gap-3
                border-t
                border-white/10
                pt-6
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() =>
                  saveQuestions(
                    false
                  )
                }
                disabled={
                  busy
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-5
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-white/10
                  disabled:opacity-50
                "
              >
                {saving ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2
                    size={18}
                  />
                )}

                {saving
                  ? "Salvando..."
                  : "Salvar perguntas"}
              </button>

              <button
                type="button"
                onClick={() =>
                  saveQuestions(
                    true
                  )
                }
                disabled={
                  busy
                }
                className="
                  inline-flex
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
                  disabled:opacity-50
                "
              >
                {generating ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Play
                    size={18}
                  />
                )}

                {generating
                  ? "Salvando e preparando..."
                  : "Salvar e gerar vídeo"}
              </button>
            </div>
          </section>
        )}

      {/* SUCESSO */}

      {success && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            p-4
            text-sm
            text-emerald-300
          "
        >
          <CheckCircle2
            size={19}
            className="
              shrink-0
            "
          />

          {success}
        </div>
      )}

      {/* ERRO */}

      {error && (
        <div
          className="
            whitespace-pre-line
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            p-4
            text-sm
            text-red-300
          "
        >
          {error}
        </div>
      )}

      {/* INFORMAÇÃO */}

      <div
        className="
          flex
          items-start
          gap-3
          rounded-2xl
          border
          border-violet-500/10
          bg-violet-500/[0.03]
          p-4
        "
      >
        <Sparkles
          size={18}
          className="
            mt-0.5
            shrink-0
            text-violet-400
          "
        />

        <p
          className="
            text-sm
            leading-6
            text-zinc-500
          "
        >
          Antes de salvar, o backend executa
          toda a validação novamente. Alterar
          dados pelo navegador não permite
          contornar as regras do importador.
        </p>
      </div>
    </div>
  );
}