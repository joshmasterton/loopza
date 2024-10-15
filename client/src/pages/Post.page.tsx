import { useDispatch, useSelector } from "react-redux";
import { Post } from "../components/Post.component";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getPostComment } from "../features/postsCommentsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingContainer } from "../components/Loading.component";

export const PostPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, status } = useSelector(
    (state: RootState) => state.postsComments
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const postId = location.pathname.split("/").pop();
    if (postId) {
      dispatch(getPostComment("post", parseInt(postId)));
    } else {
      navigate("/");
    }
  }, []);

  if (item) {
    return (
      <div id="main">
        {status === "loading" ? <LoadingContainer /> : <Post item={item} />}
        <div className="comments">
          <div className="blank" />
        </div>
      </div>
    );
  }
};
