import { Post } from "../components/Post.component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getPosts } from "../features/postsCommentsSlice";
import {
  LoadingContainer,
  LoadingSpinner,
} from "../components/Loading.component";
import { Button } from "../components/Button.component";
import { useNavigate } from "react-router-dom";
import { MdOutlineCreate } from "react-icons/md";
import { withUserCheck } from "../utilities/Protected.utilities";

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { postsPage, posts, postsStatus, previousStatus, moreStatus } =
    useSelector((state: RootState) => state.postsComments);

  useEffect(() => {
    dispatch(getPosts(postsPage, user?.id));
  }, [user]);

  return (
    <>
      <div id="main">
        {postsStatus === "loading" ? (
          <LoadingContainer />
        ) : posts && posts.length > 0 ? (
          <>
            {postsPage !== 0 && (
              <Button
                type="button"
                id="loadPrevious"
                className="transparent more"
                onClick={async () => {
                  await dispatch(getPosts(postsPage, user?.id, true, false));
                }}
              >
                {previousStatus === "loading" ? (
                  <LoadingSpinner />
                ) : (
                  <div>Load previous</div>
                )}
              </Button>
            )}
            {posts.map((post) => (
              <Post key={post.id} item={post} />
            ))}
            {posts.length < 3 && <div className="blank" />}
            <Button
              type="button"
              id="loadMore"
              className="transparent more"
              onClick={async () => {
                await dispatch(getPosts(postsPage, user?.id, false, true));
              }}
            >
              {moreStatus === "loading" ? (
                <LoadingSpinner />
              ) : (
                <div>Load more</div>
              )}
            </Button>
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
