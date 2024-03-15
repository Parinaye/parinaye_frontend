import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { validateToken } from "../redux/user/userSlice";
import { FaSpinner } from "react-icons/fa";
import CardPlaceHolder from "./core/placeholders/card.placeholder";
import { Skeleton } from "./shadcn/components/ui/skeleton";

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
      <section className="flex-grow z-30 m-4 min-h-screen w-full">

      <div className="flex mx-auto flex-col justify-center  w-full">

      <Skeleton className="h-[10vh] w-full rounded-xl m-2 p-2 sm:p-10 sm:m-10 " />
      <Skeleton className="h-[10vh] w-full rounded-xl m-2 p-2 sm:p-10 sm:m-10 " />
      
      </div>
      </section>
    );

  return currentUser && isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  );
}
