"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Crop,
  Loader2,
  Maximize2,
  Minimize2,
  Move,
  RotateCcw,
  Save,
  X,
  ZoomIn,
} from "lucide-react";

import {
  getQuestionImageFraming,
  updateQuestionImageFraming,
} from "@/app/projetos/[id]/question-image-actions";

import {
  getOptionImageFraming,
  updateOptionImageFraming,
} from "@/app/projetos/[id]/option-image-actions";

type ImageFit =
  | "COVER"
  | "CONTAIN";

type Framing = {
  fit: ImageFit;
  positionX: number;
  positionY: number;
  scale: number;
};

type Props = {
  target:
    | "QUESTION"
    | "OPTION";

  projectId: string;
  questionId: string;
  optionId?: string;

  imagePath: string;

  label: string;
};

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}

export function ImageFramingEditor({
  target,
  projectId,
  questionId,
  optionId,
  imagePath,
  label,
}: Props) {
  const previewRef =
    useRef<HTMLDivElement>(
      null
    );

  const dragRef =
    useRef<{
      pointerId: number;
      startX: number;
      startY: number;
      positionX: number;
      positionY: number;
    } | null>(
      null
    );

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    dragging,
    setDragging,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    framing,
    setFraming,
  ] =
    useState<Framing>({
      fit:
        target ===
        "QUESTION"
          ? "CONTAIN"
          : "COVER",

      positionX:
        50,

      positionY:
        50,

      scale:
        1,
    });

  async function loadFraming() {
    try {
      setLoading(
        true
      );

      setError("");

      const result =
        target ===
        "QUESTION"
          ? await getQuestionImageFraming(
              projectId,
              questionId
            )
          : await getOptionImageFraming(
              projectId,
              questionId,
              optionId ?? ""
            );

      if (
        !result.success ||
        !result.framing
      ) {
        throw new Error(
          result.message
        );
      }

      setFraming(
        result.framing
      );
    } catch (
      loadError
    ) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar o enquadramento."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  async function openEditor() {
    setOpen(
      true
    );

    await loadFraming();
  }

  function closeEditor() {
    if (
      saving
    ) {
      return;
    }

    setOpen(
      false
    );

    setError("");
  }

  function reset() {
    setFraming({
      fit:
        target ===
        "QUESTION"
          ? "CONTAIN"
          : "COVER",

      positionX:
        50,

      positionY:
        50,

      scale:
        1,
    });
  }

  async function save() {
    try {
      setSaving(
        true
      );

      setError("");

      const result =
        target ===
        "QUESTION"
          ? await updateQuestionImageFraming(
              projectId,
              questionId,
              framing
            )
          : await updateOptionImageFraming(
              projectId,
              questionId,
              optionId ?? "",
              framing
            );

      if (
        !result.success
      ) {
        throw new Error(
          result.message
        );
      }

      setOpen(
        false
      );
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Não foi possível salvar o enquadramento."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (
      loading
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    dragRef.current = {
      pointerId:
        event.pointerId,

      startX:
        event.clientX,

      startY:
        event.clientY,

      positionX:
        framing.positionX,

      positionY:
        framing.positionY,
    };

    setDragging(
      true
    );
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    const drag =
      dragRef.current;

    const container =
      previewRef.current;

    if (
      !drag ||
      !container ||
      drag.pointerId !==
        event.pointerId
    ) {
      return;
    }

    const rect =
      container.getBoundingClientRect();

    const deltaX =
      event.clientX -
      drag.startX;

    const deltaY =
      event.clientY -
      drag.startY;

    /*
     * Arrastar a foto para a direita
     * reduz object-position X.
     */
    const nextX =
      clamp(
        drag.positionX -
          (deltaX /
            rect.width) *
            100,
        0,
        100
      );

    const nextY =
      clamp(
        drag.positionY -
          (deltaY /
            rect.height) *
            100,
        0,
        100
      );

    setFraming(
      (current) => ({
        ...current,

        positionX:
          nextX,

        positionY:
          nextY,
      })
    );
  }

  function finishDrag(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (
      dragRef.current
    ) {
      try {
        event.currentTarget.releasePointerCapture(
          event.pointerId
        );
      } catch {
        // Nada.
      }
    }

    dragRef.current =
      null;

    setDragging(
      false
    );
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        closeEditor();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  });

  return (
    <>
      <button
        type="button"
        onClick={
          openEditor
        }
        className="
          inline-flex
          items-center
          justify-center
          gap-1.5
          rounded-lg
          border
          border-violet-500/20
          bg-violet-500/[0.06]
          px-2.5
          py-2
          text-xs
          font-bold
          text-violet-300
          transition
          hover:border-violet-500/40
          hover:bg-violet-500/10
        "
      >
        <Crop
          size={14}
        />

        Editar
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/75
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              max-h-[94vh]
              w-full
              max-w-3xl
              overflow-y-auto
              rounded-3xl
              border
              border-white/10
              bg-[#101722]
              shadow-2xl
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-white/10
                px-6
                py-5
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-black
                    text-white
                  "
                >
                  Editar enquadramento
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-500
                  "
                >
                  {label}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeEditor
                }
                disabled={
                  saving
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  text-zinc-400
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X
                  size={19}
                />
              </button>
            </div>

            <div
              className="
                p-6
              "
            >
              {loading ? (
                <div
                  className="
                    flex
                    min-h-[420px]
                    items-center
                    justify-center
                  "
                >
                  <Loader2
                    size={30}
                    className="
                      animate-spin
                      text-violet-400
                    "
                  />
                </div>
              ) : (
                <>
                  {/* PREVIEW */}

                  <div
                    ref={
                      previewRef
                    }
                    onPointerDown={
                      handlePointerDown
                    }
                    onPointerMove={
                      handlePointerMove
                    }
                    onPointerUp={
                      finishDrag
                    }
                    onPointerCancel={
                      finishDrag
                    }
                    className={`
                      relative
                      mx-auto
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-black
                      touch-none
                      select-none

                      ${
                        target ===
                        "QUESTION"
                          ? "aspect-video max-w-2xl"
                          : "aspect-[4/3] max-w-xl"
                      }

                      ${
                        dragging
                          ? "cursor-grabbing"
                          : "cursor-grab"
                      }
                    `}
                  >
                    <img
                      src={
                        imagePath
                      }
                      alt=""
                      draggable={
                        false
                      }
                      className="
                        h-full
                        w-full
                        pointer-events-none
                        select-none
                      "
                      style={{
                        objectFit:
                          framing.fit ===
                          "COVER"
                            ? "cover"
                            : "contain",

                        objectPosition:
                          `${framing.positionX}% ${framing.positionY}%`,

                        transform:
                          `scale(${framing.scale})`,

                        transformOrigin:
                          `${framing.positionX}% ${framing.positionY}%`,
                      }}
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        flex
                        items-end
                        justify-center
                        bg-gradient-to-t
                        from-black/40
                        via-transparent
                        to-transparent
                        pb-3
                      "
                    >
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          bg-black/60
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-white
                        "
                      >
                        <Move
                          size={13}
                        />

                        Arraste para reposicionar
                      </span>
                    </div>
                  </div>

                  {/* FIT */}

                  <div
                    className="
                      mt-6
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      Ajuste da imagem
                    </p>

                    <div
                      className="
                        mt-3
                        grid
                        grid-cols-2
                        gap-3
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setFraming(
                            (
                              current
                            ) => ({
                              ...current,
                              fit:
                                "COVER",
                            })
                          )
                        }
                        className={`
                          flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-sm
                          font-bold
                          transition

                          ${
                            framing.fit ===
                            "COVER"
                              ? "border-violet-500 bg-violet-500/15 text-violet-300"
                              : "border-white/10 bg-black/20 text-zinc-400 hover:bg-white/5"
                          }
                        `}
                      >
                        <Maximize2
                          size={17}
                        />

                        Preencher
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFraming(
                            (
                              current
                            ) => ({
                              ...current,
                              fit:
                                "CONTAIN",
                            })
                          )
                        }
                        className={`
                          flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-sm
                          font-bold
                          transition

                          ${
                            framing.fit ===
                            "CONTAIN"
                              ? "border-violet-500 bg-violet-500/15 text-violet-300"
                              : "border-white/10 bg-black/20 text-zinc-400 hover:bg-white/5"
                          }
                        `}
                      >
                        <Minimize2
                          size={17}
                        />

                        Conter
                      </button>
                    </div>
                  </div>

                  {/* ZOOM */}

                  <div
                    className="
                      mt-6
                      rounded-2xl
                      border
                      border-white/10
                      bg-black/20
                      p-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-bold
                          text-zinc-300
                        "
                      >
                        <ZoomIn
                          size={16}
                        />

                        Zoom
                      </span>

                      <span
                        className="
                          text-xs
                          font-bold
                          text-violet-400
                        "
                      >
                        {Math.round(
                          framing.scale *
                            100
                        )}
                        %
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={
                        framing.scale
                      }
                      onChange={(
                        event
                      ) =>
                        setFraming(
                          (
                            current
                          ) => ({
                            ...current,

                            scale:
                              Number(
                                event.target
                                  .value
                              ),
                          })
                        )
                      }
                      className="
                        mt-3
                        w-full
                        accent-violet-500
                      "
                    />
                  </div>

                  {/* POSIÇÃO */}

                  <div
                    className="
                      mt-4
                      grid
                      gap-4
                      md:grid-cols-2
                    "
                  >
                    <div
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/20
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          justify-between
                          text-sm
                        "
                      >
                        <span
                          className="
                            font-bold
                            text-zinc-300
                          "
                        >
                          Horizontal
                        </span>

                        <span
                          className="
                            text-zinc-500
                          "
                        >
                          {Math.round(
                            framing.positionX
                          )}
                          %
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={
                          framing.positionX
                        }
                        onChange={(
                          event
                        ) =>
                          setFraming(
                            (
                              current
                            ) => ({
                              ...current,

                              positionX:
                                Number(
                                  event
                                    .target
                                    .value
                                ),
                            })
                          )
                        }
                        className="
                          mt-3
                          w-full
                          accent-violet-500
                        "
                      />
                    </div>

                    <div
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/20
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          justify-between
                          text-sm
                        "
                      >
                        <span
                          className="
                            font-bold
                            text-zinc-300
                          "
                        >
                          Vertical
                        </span>

                        <span
                          className="
                            text-zinc-500
                          "
                        >
                          {Math.round(
                            framing.positionY
                          )}
                          %
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={
                          framing.positionY
                        }
                        onChange={(
                          event
                        ) =>
                          setFraming(
                            (
                              current
                            ) => ({
                              ...current,

                              positionY:
                                Number(
                                  event
                                    .target
                                    .value
                                ),
                            })
                          )
                        }
                        className="
                          mt-3
                          w-full
                          accent-violet-500
                        "
                      />
                    </div>
                  </div>

                  {error && (
                    <div
                      className="
                        mt-4
                        rounded-xl
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-400
                      "
                    >
                      {error}
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
                      pt-5
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        reset
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-white/10
                        bg-white/5
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-zinc-300
                        transition
                        hover:bg-white/10
                      "
                    >
                      <RotateCcw
                        size={16}
                      />

                      Restaurar
                    </button>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <button
                        type="button"
                        onClick={
                          closeEditor
                        }
                        disabled={
                          saving
                        }
                        className="
                          rounded-xl
                          border
                          border-white/10
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          text-zinc-400
                          transition
                          hover:bg-white/5
                        "
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={
                          save
                        }
                        disabled={
                          saving
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
                          py-2.5
                          text-sm
                          font-bold
                          text-white
                          transition
                          hover:bg-violet-500
                          disabled:opacity-50
                        "
                      >
                        {saving ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Save
                            size={16}
                          />
                        )}

                        {saving
                          ? "Salvando..."
                          : "Salvar"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}