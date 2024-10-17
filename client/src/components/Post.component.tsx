import { Button } from "./Button.component";
import { BiHeart } from "react-icons/bi";
import { Navigation } from "./Navigation.component";
import { PostCommentTypes } from "../../types/features/features.types";
import { IoArrowDown, IoChatbubbleOutline } from "react-icons/io5";
import { LuReply } from "react-icons/lu";
import { Input } from "./Input.component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { getComments, newPostComment } from "../features/postsCommentsSlice";
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
  const { user } = useSelector((state: RootState) => state.auth);
  const { newItemStatus } = useSelector(
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
          parent_id: item.id,
          type: "comment",
        })
      );

      setShowReplyOption(false);
      reset();

      if (item.id) {
        await dispatch(getComments(item.id));
      }
    });
  };

  return (
    <div className="post">
      {!canComment && <Navigation link={`/post/${item?.id}`} type="button" />}
      <header>
        <div>
          <img src={item?.profile_picture_url} alt="" />
        </div>
        <div>
          {item?.username}
          <p>{item?.email}</p>
        </div>
      </header>
      <main>
        <div>
          {item.text_image_url && <img src={item.text_image_url} alt="" />}
          <div>{item.text}</div>
        </div>
      </main>
      <footer>
        <Button id="" className="small like" type="button">
          <BiHeart />
          <p>{item.likes}</p>
        </Button>
        <Button id="" className="small danger" type="button">
          <IoArrowDown />
          <p>{item.dislikes}</p>
        </Button>
        <Button id="" className="small" type="button">
          <IoChatbubbleOutline />
          <p>{item.comments}</p>
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
