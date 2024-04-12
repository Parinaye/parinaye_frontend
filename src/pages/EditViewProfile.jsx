import React from "react";
import "react-phone-number-input/style.css";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import moment from "moment";
import { Form } from "../components/shadcn/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../components/shadcn/components/ui/label";
import { Separator } from "../components/shadcn/components/ui/separator";
import { Switch } from "../components/shadcn/components/ui/switch";
import { Card } from "flowbite-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import "swiper/css";

import "swiper/css/bundle";
import CreateEditProfile from "../components/profile/CreateEditProfile";
import { useSelector } from "react-redux";
import { set } from "date-fns";
import CardPlaceHolder from "../components/core/placeholders/card.placeholder";
import { capitalizeWord } from "../utils/helpers";

import {
  ScrollArea,
  ScrollBar,
} from "../components/shadcn/components/ui/scroll-area";

export default function EditViewProfile(props) {
  const id = useParams().id || props.id;
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const [profileUploadError, setProfileUploadError] = useState("");
  const nullString = "N/A";

  const { currentUser } = useSelector((state) => state.user);
  const formSchema = z.object({});

  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          import.meta.env.VITE_MY_BACKEND_URL + `api/profile/get/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + currentUser.token,
            },
          }
        );
        const data = await res.json();
        if (data.success === false) {
          setProfileUploadError(data.message);
          setIsLoading(false);
          return;
        }
        setFormData(data);
        setIsLoading(false);
      } catch (error) {
        setProfileUploadError(error);
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [enableEdit]);

  return (
    <div className="flex justify-center border-3 border-red-600">
      <Card className="flex w-[80vw] bg-background opacity-95 shadow-xl min-h-screen dark:shadow-inner">
        {isLoading ? (
          <div className="flex flex-col justify-center  m-2 w-full rounded-lg shadow-xl">
            <CardPlaceHolder className="flex-grow" />
          </div>
        ) : (
          <Form
            className="flex flex-col  max-w-6xl items-center gap-2"
            {...form}
          >
            {currentUser.role == "admin" &&
              Object.keys(formData).length > 0 && (
                <div className="flex flex-row justify-end items-center my-4 gap-2">
                  <Switch
                    onCheckedChange={() => setEnableEdit(!enableEdit)}
                    checked={enableEdit}
                    className="border-primary"
                  />
                  <Label className="text-lg font-bold"> Edit Profile </Label>
                </div>
              )}

            {enableEdit ? (
              <div className="flex flex-row justify-center m-4 gap-2 border-2">
                <CreateEditProfile
                  profile={formData}
                  enableEdit={enableEdit}
                  setEnableEdit={setEnableEdit}
                />
              </div>
            ) : Object.keys(formData).length > 0 ? (
              <>
                <div className="flex flex-row justify-center w-full">
                  <Swiper
                    style={{
                      "--swiper-navigation-color": "hsl(var(--primary))",
                      "--swiper-pagination-color": "hsl(var(--primary))",
                    }}
                    modules={[
                      Navigation,
                      Pagination,
                      Scrollbar,
                      Autoplay,
                      EffectFade,
                    ]}
                    spaceBetween={20}
                    slidesPerView={1}
                    effect="fade"
                    autoplay={{
                      delay: 9500,
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    className="h-[60vh] rounded-lg shadow-xl"
                  >
                    {formData.profilePictures.map((picture, index) => {
                      return (
                        <SwiperSlide
                          key={`profile_pic_${index}`}
                          className="flex flex-row justify-center items-center w-full h-[60vh] rounded-lg shadow-xl bg-background bg-none"
                        >
                          <img
                            src={picture}
                            className="w-[50vw] h-[55vh] rounded-lg object-scale-down m-2 p-2 hover:scale-125 transition-transform duration-500 ease-in-out"
                            onError={(e) =>
                              (e.target.onerror = null)(
                                (e.target.src =
                                  "/src/assets/images/no_image.png")
                              )
                            }
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
                <form className="flex flex-col p-5 sm:flex-row my-5 rounded justify-between shadow-xl">
                  <div className="flex flex-col sm:w-2/3 sm:border-r-2 p-2 ">
                    <div className="flex flex-col justify-center sm:flex-row sm:justify-between my-2">
                      <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
                        <p className="text-xl font-bold text-primary">
                          {formData.firstName && formData.lastName
                            ? formData.firstName + " " + formData.lastName
                            : nullString}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 my-4">
                      <div className="w-full flex flex-col justify-between items-start gap-2 flex-wrap">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Email"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic text-wrap">
                          {formData.email
                            ? formData.email.toLowerCase()
                            : nullString}
                        </p>
                      </div>
                      <div className="w-full flex flex-col justify-between items-start gap-2">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Phone Number"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.phoneNumber
                            ? formData.phoneNumber.toUpperCase()
                            : nullString}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Father's Name"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.fatherName
                            ? capitalizeWord(formData.fatherName)
                            : nullString}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Mother's Name"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.motherName
                            ? capitalizeWord(formData.motherName)
                            : nullString}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Gender"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.gender
                            ? capitalizeWord(formData.gender)
                            : nullString}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Height"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.height.feet
                            ? formData.height.feet +
                              "ft " +
                              formData.height.inches +
                              " in"
                            : nullString}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Date of Birth"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.dob
                            ? moment(formData.dob).format("DD-MMM-YYYY")
                            : nullString}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Age"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.dob
                            ? "~" +
                              moment().diff(formData.dob, "years") +
                              "y " +
                              (moment().diff(formData.dob, "months") % 12) +
                              "m "
                            : nullString}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Religion"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.religion
                            ? capitalizeWord(formData.religion)
                            : nullString}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Caste"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.caste
                            ? capitalizeWord(formData.caste)
                            : nullString}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Swagotram"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.swagotram
                            ? capitalizeWord(formData.swagotram)
                            : nullString}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Maternal Gotram"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.maternalGotram
                            ? capitalizeWord(formData.maternalGotram)
                            : nullString}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 my-4">
                      <div className="col-span-4 sm:col-span-1 flex flex-row justify-between sm:flex-col sm:items-start">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Profession"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.profession
                            ? capitalizeWord(formData.profession)
                            : nullString}
                        </p>
                      </div>
                      <div className="col-span-4 sm:col-span-1 flex flex-row justify-between sm:flex-col sm:items-start">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Education"}
                        </p>

                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.education
                            ? capitalizeWord(formData.education)
                            : nullString}
                        </p>
                      </div>
                      <div className="col-span-4 sm:col-span-1 flex flex-row justify-between sm:flex-col sm:items-start">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Marital Status"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.maritalStatus
                            ? capitalizeWord(formData.maritalStatus)
                            : nullString}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                      <div className="w-full flex flex-row justify-between items-end sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Income"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {formData.income
                            ? formData.income.toUpperCase()
                            : nullString}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                        <div className="w-full flex flex-row justify-between items-end sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                          <p className="text-2sm sm:text-sm text-muted-foreground">
                            {"Assets"}
                          </p>
                          <p className="text-sm sm:text-lg font-medium leading-none italic">
                            {formData.assets.map((asset, index) => {
                              return (
                                <span key={`asset_${index}`} className="mx-1">
                                  {capitalizeWord(asset) + ","}
                                </span>
                              );
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 my-4 gap-2">
                      <div className="col-span-4 w-full flex justify-between items-start gap-2  flex-col  ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Address"}
                        </p>
                        <div className="col-span-4 w-full flex justify-between items-start gap-2  flex-col  ">
 
                        <p className="text-sm sm:text-lg font-medium leading-none italic">
                          {(formData.address.addressLine1
                            ? formData.address.addressLine1
                            : nullString)  + ", " + (formData.address.addressLine1
                            ? formData.address.addressLine2
                            : nullString) }
                           </p>
                      </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1 w-full flex justify-between items-start gap-2  flex-col  ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"City:"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none italic"> 
                           {  (formData.address.city
                            ? capitalizeWord(formData.address.city)
                            : nullString) }
                            </p>
                       </div>
                       <div className="col-span-4 sm:col-span-1   w-full flex justify-between items-start gap-2  flex-col  ">
                         <p className="text-2sm sm:text-sm text-muted-foreground">
                           {"State:"}
                         </p>
                         <p className="text-sm sm:text-lg font-medium leading-none italic"> 
                            { ( formData.address.state
                            ? capitalizeWord(formData.address.state)
                            : nullString) }
                            </p>
                       </div>
                       <div className="col-span-4 sm:col-span-1 w-full flex justify-between items-start gap-2  flex-col  ">
                         <p className="text-2sm sm:text-sm text-muted-foreground">
                           {"Country:"}
                         </p>
                         <p className="text-sm sm:text-lg font-medium leading-none italic"> 
                            {  (formData.address.country
                            ? capitalizeWord(formData.address.country)
                            : nullString) + ", " + (formData.address.pincode
                            ? formData.address.pincode
                            : nullString)}
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </div>
                  <div className="flex flex-col sm:w-1/3 p-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                      <div className="w-full flex justify-between items-start gap-2  flex-col  ">
                        <p className="text-sm text-muted-foreground">About</p>
                        <p className="text-sm font-medium leading-5 italic">
                          {formData.bio}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                      <div className="w-full flex justify-between items-start gap-2  flex-col  ">
                        <p className="text-sm text-muted-foreground">Seeking</p>
                        <p className="text-sm font-medium italic leading-5">
                          {formData.seekingBio}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div></div>
            )}
            <span className="text-red-400 text-center block">
              {profileUploadError.toString()}
            </span>
          </Form>
        )}
      </Card>
    </div>
  );
}
