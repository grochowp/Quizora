import { memo, useState } from "react";
import { Comments } from "./Comments";
import { SimilarQuizzes } from "./SimilarQuizzes";

export const SideBar = memo(({ quizId }: { quizId: string }) => {
  const [selectedAction, setSelectedAction] = useState<"comments" | "quizzes">(
    "comments",
  );

  return (
    <div className="min-h-[668px] w-[300px] flex-1 items-stretch font-poppins md:w-[320px]">
      <div className="mb-8 flex w-full justify-between text-xl">
        <span
          className={`${selectedAction !== "comments" && "opacity-50"} cursor-pointer`}
          onClick={() => setSelectedAction("comments")}
        >
          Komentarze
        </span>
        <span
          className={`${selectedAction !== "quizzes" && "opacity-50"} cursor-pointer`}
          onClick={() => setSelectedAction("quizzes")}
        >
          Podobne
        </span>
      </div>

      <div className="flex min-h-[608px] flex-col justify-between">
        {selectedAction === "comments" ? (
          <Comments quizId={quizId} />
        ) : (
          <SimilarQuizzes />
        )}
      </div>
    </div>
  );
});
