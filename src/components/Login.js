import { useRef, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import toastr from "toastr";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [isSending, setIsSending] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setIsSending(true);

    let { value: email } = emailRef.current;
    const { value: pass } = passwordRef.current;

    if (!email.includes("@")) {
      email += "@track-payment.io";
    }

    signInWithEmailAndPassword(auth, email, pass).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Error Code:`, errorCode, `Error Message:`, errorMessage);
      setIsSending(false);

      toastr.error(error.message);
    });
  };

  return (
    <div className="Login vh-100">
      <div className="container h-100">
        <div className="row h-100 align-items-center">
          <div className="col-12 col-md-6 col-xl-4 offset-md-3 offset-xl-4">
            <form action="#!" onSubmit={handleLogin} className="box">
              <div className="row">
                <div className="col-12">
                  <h3 className="text-center border-bottom text-uppercase pb-2 mb-3">
                    Giriş Yap
                  </h3>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="E-posta:"
                    ref={emailRef}
                    inputMode="email"
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Şifre:"
                    ref={passwordRef}
                    inputMode="password"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <button
                    className="btn btn-secondary w-100"
                    disabled={isSending}
                  >
                    {isSending ? `Giriş yapılıyor...` : `Giriş Yap`}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
