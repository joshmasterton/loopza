import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { showPopup } from "../features/popupSlice";

export const Protected = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/");
      dispatch(showPopup({ messages: ["Please login to use this feature"] }));
    }
  }, [user]);

  if (user) {
    return children;
  }
};
