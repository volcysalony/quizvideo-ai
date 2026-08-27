export const MAX_IMPORT_QUESTIONS = 200;
export const MAX_IMPORT_TEXT_LENGTH = 100_000;

export const MAX_QUESTION_LENGTH = 240;
export const MAX_OPTION_LENGTH = 140;

export type CorrectAnswerIndex =
  | 0
  | 1
  | 2;

export type CorrectAnswerLetter =
  | "A"
  | "B"
  | "C";

export type ParsedQuizQuestion = {
  text: string;

  options: [
    string,
    string,
    string
  ];

  correctAnswer: CorrectAnswerIndex;

  correctLetter: CorrectAnswerLetter;

  sourceLine: number;
};

export type QuizTextValidationIssue = {
  block?: number;

  line?: number;

  message: string;
};

export type QuizTextParseResult = {
  valid: boolean;

  questions: ParsedQuizQuestion[];

  issues: QuizTextValidationIssue[];
};

type SourceLine = {
  number: number;
  text: string;
};

type QuestionBlock = {
  number: number;

  sourceLine: number;

  question: string | null;

  options: {
    A: string | null;
    B: string | null;
    C: string | null;
  };

  answer: CorrectAnswerLetter | null;

  issues: QuizTextValidationIssue[];
};

const QUESTION_REGEX =
  /^pergunta(?:\s+\d+)?\s*:\s*(.+)$/i;

const OPTION_REGEX =
  /^([ABC])\s*[:.)-]\s*(.+)$/i;

const ANSWER_REGEX =
  /^(?:resposta(?:\s+correta)?|correta)\s*:\s*([ABC])\s*$/i;

function normalizeComparableText(
  value: string
) {
  return value
    .trim()
    .toLocaleLowerCase(
      "pt-BR"
    )
    .replace(
      /\s+/g,
      " "
    );
}

function answerLetterToIndex(
  letter: CorrectAnswerLetter
): CorrectAnswerIndex {
  switch (letter) {
    case "A":
      return 0;

    case "B":
      return 1;

    case "C":
      return 2;
  }
}

function createBlock(
  number: number,
  sourceLine: number
): QuestionBlock {
  return {
    number,

    sourceLine,

    question:
      null,

    options: {
      A: null,
      B: null,
      C: null,
    },

    answer:
      null,

    issues:
      [],
  };
}

function validateBlock(
  block: QuestionBlock
) {
  if (!block.question) {
    block.issues.push({
      block:
        block.number,

      line:
        block.sourceLine,

      message:
        "A pergunta está vazia.",
    });
  } else if (
    block.question.length >
    MAX_QUESTION_LENGTH
  ) {
    block.issues.push({
      block:
        block.number,

      line:
        block.sourceLine,

      message:
        `A pergunta ultrapassa ${MAX_QUESTION_LENGTH} caracteres.`,
    });
  }

  const letters =
    [
      "A",
      "B",
      "C",
    ] as const;

  for (
    const letter
    of letters
  ) {
    const option =
      block.options[
        letter
      ];

    if (!option) {
      block.issues.push({
        block:
          block.number,

        message:
          `A alternativa ${letter} está ausente ou vazia.`,
      });

      continue;
    }

    if (
      option.length >
      MAX_OPTION_LENGTH
    ) {
      block.issues.push({
        block:
          block.number,

        message:
          `A alternativa ${letter} ultrapassa ${MAX_OPTION_LENGTH} caracteres.`,
      });
    }
  }

  const filledOptions =
    letters
      .map(
        (letter) =>
          block.options[
            letter
          ]
      )
      .filter(
        (
          option
        ): option is string =>
          Boolean(
            option
          )
      );

  const normalizedOptions =
    filledOptions.map(
      normalizeComparableText
    );

  if (
    new Set(
      normalizedOptions
    ).size !==
    normalizedOptions.length
  ) {
    block.issues.push({
      block:
        block.number,

      message:
        "Existem alternativas duplicadas nesta pergunta.",
    });
  }

  if (!block.answer) {
    block.issues.push({
      block:
        block.number,

      message:
        'Informe a resposta correta usando "Resposta: A", "Resposta: B" ou "Resposta: C".',
    });
  }
}

