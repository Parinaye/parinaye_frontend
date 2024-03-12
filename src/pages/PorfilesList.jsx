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

export default function PorfilesList() {
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(6);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = profiles.slice(indexOfFirstRecord, indexOfLastRecord);
  const {currentUser} =useSelector((state) => state.user);

  const [filters, setFilters] = useState({
    profession: [],
    assets: [],
    education: [],
    maritalStatus: [],
    income: [],
    caste:[],
    religion:[],
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

      console.log(queryString);
      const res = await fetch(`/api/profile/get_profiles?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
      const res = await fetch(`/api/profile/search/?searchParam=${e.target.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      setProfilesLoading(true);
      try {
        const res = await fetch("/api/profile/get_profiles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success === false && data.statusCode === 403) {
          setError(data.message);
          navigate("/sign-in");
          return;
        } else if (data.success === false) {
          setError(data.message);
        }

        console.log(data);
        setProfiles([
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
          ...data,
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
    <div className="flex items-center  justify-center opacity-95  min-w-full">
      <section className="flex-grow z-30 m-4 min-h-screen">
        <div className="rounded-[0.5rem] p-4 border bg-neutral-100/[0.3] dark:bg-zinc-700/[0.3] shadow-md min-w-full md:shadow-xl">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-end m-2">
              <Input
                type="search"
                placeholder={`Search profiles by name, email, phone number ...`}
                className="rounded-md max-w-sm border-primary mx-2 bg-background dark:bg-zinc-800 dark:text-white"
                onChange={handleSearch}
                
              />
              {currentUser.role == "admin" && (
              <Dialog>
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

                  <ScrollArea className="rounded-md border max-h-lvh overflow-scroll">
                    <CreateProfile />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              )}
            </div>
            <Separator />

            <div className="grid grid-cols-1  md:grid-cols-4 gap-2">
              <section className="sm:border-2 sm:border-r-primary p-4">
                <div className="flex flex-col m-1 p-2 col-span-1 w-full bg-background  rounded-lg shadow-xl">
                  <ProfileListFilters
                    filters={filters}
                    setFilters={setFilters}
                    handleFilterApply={handleFilterApply}
                  />
                </div>
              </section>
              <section className="flex flex-col sm:col-span-2 md:col-span-3 w-full items-center gap-2">
                <ScrollArea className="rounded-md max-h-[70vh] sm:max-h-[70vh]  w-full overflow-scroll">
                  <div className="grid grid-cols-1 xl:grid-cols-2 m-2 ">
                    {profilesLoading && (
                      <div className="flex flex-col fle-grow m-2 sm:max-w-2xl  rounded-lg shadow-xl">
                        {[...Array(6).keys()].map((_, i) => (
                          <CardPlaceHolder />
                        ))}
                      </div>
                    )}
                    {currentRecords.length > 0 && currentRecords.map((profile) => (
                      <ProfileListCard profile={profile} />
                    ))}
                    
                  </div>
                </ScrollArea>
                {currentRecords.length < 1 && !profilesLoading && (
                      <Card className="w-full m-4 p-4">
                        <span className="text-center text-3xl">
                          No profiles found <FaSadTear className="text-center text-9xl text-primary inline" /> !!
                        </span>

                      </Card>
                    )}
                { profiles.length > 0 &&
                   <section className="w-full flex felx-row justify-end">
                   <MyPagination
                     setCurrentPage={setCurrentPage}
                     currentPage={currentPage}
                     profiles={profiles}
                     recordsPerPage={recordsPerPage}
                   />
                 </section>
                }
               
              </section>
            </div>
          </div>
        </div>
      </section>
      <section>{error && <p>Error loading profiles : {error}</p>}</section>
    </div>
  );
}
