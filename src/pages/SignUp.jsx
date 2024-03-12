// Desc: Sign up page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth.jsx";
import { Button } from "../components/shadcn/components/ui/button.jsx";
import { Input } from "../components/shadcn/components/ui/input.jsx";
import { Label } from "../components/shadcn/components/ui/label.jsx";
import { Card } from "../components/shadcn/components/ui/card.jsx";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing the page
    console.log(formData);
    setIsSubmitting(true);
    setError("");

    try {
      if (formData.username === undefined) {
        setError("Username is required");
        setIsSubmitting(false);
        return;
      }
      if (formData.email === undefined) {
        setError("Email is required");
        setIsSubmitting(false);
        return;
      }
      if (formData.password === undefined) {
        setError("Password is required");
        setIsSubmitting(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsSubmitting(false);
        return;
      }

      if (formData.username.length < 3) {
        setError("Username must be at least 3 characters");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setIsSubmitting(false);
        return;
      }
      setError("");
      setIsSubmitting(false);
      navigate("/sign-in");
      console.log(data);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <div className="flex justify-center mx-auto items-center opacity-85">
      <Card className="max-w-lg m-4 p-4 flex flex-col gap-6 flex-grow">
        <h1 className="text-3xl text-center font-semibold my-10">SignUp</h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="grid w-full items-center m-1 gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              placeholder="Username"
              className="border p-3 rounded-lg"
              id="username"
              onChange={handleChange}
            />
          </div>
          <div className="grid w-full items-center m-1 gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg"
              id="email"
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
          <div className="grid w-full items-center m-1 gap-1.5">
            <Button disabled={isSubmitting} className="m-1 ">
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or Sign Up with
            </span>
          </div>
        </div>
        <OAuth className={"m-1"} />
        <div className="px-8 text-center text-sm text-muted-foreground">
          <p>Have an account?</p>
          <Link to={"/sign-in"}>
            <span className="text-blue-500"> Sign in </span>
          </Link>
        </div>
        {error.length > 1 && <p className="text-red-500">{error}</p>}
      </Card>
    </div>
  );
}
