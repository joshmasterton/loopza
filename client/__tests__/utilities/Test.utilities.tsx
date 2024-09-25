import { Provider } from "react-redux";
import { store } from "../../src/store";
import { App } from "../../src/App";

export const Test = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