export function parseQuizText(
  rawText: string
): QuizTextParseResult {
  const issues: QuizTextValidationIssue[] =
    [];

  const questions: ParsedQuizQuestion[] =
    [];

  const text =
    rawText
      .replace(
        /\r\n?/g,
        "\n"
      )
      .trim();

  /*
   * =====================================================
   * VALIDAÇÕES GERAIS
   * =====================================================
   */

  if (!text) {
    return {
      valid:
        false,

      questions:
        [],

      issues: [
        {
          message:
            "Cole pelo menos uma pergunta antes de analisar.",
        },
      ],
    };
  }

  if (
    text.length >
    MAX_IMPORT_TEXT_LENGTH
  ) {
    return {
      valid:
        false,

      questions:
        [],

      issues: [
        {
          message:
            `O texto ultrapassa o limite de ${MAX_IMPORT_TEXT_LENGTH.toLocaleString(
              "pt-BR"
            )} caracteres.`,
        },
      ],
    };
  }

  /*
   * Mantemos o número real da linha
   * para mostrar erros úteis.
   */
  const lines: SourceLine[] =
    text
      .split("\n")
      .map(
        (
          line,
          index
        ) => ({
          number:
            index + 1,

          text:
            line.trim(),
        })
      )
      .filter(
        (line) =>
          line.text.length >
          0
      );

  const blocks: QuestionBlock[] =
    [];

  let currentBlock:
    | QuestionBlock
    | null =
    null;

  /*
   * =====================================================
   * LEITURA DAS LINHAS
   * =====================================================
   */

  for (
    const line
    of lines
  ) {
    const questionMatch =
      line.text.match(
        QUESTION_REGEX
      );

    /*
     * Uma nova linha "Pergunta:"
     * sempre inicia um novo bloco.
     */
    if (
      questionMatch
    ) {
      if (
        currentBlock
      ) {
        blocks.push(
          currentBlock
        );
      }

      currentBlock =
        createBlock(
          blocks.length +
            1,
          line.number
        );

      currentBlock.question =
        questionMatch[1]
          .trim();

      continue;
    }

    /*
     * Qualquer coisa antes de
     * "Pergunta:" é inválida.
     */
    if (
      !currentBlock
    ) {
      issues.push({
        line:
          line.number,

        message:
          `Texto não reconhecido: "${line.text}". Cada bloco deve começar com "Pergunta:".`,
      });

      continue;
    }

    const optionMatch =
      line.text.match(
        OPTION_REGEX
      );

    if (
      optionMatch
    ) {
      const letter =
        optionMatch[1]
          .toUpperCase() as CorrectAnswerLetter;

      const value =
        optionMatch[2]
          .trim();

      if (
        currentBlock.options[
          letter
        ]
      ) {
        currentBlock.issues.push({
          block:
            currentBlock.number,

          line:
            line.number,

          message:
            `A alternativa ${letter} foi informada mais de uma vez.`,
        });
      } else {
        currentBlock.options[
          letter
        ] =
          value;
      }

      continue;
    }

    const answerMatch =
      line.text.match(
        ANSWER_REGEX
      );

    if (
      answerMatch
    ) {
      if (
        currentBlock.answer
      ) {
        currentBlock.issues.push({
          block:
            currentBlock.number,

          line:
            line.number,

          message:
            "A resposta correta foi informada mais de uma vez.",
        });

        continue;
      }

      currentBlock.answer =
        answerMatch[1]
          .toUpperCase() as CorrectAnswerLetter;

      continue;
    }

    /*
     * Se não corresponde a nenhum
     * formato conhecido, rejeitamos.
     */
    currentBlock.issues.push({
      block:
        currentBlock.number,

      line:
        line.number,

      message:
        `Linha não reconhecida: "${line.text}". Use somente Pergunta, A, B, C e Resposta.`,
    });
  }

  if (
    currentBlock
  ) {
    blocks.push(
      currentBlock
    );
  }

  /*
   * =====================================================
   * QUANTIDADE
   * =====================================================
   */

  if (
    blocks.length ===
    0
  ) {
    issues.push({
      message:
        'Nenhuma pergunta válida foi encontrada. O formato deve começar com "Pergunta:".',
    });
  }

  if (
    blocks.length >
    MAX_IMPORT_QUESTIONS
  ) {
    issues.push({
      message:
        `O limite por importação é de ${MAX_IMPORT_QUESTIONS} perguntas.`,
    });
  }

  /*
   * =====================================================
   * VALIDA CADA BLOCO
   * =====================================================
   */

  for (
    const block
    of blocks
  ) {
    validateBlock(
      block
    );

    issues.push(
      ...block.issues
    );

    if (
      block.issues.length >
        0 ||
      !block.question ||
      !block.options.A ||
      !block.options.B ||
      !block.options.C ||
      !block.answer
    ) {
      continue;
    }

    questions.push({
      text:
        block.question,

      options: [
        block.options.A,
        block.options.B,
        block.options.C,
      ],

      correctAnswer:
        answerLetterToIndex(
          block.answer
        ),

      correctLetter:
        block.answer,

      sourceLine:
        block.sourceLine,
    });
  }

  /*
   * =====================================================
   * PERGUNTAS DUPLICADAS NO MESMO TEXTO
   * =====================================================
   */

  const seenQuestions =
    new Map<
      string,
      number
    >();

  for (
    let index = 0;
    index <
    questions.length;
    index++
  ) {
    const question =
      questions[index];

    const normalized =
      normalizeComparableText(
        question.text
      );

    const previous =
      seenQuestions.get(
        normalized
      );

    if (
      previous !==
      undefined
    ) {
      issues.push({
        block:
          index + 1,

        line:
          question.sourceLine,

        message:
          `Pergunta duplicada. Ela já apareceu anteriormente no bloco ${previous}.`,
      });
    } else {
      seenQuestions.set(
        normalized,
        index + 1
      );
    }
  }

  return {
    valid:
      issues.length ===
        0 &&
      questions.length >
        0,

    questions,

    issues,
  };
}