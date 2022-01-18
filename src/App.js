import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.scss";
import Login from "./components/Login";
import Layout from "./Layout";
import { auth } from "./utils/firebase";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({ isLoggedIn: false });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          isLoggedIn: true,
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        });

        setIsLoading(false);
      } else {
        setUser({ isLoggedIn: false });
        setIsLoading(false);
      }
    });
  }, []);

  return (
    !isLoading && (
      <div className="App">
        {user.isLoggedIn ? <Layout user={user} /> : <Login />}
      </div>
    )
  );
};

export default App;
