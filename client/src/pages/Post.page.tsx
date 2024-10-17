import { useDispatch, useSelector } from "react-redux";
import { Post } from "../components/Post.component";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getComments, getPost } from "../features/postsCommentsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingContainer } from "../components/Loading.component";
import { Comment } from "../components/Comment.component";

export const PostPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post, comments, postStatus, commentsStatus } = useSelector(
    (state: RootState) => state.postsComments
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const postId = location.pathname.split("/").pop();
    if (postId) {
      dispatch(getPost(parseInt(postId)));
      dispatch(getComments(parseInt(postId)));
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div id="main">
      {postStatus === "loading" ? (
        <LoadingContainer />
      ) : post ? (
        <Post item={post} canComment />
      ) : (
        <div className="blank" />
      )}
      {commentsStatus === "loading" ? (
        <LoadingContainer />
      ) : (
        <div className="comments">
          {comments && comments.length > 0 ? (
            comments.map((post) => (
              <Comment key={post.id} item={post} canComment />
            ))
          ) : (
            <div className="blank" />
          )}
        </div>
      )}
    </div>
  );
};
