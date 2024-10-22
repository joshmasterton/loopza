import { Post } from "../components/Post.component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getPosts } from "../features/postsCommentsSlice";
import { LoadingContainer } from "../components/Loading.component";
import { Button } from "../components/Button.component";
import { useNavigate } from "react-router-dom";
import { MdOutlineCreate } from "react-icons/md";
import { withUserCheck } from "../utilities/Protected.utilities";

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { posts, postsStatus } = useSelector(
    (state: RootState) => state.postsComments
  );

  useEffect(() => {
    dispatch(getPosts(0, user?.id));
  }, []);

  return (
    <>
      <div id="main">
        {postsStatus === "loading" ? (
          <LoadingContainer />
        ) : posts && posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <Post key={post.id} item={post} />
            ))}
            <div className="blank" />
          </>
        ) : (
          <div className="blank" />
        )}
      </div>
      <Button
        type="button"
        className="fixed primary"
        id="newPost"
        onClick={async () => {
          await withUserCheck(user, dispatch, () => {
            navigate("/new");
          });
        }}
      >
        <MdOutlineCreate />
      </Button>
    </>
  );
};
