import { MdErrorOutline } from "react-icons/md";
import { Navigation } from "../components/Navigation.component";

export const Error = () => {
  return (
    <div id="errorPage">
      <MdErrorOutline />
      <h1>Oops!</h1>
      <h4>Something went wrong</h4>
      <Navigation link="/" type="button">
        Back to home
      </Navigation>
    </div>
  );
};
