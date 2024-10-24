import { useDispatch, useSelector } from "react-redux";
import { Post } from "../components/Post.component";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getComments, getPost } from "../features/postsCommentsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LoadingContainer,
  LoadingSpinner,
} from "../components/Loading.component";
import { Comment } from "../components/Comment.component";
import { Button } from "../components/Button.component";

export const PostPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    post,
    comments,
    commentsPage,
    postStatus,
    commentsStatus,
    previousStatus,
    moreStatus,
  } = useSelector((state: RootState) => state.postsComments);
  const dispatch = useDispatch<AppDispatch>();
  const postId = location.pathname.split("/").pop();

  useEffect(() => {
    if (postId) {
      dispatch(getPost(parseInt(postId), user?.id));
      dispatch(getComments(parseInt(postId), 0, user?.id));
    } else {
      navigate("/");
    }
  }, [user]);

  return (
    <div id="main">
      {postStatus === "loading" ? (
        <LoadingContainer />
      ) : post ? (
        <>
          <Post item={post} canComment />
          {commentsPage !== 0 && (
            <Button
              type="button"
              id="loadPrevious"
              className="container more"
              onClick={async () => {
                await dispatch(
                  getComments(
                    parseInt(postId ?? ""),
                    commentsPage,
                    user?.id,
                    true,
                    false
                  )
                );
              }}
            >
              {previousStatus === "loading" ? (
                <LoadingSpinner />
              ) : (
                <div>Load previous</div>
              )}
            </Button>
          )}
          {commentsStatus === "loading" ? (
            <LoadingContainer />
          ) : (
            <>
              <div className="comments">
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment key={comment.id} item={comment} canComment />
                  ))
                ) : (
                  <div className="blank" />
                )}
              </div>
              {comments?.length === 10 && (
                <Button
                  type="button"
                  id="loadMore"
                  className="container more"
                  onClick={async () => {
                    await dispatch(
                      getComments(
                        parseInt(postId ?? ""),
                        commentsPage,
                        user?.id,
                        false,
                        true
                      )
                    );
                  }}
                >
                  {moreStatus === "loading" ? (
                    <LoadingSpinner />
                  ) : (
                    <div>Load more</div>
                  )}
                </Button>
              )}
            </>
          )}
        </>
      ) : (
        <div className="blank" />
      )}
    </div>
  );
};
