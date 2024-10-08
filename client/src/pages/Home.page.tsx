import { Post } from "../components/Post.component";
import { IoCreate } from "react-icons/io5";
import { Navigation } from "../components/Navigation.component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getPostsComments } from "../features/postsCommentsSlice";
import { LoadingContainer } from "../components/Loading.component";

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector(
    (state: RootState) => state.postsComments
  );

  useEffect(() => {
    dispatch(getPostsComments("post"));
  }, []);

  return (
    <div id="main">
      {status === "loading" ? (
        <LoadingContainer />
      ) : (
        items &&
        items.length > 0 &&
        items.map((item) => <Post key={item.id} item={item} />)
      )}
      <Navigation link="/newPost" type="button">
        <IoCreate />
      </Navigation>
    </div>
  );
};
