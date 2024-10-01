import { Nav } from "../components/Nav.component";
import { Side } from "../components/Side.component";

export const Home = () => {
  return (
    <div id="home">
      <Side type="left" />
      <Nav />
      <main />
      <Side type="right" />
    </div>
  );
};
