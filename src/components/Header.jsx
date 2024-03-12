import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "./shadcn/components/ui/card";
import { Badge } from "./shadcn/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./shadcn/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "./shadcn/components/ui/dropdown-menu";

import {
  signOutAtStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice.js";
import { ModeToggle } from "./shadcn/mode-toggle";

export default function Header() {
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    // sign out logic
    dispatch(signOutAtStart());
    try {
      const res = await fetch(`/api/auth/signout/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(null));
      navigate("/sign-in");
      return;
    } catch (error) {
      dispatch(signOutFailure(error));
      return;
    }
  };

  return (
    <Card className="shadow-md opacity-85 rounded-none">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Badge
          variant="default"
          className={"bg-gradient-to-r z-10 from-primary"}
        >
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <p>Parinaye</p>
            </h1>
          </Link>
        </Badge>
        <ul className="flex items-center gap-4 z-10 opacity-85">
          {currentUser && currentUser.username && isAuthenticated ? (
            <>
              <Link to="/">
                <li className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Home
                </li>
              </Link>
              <Link to="/viewProfiles">
                <li className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Profiles
                </li>
              </Link>
              {/* <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="rounded-full h-7 w-7 object-cover"
                ></img> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {String(currentUser.username[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to="/profile">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {currentUser.role == "admin" && (
                    <>
                      <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Link to="/adminDashBoard">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/sign-up">
              <li className="transition-colors hover:text-primary">
                <p className="text-sm font-medium ">Sign Up</p>
              </li>
            </Link>
          )}
          <ModeToggle />
        </ul>
      </div>
    </Card>
  );
}
