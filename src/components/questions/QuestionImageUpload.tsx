"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  TriangleAlert,
  Upload,
} from "lucide-react";

import {
  uploadQuestionImage,
  type UploadQuestionImageState,
} from "@/app/projetos/[id]/actions";

type Props = {
  projectId: string;
  questionId: string;
  imagePath: string | null;
};

const initialState: UploadQuestionImageState = {
  success: false,
  message: "",
  imagePath: undefined,
  submissionId: 0,
};

export function QuestionImageUpload({
  projectId,
  questionId,
  imagePath,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    preview,
    setPreview,
  ] = useState<
    string | null
  >(
    imagePath
  );

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    feedbackSuccess,
    setFeedbackSuccess,
  ] = useState(false);

  const uploadAction =
    uploadQuestionImage.bind(
      null,
      projectId,
      questionId
    );

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    uploadAction,
    initialState
  );

  /*
   * SINCRONIZA COM O SERVIDOR.
   */

  useEffect(() => {
    setPreview(
      imagePath
    );
  }, [
    imagePath,
  ]);

  /*
   * RESULTADO DO UPLOAD.
   */

  useEffect(() => {
    if (
      !state.submissionId
    ) {
      return;
    }

    setFeedback(
      state.message
    );

    setFeedbackSuccess(
      state.success
    );

    if (
      state.success &&
      state.imagePath
    ) {
      setPreview(
        state.imagePath
      );

      /*
       * LIMPA O INPUT.
       */

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    }

    if (
      !state.success
    ) {
      return;
    }

    const timer =
      setTimeout(
        () => {
          setFeedback("");
        },
        3000
      );

    return () =>
      clearTimeout(timer);
  }, [
    state.submissionId,
    state.success,
    state.message,
    state.imagePath,
  ]);

  /*
   * PREVIEW LOCAL IMEDIATO.
   */

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const localUrl =
      URL.createObjectURL(
        file
      );

    setPreview(
      localUrl
    );
  }

  return (
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
        Imagem da pergunta
      </span>

      <form
        action={formAction}
        className="
          rounded-2xl
          border
          border-white/10
          bg-black/20
          p-4
        "
      >
        {/* PREVIEW */}

        <div
          className="
            flex
            min-h-[220px]
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-dashed
            border-white/10
            bg-black/20
          "
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview da pergunta"
              className="
                max-h-[320px]
                w-full
                object-contain
              "
            />
          ) : (
            <div
              className="
                px-4
                py-10
                text-center
              "
            >
              <ImagePlus
                size={34}
                className="
                  mx-auto
                  text-zinc-600
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-zinc-400
                "
              >
                Nenhuma imagem
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-zinc-600
                "
              >
                JPG, PNG ou WEBP
                • máximo 8 MB
              </p>
            </div>
          )}
        </div>

        {/* FILE */}

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <input
            ref={inputRef}
            type="file"
            name="image"
            accept="
              image/jpeg,
              image/png,
              image/webp
            "
            onChange={
              handleFileChange
            }
            required
            className="
              min-w-0
              flex-1
              rounded-xl
              border
              border-white/10
              bg-[#18181b]
              px-3
              py-2.5
              text-sm
              text-zinc-300

              file:mr-3
              file:rounded-lg
              file:border-0
              file:bg-white/10
              file:px-3
              file:py-2
              file:font-semibold
              file:text-white
            "
          />

          <button
            type="submit"
            disabled={
              isPending
            }
            className="
              inline-flex
              min-w-[150px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-violet-600
              px-4
              py-3
              text-sm
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
                  size={17}
                  className="
                    animate-spin
                  "
                />

                Enviando...
              </>
            ) : (
              <>
                <Upload
                  size={17}
                />

                Enviar
              </>
            )}
          </button>
        </div>

        {/* FEEDBACK */}

        {feedback && (
          <div
            className={`
              mt-3
              flex
              items-center
              gap-2
              rounded-xl
              border
              px-3
              py-2.5
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
                size={16}
              />
            ) : (
              <TriangleAlert
                size={16}
              />
            )}

            {feedback}
          </div>
        )}
      </form>
    </div>
  );
}