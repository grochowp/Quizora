import { useState } from "react";
import CustomInput from "../../../components/reusable/elements/CustomInput";
import { Button } from "../../../components/reusable/elements/Button";

export const Comments = () => {
  const [comment, setComment] = useState<string>("");

  const handleAddComment = () => {
    console.log(comment);
    setComment("");
  };

  const comments: IComment[] = [{}];

  return (
    <>
      <div>a</div>
      <div className="inputBox flex flex-col items-end gap-2">
        <CustomInput
          styles="w-[320px] h-12"
          label="Komentarz"
          type="text"
          value={comment}
          onChange={setComment}
        />
        <Button
          styles="px-[29px] py-2"
          type="button"
          onClick={handleAddComment}
        >
          Dodaj
        </Button>
      </div>
    </>
  );
};
