import { useEffect, useState } from "react";
import CardPlaceHolder from "../components/core/placeholders/card.placeholder.jsx";
import { Button } from "../components/shadcn/components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { Separator } from "../components/shadcn/components/ui/separator.jsx";
import {
  ScrollArea,
  ScrollBar,
} from "../components/shadcn/components/ui/scroll-area.jsx";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/shadcn/components/ui/dialog.jsx";
import CreateProfile from "../components/profile/CreateEditProfile.jsx";
import MyPagination from "../components/core/MyPagination.jsx";
import ProfileListCard from "../components/profile/ProfileListCard.jsx";
import ProfileListFilters from "../components/profile/ProfileListFilters.jsx";
import EditViewProfile from "./EditViewProfile.jsx";
import { Input } from "../components/shadcn/components/ui/input.jsx";
import { Card } from "../components/shadcn/components/ui/card.jsx";
import { FaSadTear } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function ProfilesList() {
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(9);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = profiles.slice(indexOfFirstRecord, indexOfLastRecord);
  const { currentUser } = useSelector((state) => state.user);

  const [filters, setFilters] = useState({
    profession: [],
    assets: [],
    education: [],
    maritalStatus: [],
    verificationStatus:[],
    income: [],
    caste: [],
    religion: [],
    gender:[],
  });
  const navigate = useNavigate();

  const handleFilterApply = async (e) => {
    try {
      let queryString = "";
      Object.keys(filters).forEach((key) => {
        if (filters[key].length > 0) {
          queryString =
            queryString + "&" + `${key}=${JSON.stringify(filters[key])}`;
        }
      });
      const res = await fetch(
        import.meta.env.VITE_MY_BACKEND_URL +
          `api/profile/get_profiles?${queryString}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentUser.token,
          },
        }
      );
      const data = await res.json();
      if (data.success === false && data.statusCode === 403) {
        setError(data.message);
        navigate("/sign-in");
        return;
      } else if (data.success === false) {
        setError(data.message);
      } 
      setProfiles(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (e) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_MY_BACKEND_URL +
          `api/profile/search/?searchParam=${e.target.value}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentUser.token,
          },
        }
      );
      const data = await res.json();
      if (data.success === false && data.statusCode === 403) {
        setError(data.message);
        navigate("/sign-in");
        return;
      } else if (data.success === false) {
        setError(data.message);
      }
      setProfiles(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setProfilesLoading(true);
      try {
        const res = await fetch(
          import.meta.env.VITE_MY_BACKEND_URL + "api/profile/get_profiles",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + currentUser.token,
            },
          }
        );
        const data = await res.json();
        if (data.success === false && data.statusCode === 403) {
          setError(data.message);
          navigate("/sign-in");
          return;
        } else if (data.success === false) {
          setError(data.message);
        }
        setProfiles([
          ...data,
        ]);
        setProfilesLoading(false);
      } catch (err) {
        console.log(err);
        setProfilesLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div className="flex flex-col items-center  justify-center opacity-95  min-w-full">
      <section className="flex-grow z-30 m-4 min-h-[70vh] w-full">
        <div className="rounded-[0.5rem] p-4 border bg-neutral-100/[0.3] dark:bg-zinc-700/[0.3] shadow-md md:shadow-xl">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-end m-2">
              <Input
                type="search"
                placeholder={`Search profiles by name, email, phone number ...`}
                className="rounded-md max-w-sm border-primary mx-2 bg-background dark:bg-zinc-800 dark:text-white"
                onChange={handleSearch}
              />
              {currentUser.role == "admin" && (
                <Dialog className="shadow-lg shadow-secondary">
                  <DialogTrigger asChild>
                    <Button variant="default">Create Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-screen">
                    <DialogHeader>
                      <DialogTitle>Create profile</DialogTitle>
                      <DialogDescription>
                        Create your profile here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="rounded-md max-h-lvh shadow-md dark:shadow-secondary">
                      <CreateProfile />
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              <div className="sm:border-2 sm:border-r-primary p-4">
                <div className="flex flex-col m-1 p-2 col-span-1 w-full bg-background  rounded-lg shadow-xl">
                  <ProfileListFilters
                    filters={filters}
                    setFilters={setFilters}
                    handleFilterApply={handleFilterApply}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:col-span-6 w-full items-center gap-2">
                {currentRecords.length < 1 && !profilesLoading && (
                  <Card className="w-full m-4 p-4">
                    <span className="text-center text-3xl">
                      No profiles found{" "}
                      <FaSadTear className="text-center text-9xl text-primary inline" />{" "}
                      !!
                    </span>
                  </Card>
                )}
                <ScrollArea className="rounded-md h-[70vh] sm:h-[80vh]  w-full overflow-y-scroll ">
                  <div className="grid grid-cols-1 sm:grid-cols-6 m-2 ">
                    {profilesLoading && 
                        [...Array(6).keys()].map((_, i) => (
                          <CardPlaceHolder />
                        ))
                    }
                    {currentRecords.length > 0 &&
                      currentRecords.map((profile) => (
                        <ProfileListCard profile={profile} />
                      ))}
                  </div>
                </ScrollArea>

                {profiles.length > 0 && (
                  <section className="w-full flex felx-row justify-end">
                    <MyPagination
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                      profiles={profiles}
                      recordsPerPage={recordsPerPage}
                    />
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        {error && (
          <p className="text-lg text-destructive">
            Error loading profiles : {error}
          </p>
        )}
      </section>
    </div>
  );
}
