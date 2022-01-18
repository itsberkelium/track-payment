import Header from "./components/Header";
import List from "./components/List";

const Layout = ({ user }) => {
  return (
    <>
      <Header user={user} />
      <List />
    </>
  );
};

export default Layout;
