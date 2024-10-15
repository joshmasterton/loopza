import { useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PostFormTypes } from "../../types/pages/Page.types";
import { Input } from "../components/Input.component";
import { Button } from "../components/Button.component";
import { MdAttachFile } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import {
  getPostsComments,
  newPostComment,
} from "../features/postsCommentsSlice";
import * as yup from "yup";
import { LoadingSpinner } from "../components/Loading.component";

export const NewPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const pictureLabelRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const { status } = useSelector((state: RootState) => state.postsComments);
  const { user } = useSelector((state: RootState) => state.auth);

  const postSchema = yup.object().shape({
    post: yup
      .string()
      .max(500, "Cannot exceed 500 characters")
      .required("Post cannot be empty"),
    postPicture: yup
      .mixed<FileList>()
      .test("validFileType", "Picture must be an image", (file) => {
        if (!file || file.length === 0) return true;
        return file[0].type.includes("image");
      })
      .test("maximumFileSize", "Picture is too large", (file) => {
        if (!file || file.length === 0) return true;
        return file[0].size < 2000000;
      }),
  });

  const {
    register,
    watch,
    setFocus,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<PostFormTypes>({
    mode: "onChange",
    resolver: yupResolver(postSchema),
  });

  const onSubmit = async (data: PostFormTypes) => {
    const formData = new FormData();

    formData.append("post", data.post);
    formData.append("type", "post");
    if (data.postPicture) {
      formData.append("postPicture", data.postPicture[0]);
    }

    await dispatch(newPostComment(formData));
    navigate("/");
    await dispatch(getPostsComments("post"));
  };

  const post = watch("post");
  const postPicture = watch("postPicture");

  useEffect(() => {
    if (postPicture?.[0] && postPicture?.[0].type.includes("image")) {
      setImagePreview(URL.createObjectURL(postPicture[0]));
    } else {
      setImagePreview(undefined);
    }
  }, [postPicture]);

  return (
    <div id="main" className="newPost">
      <form
        method="POST"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          if (errors.postPicture) {
            pictureLabelRef.current?.focus();
          } else {
            setFocus("post");
          }
        })}
      >
        <Input
          id="post"
          placeholder={`What's on your mind, ${user?.username}?`}
          type="text"
          isTextArea
          max={500}
          register={register("post", { required: true })}
        />
        {errors.post && <div className="error">{errors.post.message}</div>}
        {errors.postPicture && (
          <div className="error">{errors.postPicture.message}</div>
        )}
        <main>
          <Input
            id="postPicture"
            type="file"
            className="file"
            register={register("postPicture", { required: false })}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="" />
            ) : (
              <MdAttachFile />
            )}
          </Input>
          <Button
            id=""
            className="clear"
            type="button"
            onClick={() => {
              resetField("postPicture");
              setImagePreview(undefined);
            }}
          >
            <CgClose />
          </Button>
          <div className="boxElement">
            {post && post.length ? post?.length : 0}
          </div>
          <Button id="" type="submit">
            {status === "loading" ? (
              <LoadingSpinner isPrimary />
            ) : (
              <div>Post</div>
            )}
          </Button>
        </main>
      </form>
    </div>
  );
};
