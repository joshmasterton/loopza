import { Navigation } from "./Navigation.component";
import { UserTypes } from "../../types/features/features.types";

export const User = ({ user }: { user: UserTypes }) => {
  return (
    <div className="user">
      <header>
        <Navigation type="link" link={`/profile/${user.id}`}>
          <img src={user?.profile_picture_url} alt="" />
        </Navigation>
        <div>
          <div>{user?.username}</div>
          <p>{user?.created_at}</p>
        </div>
      </header>
      <main></main>
    </div>
  );
};
