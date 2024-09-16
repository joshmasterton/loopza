import { Input } from "../components/Input.components";

export const Auth = () => {
  return (
    <form method="POST">
      <Input id="username" title="Username" placeholder="Username" />
      <Input id="password" title="Password" placeholder="Password" />
    </form>
  );
};
