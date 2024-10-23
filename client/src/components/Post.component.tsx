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
import { useState } from "react";
import {
  getComments,
  likeDislike,
  newPostComment,
} from "../features/postsCommentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { CgClose } from "react-icons/cg";
import { LoadingSpinner } from "./Loading.component";
import { withUserCheck } from "../utilities/Protected.utilities";
import * as yup from "yup";

export const Post = ({
  item,
  canComment = false,
}: {
  item: PostCommentTypes;
  canComment?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPost, setCurrentPost] = useState(item);
  const [likeStatus, setLikeStatus] = useState(false);
  const [dislikeStatus, setDislikeStatus] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { newItemStatus, commentsPage } = useSelector(
    (state: RootState) => state.postsComments
  );
  const [showReplyOption, setShowReplyOption] = useState(false);

  const commentSchema = yup.object().shape({
    comment: yup.string().min(1, "Comment cannot be empty").required(),
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
          parent_id: currentPost.id,
          type: "comment",
        })
      );

      setShowReplyOption(false);
      reset();

      if (currentPost.id) {
        await dispatch(getComments(currentPost.id, commentsPage));
      }
    });
  };

  return (
    <div className="post">
      {!canComment && (
        <Navigation link={`/post/${currentPost?.id}`} type="button" />
      )}
      <header>
        <Navigation type="link" link={`/profile/${currentPost.user_id}`}>
          <img src={currentPost?.profile_picture_url} alt="" />
        </Navigation>
        <div>
          <div>{currentPost?.username}</div>
          <p>{currentPost?.created_at}</p>
        </div>
      </header>
      <main>
        <div>
          {currentPost.text_image_url && (
            <img src={currentPost.text_image_url} alt="" />
          )}
          <div>{currentPost.text}</div>
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
                likeDislike(currentPost.id, "like", currentPost.type)
              );

              if (updatedComment) {
                setCurrentPost(updatedComment);
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
              {currentPost.reaction === "like" ? <BiSolidHeart /> : <BiHeart />}
              <p>{currentPost.likes}</p>
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
                likeDislike(currentPost.id, "dislike", currentPost.type)
              );

              if (updatedComment) {
                setCurrentPost(updatedComment);
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
              {currentPost.reaction === "dislike" ? (
                <BiSolidDownvote />
              ) : (
                <BiDownvote />
              )}
              <p>{currentPost.dislikes}</p>
            </>
          )}
        </Button>
        <Button id="" className="small" type="button">
          <IoChatbubbleOutline />
          <p>{currentPost.comments}</p>
        </Button>
        {canComment && (
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
            placeholder={`Write comment...`}
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
              <div>Comment</div>
            )}
          </Button>
        </form>
      )}
    </div>
  );
};
