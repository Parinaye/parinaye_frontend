import React from "react";
import { Card } from "../components/shadcn/components/ui/card";
import { Input } from "../components/shadcn/components/ui/input";
import { Button } from "../components/shadcn/components/ui/button";
import { useState, useEffect } from "react";

import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(30);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (otpRequested) {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [seconds, minutes, otpRequested]);

  const handleSendOtp = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      if (formData.username === undefined) {
        setError("Username is required");
        setIsSubmitting(false);
        return;
      }
      const res = await fetch("/api/auth/sendOtp", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: formData.username }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      setOtpRequested(true);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      if (
        formData.otp === undefined ||
        (formData.otp.length < 1 && formData.otp.length > 6)
      ) {
        setError("OTP is required");
        setIsSubmitting(false);
        return;
      }
      const res = await fetch("/api/auth/verifyOtp", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: formData.otp }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      setOtpVerified(true);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      if (formData.password === undefined) {
        setError("Password is required");
        setIsSubmitting(false);
        return;
      }
      if (formData.confirmPassword === undefined) {
        setError("Confirm password is required");
        setIsSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsSubmitting(false);
        return;
      }
      const res = await fetch("/api/auth/resetPassword", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: formData.password }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      navigate("/sign-in"); // Redirect to sign in page
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="flex flex-col justify-center max-w-xl  m-4 p-4  mx-auto items-center opacity-85 shadow-inner shadow-inherit">
      {!otpRequested ? (
        <Card className="flex flex-col items-center m-4 p-4 border-0 gap-6 flex-grow ">
          <h1 className="text-lg font-bold">Forgot Password ??</h1>
          <p className="text-sm text-muted-foreground">
            Don't worry, we got you covered. Just enter your email and we will
            send you a OTP to reset your password
          </p>
          <Input
            type="username"
            id="username"
            placeholder="Enter your username"
            onChange={handleChange}
          />
          <Button className="bg-primary" onClick={handleSendOtp}>
            {isSubmitting ? <FaSpinner className="mx-2" /> : null}
            Send OTP
          </Button>
        </Card>
      ) : null}
      {otpRequested && !otpVerified ? (
        <Card className="flex flex-col items-center m-4 p-4 border-0 gap-6 flex-grow ">
          <h1 className="text-lg font-bold">Verify OTP</h1>
          <p className="text-md text-muted-foreground">
            Please enter the OTP to reset your password
          </p>
          <Input
            type="number"
            id="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
          />
          <Button onClick={handleVerifyOtp}>
            {isSubmitting ? <FaSpinner className="mx-2" /> : null}
            Verify OTP
          </Button>

          <div className="flex justify-center items-center gap-6 flex-grow">
            <p className="text-md ">
              Last sent OTP expires in {minutes}m : {seconds < 10 ? `0${seconds}` : seconds}s
            </p>
            <Button
              onClick={() => {
                setMinutes(1);
                setSeconds(30);
                handleSendOtp();
              }}
              variant="outline"
              disabled={minutes > 0 || seconds > 0}
              on
            >
              Resend Otp
            </Button>
          </div>
        </Card>
      ) : null}
      {otpVerified ? (
        <Card className="flex flex-col items-center m-4 p-4 border-0 gap-6 flex-grow ">
          <h1 className="text-lg font-bold">Reset Password</h1>
          <Input
            type="password"
            id="password"
            placeholder="Enter new password"
            onChange={handleChange}
          />
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm new password"
            onChange={handleChange}
          />
          <Button className="bg-primary" onClick={handleResetPassword}>
            {isSubmitting ? <FaSpinner className="mx-2" /> : null}
            Reset Password
          </Button>
        </Card>
      ) : null}
      {error && <span className="text-destructive">{error}</span>}
    </Card>
  );
}
