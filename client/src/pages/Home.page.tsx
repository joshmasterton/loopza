import { Post } from "../components/Post.component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getPostsComments } from "../features/postsCommentsSlice";
import { LoadingContainer } from "../components/Loading.component";
import { Button } from "../components/Button.component";
import { useNavigate } from "react-router-dom";
import { showPopup } from "../features/popupSlice";
import { MdOutlineCreate } from "react-icons/md";

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, status } = useSelector(
    (state: RootState) => state.postsComments
  );

  useEffect(() => {
    dispatch(getPostsComments("post"));
  }, []);

  return (
    <>
      <div id="main">
        {status === "loading" ? (
          <LoadingContainer />
        ) : items && items.length > 0 ? (
          items.map((item) => <Post key={item.id} item={item} />)
        ) : (
          <div className="blank" />
        )}
      </div>
      <Button
        type="button"
        className="fixed"
        id="newPost"
        onClick={() => {
          if (user) {
            navigate("/newPost");
          } else {
            dispatch(
              showPopup({ messages: ["Please login to use this feature"] })
            );
          }
        }}
      >
        <MdOutlineCreate />
      </Button>
    </>
  );
};
