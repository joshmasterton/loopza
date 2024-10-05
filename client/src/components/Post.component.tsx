import { Button } from "./Button.component";
import { BiSolidComment, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { Navigation } from "./Navigation.component";
import { PostCommentTypes } from "../../types/features/features.types";

export const Post = ({ item }: { item: PostCommentTypes }) => {
  return (
    <div className="post">
      <Navigation link={`/post/${item?.id}`} type="button" />
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
        <Button id="" className="small" type="button">
          <BiSolidLike />
          <p>{item.likes}</p>
        </Button>
        <Button id="" className="small" type="button">
          <BiSolidDislike />
          <p>{item.dislikes}</p>
        </Button>
        <Button id="" className="small" type="button">
          <BiSolidComment />
          <p>{item.comments}</p>
        </Button>
      </footer>
    </div>
  );
};
