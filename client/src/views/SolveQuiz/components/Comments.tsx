import { useState } from "react";
import CustomInput from "../../../components/reusable/elements/CustomInput";
import { Button } from "../../../components/reusable/elements/Button";
import ReactTimeAgo from "react-time-ago";
import { BiSolidLike } from "react-icons/bi";
import Spinner from "../../../components/reusable/Spinner";
import { addComment, fetchComments } from "../../../services/commentService";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { useModalContext } from "../../../contexts/ModalContext";
import { TopModal } from "../../../components/reusable/modals/TopModal";
import { FaRegComment } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

export const Comments = ({ quizId }: { quizId: string }) => {
  const [comment, setComment] = useState<string>("");
  const { loggedUserData } = useLoggedUserContext();
  const { openModal } = useModalContext();

  const {
    data: comments,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["comments", quizId],
    queryFn: () => fetchComments(`quizId=${quizId}`),
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleAddComment = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      if (comment.length < 5)
        throw new Error("Komentarz musi mieć minimum 5 znaków.");
      const response = await addComment({ quizId, comment });
      refetch();
      openModal(
        <TopModal label={response.message} icon={<FaRegComment />} />,
        "top",
        5,
      );
      setComment("");
    } catch (err) {
      openModal(
        <TopModal label={err.message} icon={<FaRegComment />} />,
        "top",
        5,
      );
    }
  };

  if (isLoading) return <Spinner />;

  if (error) return <div> {error.message}</div>;

  return (
    <>
      <div className="flex flex-col gap-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`${comment.userId === loggedUserData?._id && "order-1"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.user.profilePicture}
                    className="8-5 w-8 rounded-full"
                  />
                  <span className="text-base">{comment.user.nickname}</span>
                  <ReactTimeAgo
                    date={comment.date}
                    locale="pl-PL"
                    className="text-xs opacity-50"
                  />
                </div>
                <BiSolidLike
                  className={`relative bottom-[1px] text-2xl ${comment.rating > 0 ? "text-green-500" : comment.rating < 0 ? "rotate-180 text-red-600" : "hidden"}`}
                />
              </div>
              <div className="flex w-full justify-end">
                <p className="shadow-custom w-[90%] rounded-lg bg-secondary px-2 py-3 opacity-80">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="flex w-full justify-center text-lg">Brak komentarzy.</p>
        )}
      </div>

      {loggedUserData && (
        <form
          className="inputBox mb-4 flex flex-col items-end gap-2 xl:mb-0"
          onSubmit={(e) => handleAddComment(e)}
        >
          <CustomInput
            styles="w-[320px] h-12"
            label="Komentarz"
            type="text"
            value={comment}
            onChange={setComment}
          />
          <Button
            styles="px-[29px] py-2"
            type="submit"
            onClick={(e) => handleAddComment(e)}
          >
            Dodaj
          </Button>
        </form>
      )}
    </>
  );
};
