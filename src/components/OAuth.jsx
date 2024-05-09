import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
import { app } from "../firebase.js";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess, signInFailure, signInStart } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
import { Button } from "./shadcn/components/ui/button.jsx";
import { FaGoogle, FaSpinner } from "react-icons/fa";

export default function OAuth({ className }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isSubmitting } = useSelector((state) => state.user);

  const handleGoogleClick = async () => {
    try {

      dispatch(signInStart())
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const googleRes = await signInWithPopup(auth, provider);
      console.log(googleRes);

      const res = await fetch(
        import.meta.env.VITE_MY_BACKEND_URL + "api/auth/signin_google",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",

          },
          body: JSON.stringify({
            username: googleRes.user.displayName,
            email: googleRes.user.email,
            photo: googleRes.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/home");
      return;
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <Button
      variant="secondary"
      type="button"
      disabled={isSubmitting}
      className={"w-full" + className}
      onClick={handleGoogleClick}
    >
      {isSubmitting ? (
        <FaSpinner className="mr-2 animate-spin" />
      ) : (
        <FaGoogle className="mr-2" />
      )}{" "}
      Google
    </Button>
  );
}
