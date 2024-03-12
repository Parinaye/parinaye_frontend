import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";
import { Button } from "../components/shadcn/components/ui/button.jsx";
import { Input } from "../components/shadcn/components/ui/input.jsx";
import { Label } from "../components/shadcn/components/ui/label.jsx";
import { Card } from "../components/shadcn/components/ui/card.jsx";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { error, isSubmitting } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log(formData);
    dispatch(signInStart());

    try {
      if (formData.username.length < 1) {
        dispatch(signInFailure("Username is required"));
        return;
      }
      if (formData.password.length < 1) {
        dispatch(signInFailure("Password is required"));
        return;
      }

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/home");
      console.log(data);
    } catch (err) {
      dispatch(signInSuccess(err.message));
      return;
    }
  };

  return (
    <div className="flex justify-center mx-auto items-center opacity-85">
      <Card className="max-w-lg m-4 p-4 flex flex-col gap-6 flex-grow">
        <h1 className="text-3xl text-center font-semibold my-10">Sign In</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="grid w-full items-center m-1 gap-1.5">
            <Label htmlFor="email">Username</Label>
            <Input
              type="text"
              placeholder="Username"
              className="border p-3 rounded-lg  "
              id="username"
              onChange={handleChange}
            />
          </div>
          <div className="grid w-full items-center m-1 gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              className="border p-3 rounded-lg"
              id="password"
              onChange={handleChange}
            />
          </div>
          <Button disabled={isSubmitting} className="m-1 w-full">
            {isSubmitting ? "Logging..." : "Sign In"}
          </Button>
          <div className="flex justify-center">
          <Link to={"/forgot-password"} className="m-1 justify-center">
            <span className="text-md text-blue-500">Forgot Password?</span>
          </Link>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <OAuth className={"m-1"} />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <p>Do not have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-500"> Sign Up </span>
          </Link>
        </p>

        {(error === null || error.length > 1) && (
          <p className="text-red-500">{error}</p>
        )}
      </Card>
    </div>
  );
}
