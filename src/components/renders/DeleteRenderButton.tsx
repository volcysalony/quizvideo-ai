"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Loader2,
  Trash2,
} from "lucide-react";

type Props = {
  renderId: string;
};

export function DeleteRenderButton({
  renderId,
}: Props) {
  const router =
    useRouter();

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Excluir esta renderização?\n\nO arquivo MP4 também será removido permanentemente do computador."
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response =
        await fetch(
          `/api/renders/${renderId}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Não foi possível excluir a renderização."
        );
      }

      /*
       * Atualiza os Server Components.
       *
       * O item excluído desaparecerá
       * do histórico.
       */
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a renderização.";

      window.alert(
        message
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={
        handleDelete
      }
      disabled={
        deleting
      }
      title="Excluir renderização"
      className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-red-500/20
        bg-red-500/[0.06]
        px-3
        py-2.5
        text-sm
        font-bold
        text-red-400
        transition
        hover:border-red-500/40
        hover:bg-red-500/10
        hover:text-red-300
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {deleting ? (
        <Loader2
          size={16}
          className="animate-spin"
        />
      ) : (
        <Trash2
          size={16}
        />
      )}

      <span
        className="
          hidden
          lg:inline
        "
      >
        {deleting
          ? "Excluindo..."
          : "Excluir"}
      </span>
    </button>
  );
}