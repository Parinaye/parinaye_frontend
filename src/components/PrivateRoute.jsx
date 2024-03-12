import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { validateToken } from "../redux/user/userSlice";
import { FaSpinner } from "react-icons/fa";
import CardPlaceHolder from "./core/placeholders/card.placeholder";

export default function PrivateRoute() {
  const { currentUser, isSubmitting, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  if (isSubmitting)
    return (
      <div className="flex mx-auto flex-row justify-center m-10 p-10 w-[50vw] h-[50vh]">
        <CardPlaceHolder />
      </div>
    );

  return currentUser && isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  );
}
