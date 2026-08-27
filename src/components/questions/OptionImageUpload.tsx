"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  removeOptionImage,
  uploadOptionImage,
  type OptionImageState,
} from "@/app/projetos/[id]/option-image-actions";

import {
  ImageFramingEditor,
} from "./ImageFramingEditor";

type Props = {
  projectId: string;
  questionId: string;
  optionId: string;
  letter: string;
  imagePath: string | null;

  onImageChange?: (
    path:
      string | null
  ) => void;
};

const INITIAL_STATE: OptionImageState = {
  success:
    false,

  message:
    "",

  submissionId:
    0,
};

export function OptionImageUpload({
  projectId,
  questionId,
  optionId,
  letter,
  imagePath,
  onImageChange,
}: Props) {
  const formRef =
    useRef<HTMLFormElement>(
      null
    );

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    localPath,
    setLocalPath,
  ] =
    useState<string | null>(
      imagePath
    );

  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState<string | null>(
      null
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const uploadAction =
    uploadOptionImage.bind(
      null,
      projectId,
      questionId,
      optionId
    );

  const removeAction =
    removeOptionImage.bind(
      null,
      projectId,
      questionId,
      optionId
    );

  const [
    uploadState,
    uploadFormAction,
    uploadPending,
  ] =
    useActionState(
      uploadAction,
      INITIAL_STATE
    );

  const [
    removeState,
    removeFormAction,
    removePending,
  ] =
    useActionState(
      removeAction,
      INITIAL_STATE
    );

  useEffect(() => {
    setLocalPath(
      imagePath
    );
  }, [
    imagePath,
  ]);

  useEffect(() => {
    if (
      !uploadState.submissionId
    ) {
      return;
    }

    if (
      uploadState.success &&
      uploadState.imagePath
    ) {
      setLocalPath(
        uploadState.imagePath
      );

      setPreviewUrl(
        null
      );

      setError("");

      onImageChange?.(
        uploadState.imagePath
      );

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }

      return;
    }

    setPreviewUrl(
      null
    );

    setError(
      uploadState.message
    );
  }, [
    uploadState,
    onImageChange,
  ]);

  useEffect(() => {
    if (
      !removeState.submissionId
    ) {
      return;
    }

    if (
      removeState.success
    ) {
      setLocalPath(
        null
      );

      setPreviewUrl(
        null
      );

      setError("");

      onImageChange?.(
        null
      );

      return;
    }

    setError(
      removeState.message
    );
  }, [
    removeState,
    onImageChange,
  ]);

  function chooseImage() {
    inputRef.current?.click();
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      previewUrl
    ) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setPreviewUrl(
      URL.createObjectURL(
        file
      )
    );

    setError("");

    window.setTimeout(
      () => {
        formRef.current?.requestSubmit();
      },
      0
    );
  }

  const displayedImage =
    previewUrl ??
    localPath;

  const busy =
    uploadPending ||
    removePending;

  return (
    <div
      className="
        shrink-0
      "
    >
      <div
        className="
          flex
          flex-wrap
          items-center
          justify-end
          gap-2
        "
      >
        {/* MINIATURA */}

        <button
          type="button"
          onClick={
            localPath
              ? undefined
              : chooseImage
          }
          disabled={
            busy
          }
          className="
            relative
            flex
            h-14
            w-[74px]
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-white/10
            bg-[#080d16]
          "
        >
          {displayedImage ? (
            <img
              src={
                displayedImage
              }
              alt=""
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <ImagePlus
              size={20}
              className="
                text-zinc-600
              "
            />
          )}

          {uploadPending && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/65
              "
            >
              <Loader2
                size={18}
                className="
                  animate-spin
                  text-white
                "
              />
            </div>
          )}
        </button>

        {localPath ? (
          <>
            <ImageFramingEditor
              target="OPTION"
              projectId={
                projectId
              }
              questionId={
                questionId
              }
              optionId={
                optionId
              }
              imagePath={
                localPath
              }
              label={`Alternativa ${letter}`}
            />

            <button
              type="button"
              onClick={
                chooseImage
              }
              disabled={
                busy
              }
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-white/10
                bg-white/5
                px-2.5
                py-2
                text-xs
                font-bold
                text-zinc-300
                transition
                hover:bg-white/10
              "
            >
              <RefreshCw
                size={14}
              />

              Trocar
            </button>

            <form
              action={
                removeFormAction
              }
              onSubmit={(
                event
              ) => {
                if (
                  !window.confirm(
                    `Remover a imagem da alternativa ${letter}?`
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                disabled={
                  busy
                }
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-red-500/20
                  bg-red-500/[0.05]
                  px-2.5
                  py-2
                  text-xs
                  font-bold
                  text-red-400
                  transition
                  hover:bg-red-500/10
                "
              >
                {removePending ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2
                    size={14}
                  />
                )}

                Remover
              </button>
            </form>
          </>
        ) : (
          <button
            type="button"
            onClick={
              chooseImage
            }
            disabled={
              busy
            }
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              border
              border-violet-500/20
              bg-violet-500/[0.06]
              px-3
              py-2
              text-xs
              font-bold
              text-violet-300
            "
          >
            <ImagePlus
              size={14}
            />

            Adicionar imagem
          </button>
        )}
      </div>

      <form
        ref={
          formRef
        }
        action={
          uploadFormAction
        }
      >
        <input
          ref={
            inputRef
          }
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,.jpg,.jpeg,.jfif,.png,.webp,.gif,.avif"
          onChange={
            handleChange
          }
          className="hidden"
        />
      </form>

      {error && (
        <p
          className="
            mt-1
            text-right
            text-[11px]
            text-red-400
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}