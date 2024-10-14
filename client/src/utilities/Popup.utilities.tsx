import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Button } from "../components/Button.component";
import { hidePopup } from "../features/popupSlice";
import { CgClose } from "react-icons/cg";
import { IoNotifications } from "react-icons/io5";
import { useEffect } from "react";

export const Popup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isPopupVisible } = useSelector(
    (state: RootState) => state.popup
  );

  useEffect(() => {
    const interval = 2000;

    const popupInterval = setInterval(() => {
      if (messages.length > 0) {
        // dispatch(hidePopup({ index: messages.length - 1 }));
      }
    }, interval);

    return () => clearInterval(popupInterval);
  }, [messages]);

  if (isPopupVisible) {
    return (
      <div id="popup">
        {messages.map((message, index) => (
          <div key={message + index}>
            <IoNotifications />
            <main>
              <div>{message}</div>
            </main>
            <Button
              id="hidePopup"
              type="button"
              className="transparent"
              onClick={() => {
                dispatch(hidePopup({ index }));
              }}
            >
              <CgClose />
            </Button>
          </div>
        ))}
      </div>
    );
  }
};
