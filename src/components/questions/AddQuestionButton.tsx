import {
  Plus,
} from "lucide-react";

import {
  addQuestion,
} from "@/app/projetos/[id]/actions";

type Props = {
  projectId: string;
};

export function AddQuestionButton({
  projectId,
}: Props) {
  const action =
    addQuestion.bind(
      null,
      projectId
    );

  return (
    <form action={action}>
      <button
        type="submit"
        className="
          inline-flex
          items-center
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
        "
      >
        <Plus size={18} />

        Adicionar pergunta
      </button>
    </form>
  );
}