import { Button } from "./Button.component";
import { BiHeart } from "react-icons/bi";
import { Navigation } from "./Navigation.component";
import { PostCommentTypes } from "../../types/features/features.types";
import { IoArrowDown, IoChatbubbleOutline } from "react-icons/io5";
import { LuReply } from "react-icons/lu";
import { Input } from "./Input.component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { newPostComment } from "../features/postsCommentsSlice";
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
          parent_id: item.parent_id ?? undefined,
          comment_parent_id: item.id,
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
            parent_id: item.parent_id,
            comment_parent_id: item.id,
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
          {depth < 2 && (
            <Button id="" className="small" type="button">
              <IoChatbubbleOutline />
              <p>{item.comments}</p>
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
