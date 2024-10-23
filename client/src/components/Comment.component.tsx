import { Button } from "./Button.component";
import {
  BiDownvote,
  BiHeart,
  BiSolidDownvote,
  BiSolidHeart,
} from "react-icons/bi";
import { Navigation } from "./Navigation.component";
import { PostCommentTypes } from "../../types/features/features.types";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LuReply } from "react-icons/lu";
import { Input } from "./Input.component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { likeDislike, newPostComment } from "../features/postsCommentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { CgClose } from "react-icons/cg";
import { LoadingSpinner } from "./Loading.component";
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
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
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
      await getReplies(depth, page);
    });
  };

  const getReplies = async (
    depth: number = 0,
    page: number = 0,
    isPrevious: boolean = false,
    isMore: boolean = false
  ) => {
    if (depth < 2) {
      try {
        if (isMore) {
          setLoadingMore(true);
        } else {
          setLoadingReplies(true);
        }

        const response = await axios.get(`${API_URL}/postComment/gets`, {
          params: {
            type: "comment",
            page: isMore ? page + 1 : isPrevious ? Math.max(0, page - 1) : 0,
            parent_id: currentComment.parent_id,
            comment_parent_id: currentComment.id,
          },
        });

        if (response.data.length > 0 && isMore) {
          setPage(page + 1);
        } else if (isPrevious) {
          setPage(Math.max(0, page - 1));
        }

        if (response.data.length > 0) {
          setReplies(response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
      } finally {
        setLoadingMore(false);
        setLoadingReplies(false);
      }
    }
  };

  useEffect(() => {
    getReplies(depth, page, false, false);
  }, []);

  if (depth < 3) {
    return (
      <div className={`comment ${type}`}>
        <div className="bar">
          <div />
          {depth < 2 && (
            <>
              <Button
                type="button"
                id="remove"
                className="small previous"
                onClick={() => {
                  setReplies(undefined);
                  setPage(0);
                }}
              >
                <div>-</div>
              </Button>
              <Button
                type="button"
                id="loadMore"
                className="small"
                onClick={async () => {
                  if (replies?.length === 0 || replies === undefined) {
                    await getReplies(depth, page, false, false);
                  } else {
                    await getReplies(depth, page, false, true);
                  }
                }}
              >
                {loadingMore ? <LoadingSpinner /> : <div>+</div>}
              </Button>
            </>
          )}
        </div>
        {!canComment && (
          <Navigation link={`/post/${currentComment?.id}`} type="button" />
        )}
        <header>
          <Navigation type="link" link={`/profile/${currentComment.user_id}`}>
            <img src={currentComment?.profile_picture_url} alt="" />
          </Navigation>
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
            disabled={dislikeStatus || likeStatus}
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
            disabled={dislikeStatus || likeStatus}
          >
            {dislikeStatus ? (
              <LoadingSpinner isSmall />
            ) : (
              <>
                {currentComment.reaction === "dislike" ? (
                  <BiSolidDownvote />
                ) : (
                  <BiDownvote />
                )}
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
          <LoadingSpinner />
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
