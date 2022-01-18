import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

const Header = ({ user }) => {
  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.log(error);
    });
  };

  return (
    <header className="w-100 border-bottom">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6 d-flex align-items-center">
            <div className="avatar rounded-circle">
              <img
                src={`https://avatars.dicebear.com/api/miniavs/${user.name.toLowerCase()}.svg`}
                alt="avatar"
                className="w-100 h-100 rounded-circle"
              />
            </div>
            <h5 className="m-0">{user.name}</h5>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <button className="btn btn-warning my-3" onClick={handleLogout}>
              Çıkış
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
