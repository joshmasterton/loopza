import { Button } from "./Button.component";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { Navigation } from "./Navigation.component";
import { PostCommentTypes } from "../../types/features/features.types";
import { IoArrowDown, IoChatbubbleOutline } from "react-icons/io5";
import { LuReply } from "react-icons/lu";
import { Input } from "./Input.component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { likeDislike, newPostComment } from "../features/postsCommentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { CgClose } from "react-icons/cg";
import { LoadingContainer, LoadingSpinner } from "./Loading.component";
import { API_URL } from "../utilities/request.utilities";
import { withUserCheck } from "../utilities/Protected.utilities";
import * as yup from "yup";
import axios from "axios";

export const Comment = ({
  item,
  canComment = false,
  type = "reply",
  depth = 0,
}: {
  item: PostCommentTypes;
  canComment?: boolean;
  type?: "reply" | "comment";
  depth?: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentComment, setCurrentComment] = useState(item);
  const [likeStatus, setLikeStatus] = useState(false);
  const [dislikeStatus, setDislikeStatus] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { newItemStatus } = useSelector(
    (state: RootState) => state.postsComments
  );
  const [showReplyOption, setShowReplyOption] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replies, setReplies] = useState<PostCommentTypes[] | undefined>(
    undefined
  );

  const commentSchema = yup.object().shape({
    comment: yup.string().min(1, "Reply cannot be empty").required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ comment: string }>({
    mode: "onChange",
    resolver: yupResolver(commentSchema),
  });

  const onSubmit = async (data: { comment: string }) => {
    await withUserCheck(user, dispatch, async () => {
      await dispatch(
        newPostComment({
          comment: data.comment,
          parent_id: currentComment.parent_id ?? undefined,
          comment_parent_id: currentComment.id,
          type: "comment",
        })
      );

      reset();
      setShowReplyOption(false);
      await getReplies(depth);
    });
  };

  const getReplies = async (depth: number = 0) => {
    if (depth < 2) {
      try {
        setLoadingReplies(true);
        const response = await axios.get(`${API_URL}/postComment/gets`, {
          params: {
            type: "comment",
            page: 0,
            parent_id: currentComment.parent_id,
            comment_parent_id: currentComment.id,
          },
        });

        if (response.data.length > 0) {
          setReplies(response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
      } finally {
        setLoadingReplies(false);
      }
    }
  };

  useEffect(() => {
    getReplies(depth);
  }, []);

  if (depth < 3) {
    return (
      <div className={`comment ${type}`}>
        <div className="bar">
          <div />
        </div>
        {!canComment && (
          <Navigation link={`/post/${currentComment?.id}`} type="button" />
        )}
        <header>
          <div>
            <img src={currentComment?.profile_picture_url} alt="" />
          </div>
          <div>
            {currentComment?.username}
            <p>{currentComment?.email}</p>
          </div>
        </header>
        <main>
          <div>
            {currentComment.text_image_url && (
              <img src={currentComment.text_image_url} alt="" />
            )}
            <div>{currentComment.text}</div>
          </div>
        </main>
        <footer>
          <Button
            id=""
            className="small like"
            type="button"
            onClick={async () =>
              await withUserCheck(user, dispatch, async () => {
                setLikeStatus(true);

                const updatedComment = await dispatch(
                  likeDislike(currentComment.id, "like", currentComment.type)
                );

                if (updatedComment) {
                  setCurrentComment(updatedComment);
                }

                setLikeStatus(false);
              })
            }
          >
            {likeStatus ? (
              <LoadingSpinner isSmall />
            ) : (
              <>
                {currentComment.reaction === "like" ? (
                  <BiSolidHeart />
                ) : (
                  <BiHeart />
                )}
                <p>{currentComment.likes}</p>
              </>
            )}
          </Button>
          <Button
            id=""
            className="small danger"
            type="button"
            onClick={async () =>
              await withUserCheck(user, dispatch, async () => {
                setDislikeStatus(true);

                const updatedComment = await dispatch(
                  likeDislike(currentComment.id, "dislike", currentComment.type)
                );

                if (updatedComment) {
                  setCurrentComment(updatedComment);
                }

                setDislikeStatus(false);
              })
            }
          >
            {dislikeStatus ? (
              <LoadingSpinner isSmall />
            ) : (
              <>
                <IoArrowDown />
                <p>{currentComment.dislikes}</p>
              </>
            )}
          </Button>
          {depth < 2 && (
            <Button id="" className="small" type="button">
              <IoChatbubbleOutline />
              <p>{currentComment.comments}</p>
            </Button>
          )}
          {canComment && depth < 2 && (
            <div className="reply">
              <Button
                id=""
                className="small"
                type="button"
                onClick={() => setShowReplyOption(!showReplyOption)}
              >
                {showReplyOption ? <CgClose /> : <LuReply />}
              </Button>
            </div>
          )}
        </footer>
        {showReplyOption && canComment && (
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="comment"
              placeholder={`Write reply...`}
              type="text"
              isTextArea
              max={500}
              register={register("comment", { required: true })}
            />
            {errors.comment && (
              <div className="error">{errors.comment.message}</div>
            )}
            <Button type="submit" id="comment" className="primary">
              {newItemStatus === "loading" ? (
                <LoadingSpinner isPrimary />
              ) : (
                <div>Reply</div>
              )}
            </Button>
          </form>
        )}
        {loadingReplies ? (
          <LoadingContainer />
        ) : (
          replies &&
          replies?.length > 0 &&
          replies.map((reply) => (
            <Comment
              key={reply.id}
              item={reply}
              canComment
              type="reply"
              depth={depth + 1}
            />
          ))
        )}
      </div>
    );
  }
};
