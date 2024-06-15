import React from "react";

import { Card } from "../shadcn/components/ui/card";
import { ScrollArea, ScrollBar } from "../shadcn/components/ui/scroll-area";
import { Separator } from "../shadcn/components/ui/separator";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "../shadcn/components/ui/dialog";
import EditViewProfile from "./EditViewProfile";

export default function ProfileListCard({ profile }) {
  console.log(profile);
  return (
    <Dialog>
      <DialogTrigger asChild type="text">
        <Card
          className="lg:col-span-2 sm:col-span-3 col-span-1 rounded-lg bg-none p-1 m-1 sm:m-2 sm:p-2 hover:scale-105 hover:shadow-xl hover:shadow-default opacity-100 shadow-inner dark:shadow-slate-600 shadow-slate-400"
          variant="outline"
        >
          <ScrollArea>
            <div
              key={profile._id}
              className="flex flex-row rounded-lg justify-between items-center"
            >
              <img
                src={profile.profilePictures[0]}
                // loading="lazy"
                alt="profile"
                className="w-[100px] h-[150px] sm:w-[150px] sm:h-[150px] rounded-lg object-cover object-top border-primary-foreground bg-[url('/assets/images/default_img.png')] "
              />
              <div className="flex flex-col items-center justify-between p-2 m-2 w-2/3 gap-2">
                <div className="flex flex-row flex-wrap items-center justify-between w-full">
                  <p className="text-lg font-bold dark:text-primary">
                    {profile.firstName + " " + profile.lastName}
                  </p>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-between w-full">
                  <p className="text-sm font-medium leading-none">
                    ( {profile.verificationStatus} )
                  </p>
                </div>
                <Separator />
                <div className="flex flex-row items-center flex-wrap justify-between w-full">
                  <div className="flex flex-row items-center gap-1 ">
                    <p className="text-2sm text-muted-foreground">{"Age"}</p>
                    <p className="text-sm font-medium leading-none">
                      {profile.dob
                        ? moment().diff(profile.dob, "years") +
                          "y " +
                          (moment().diff(profile.dob, "months") % 12) +
                          "m"
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1 ">
                    <p className="text-2sm font-medium leading-none">
                      {profile.address && profile.address.city
                        ? profile.address.city
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
                  <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                    <p className="text-2sm text-muted-foreground">
                      {"Profession"}
                    </p>
                    <p className="text-sm font-medium leading-none">
                      {profile.profession.toUpperCase()}
                    </p>
                  </div>
                  <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                    <p className="text-2sm text-muted-foreground">
                      {"Education"}
                    </p>
                    <p className="text-sm font-medium leading-none">
                      {profile.education.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
                  <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                    <p className="flex text-2sm text-muted-foreground">
                      {"Marital Status"}
                    </p>
                    <p className="flex text-sm font-medium leading-none">
                      {profile.maritalStatus.toUpperCase()}
                    </p>
                  </div>
                  <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                    <p className="text-2sm text-muted-foreground">{"Income"}</p>
                    <p className="text-sm font-medium leading-none">
                      {profile.income.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] min-h-[80vh] my-20">
        <ScrollArea className="max-h-lvh min-w-[90vw]">
          <EditViewProfile id={profile._id} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
