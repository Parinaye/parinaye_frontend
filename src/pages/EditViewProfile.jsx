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
import {
  ASSETS_ENUM,
  EDUCATION_ENUM,
  PROFESSION_ENUM,
  INCOME_ENUM,
  MARITAL_STATUS_ENUM,
  GENDER_ENUM,
} from "../../frontend/config/enums.config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/shadcn/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../components/shadcn/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "../components/shadcn/components/ui/radio-group";
import { Label } from "../components/shadcn/components/ui/label";
import { Slider } from "../components/shadcn/components/ui/slider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/shadcn/components/ui/popover";
import { FaCalendar } from "react-icons/fa";
import { Calendar } from "../components/shadcn/components/ui/calendar";
import { Button } from "../components/shadcn/components/ui/button";
import { cn } from "../components/shadcn/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/shadcn/components/ui/select";
import { Textarea } from "../components/shadcn/components/ui/textarea";
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

export default function EditViewProfile({ props }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [enableEdit, setEnableEdit] = useState(false);
  const [imageFiles, setImageFiles] = useState();
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileUploadError, setProfileUploadError] = useState("");
  const navigate = useNavigate();
  const nullString = "N/A";

  const { currentUser } = useSelector((state) => state.user);
  const formSchema = z.object({});

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/get/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success === false) {
          setProfileUploadError(data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        setProfileUploadError(error);
      }
    };
    fetchProfile();
  }, [enableEdit]);

  const handleImageUpload = (e) => {
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      images.push(e.target.files[i]);
    }
    setImageFiles(images);
  };

  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (imageFiles.length == 0) {
        setProfileUploadError("Please upload atleast one image");
        return;
      } else if (imageFiles.length > 6) {
        setProfileUploadError("You can only upload 6 images at a time.");
        return;
      } else {
        setProfileUploading(true);
        const promises = [];
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];

          promises.push(uploadImage(file));
        }
        Promise.all(promises)
          .then(async (urls) => {
            formData.profilePictures = urls;
            const res = await fetch(`/api/profile/update/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            const data = await res.json();

            setProfileUploading(false);
            if (data.success === false) {
              setProfileUploadError(data.message);
              return;
            }

            navigate(`/profile/${data._id}`);
            return;
          })
          .catch((error) => {
            setProfileUploadError(error.message);
            setProfileUploading(false);
          });
      }
    } catch (error) {
      setProfileUploadError(error);
      setProfileUploading(false);
      return;
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName =
        moment(new Date().getDate()).format("YYYYMMDDHHmmss") + file.name;
      const storageRef = ref(storage, `profile_images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    console.log(e.target);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAssetsChnage = (e) => {
    let assets = formData.assets;
    if (!assets.includes(e.target.value)) {
      assets.push(e.target.value);
    } else {
      assets = assets.filter((asset) => asset != e.target.value);
    }
    setFormData({ ...formData, assets });
  };

  const handleEducationChange = (education) => {
    setFormData({ ...formData, education });
  };

  const handleProfessionChange = (profession) => {
    setFormData({ ...formData, profession });
  };

  const handleIncomeChange = (income) => {
    setFormData({ ...formData, income });
  };

  const handleMaritalStatusChange = (maritalStatus) => {
    setFormData({ ...formData, maritalStatus });
  };

  const handleFeetChange = (value) => {
    setFormData({
      ...formData,
      height: { ...formData.height, feet: value[0] },
    });
  };

  const handleInchesChange = (value) => {
    setFormData({
      ...formData,
      height: { ...formData.height, inches: value[0] },
    });
  };

  const handleDobChange = (dob) => {
    setFormData({ ...formData, dob });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  return (
    <div className="flex justify-center mx-auto items-center">
      <Card className="m-4 w-[90vw] bg-background opacity-95 border-0 shadow-xl dark:shadow-inner">
        <Form
          className="flex flex-col mx-auto p-3 max-w-6xl items-center gap-2"
          {...form}
        >
          {currentUser.role == "admin" && (
            <div className="flex flex-row justify-end items-center m-4 gap-2">
              <Switch
                onCheckedChange={() => setEnableEdit(!enableEdit)}
                className="border-primary m-2"
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
              <div className="flex flex-row justify-center gap-2 w-full">
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
                    delay: 1500,
                  }}
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  className="h-[20vh] sm:h-[50vh] rounded-lg shadow-xl"
                >
                  {formData.profilePictures.map((picture, index) => {
                    return (
                      <SwiperSlide
                        key={`profile_pic_${index}`}
                        className="flex flex-row justify-center items-center w-full h-[20vh] sm:h-[50vh] rounded-lg shadow-xl"
                      >
                        <img
                          src={picture}
                          className="w-[50vw] h-[20vh] sm:h-[50vh] rounded-lg object-cover m-2 p-2"
                          onError={(e) =>
                            (e.target.onerror = null)(
                              (e.target.src = "/src/assets/images/no_image.png")
                            )
                          }
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              <form className="flex flex-col p-5 sm:flex-row m-5 rounded justify-between shadow-xl">
                <div className="flex flex-col sm:w-2/3 border-r-2 p-2 ">
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Email"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.email
                          ? formData.email.toUpperCase()
                          : nullString}
                      </p>
                    </div>
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Phone Number"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
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
                        {"Gender"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.gender
                          ? formData.gender.toUpperCase()
                          : nullString}
                      </p>
                    </div>
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Height"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.height.feet && formData.height.inches
                          ? formData.height.feet +
                            "ft " +
                            formData.height.inches +
                            " in."
                          : nullString}
                      </p>
                    </div>
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Date of Birth"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.dob
                          ? moment(formData.dob).format("YYYY/MM/DD") +
                            " ( Age : " +
                            moment().diff(formData.dob, "years") +
                            "y " +
                            moment().diff(formData.dob, "months") +
                            "m " +
                            moment().diff(formData.dob, "days") +
                            "d" +
                            " )"
                          : nullString}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Religion"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.religion
                          ? formData.religion.toUpperCase()
                          : nullString}
                      </p>
                    </div>
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Caste"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.caste
                          ? formData.caste.toUpperCase()
                          : nullString}
                      </p>
                    </div>
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Marital Status"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.maritalStatus
                          ? formData.maritalStatus.toUpperCase()
                          : nullString}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Profession"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.profession
                          ? formData.profession.toUpperCase()
                          : nullString}
                      </p>
                    </div>
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Education"}
                      </p>

                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.education
                          ? formData.education.toUpperCase()
                          : nullString}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-2sm sm:text-sm text-muted-foreground">
                        {"Income"}
                      </p>
                      <p className="text-sm sm:text-lg font-medium leading-none">
                        {formData.income
                          ? formData.income.toUpperCase()
                          : nullString}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                      <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                        <p className="text-2sm sm:text-sm text-muted-foreground">
                          {"Assets"}
                        </p>
                        <p className="text-sm sm:text-lg font-medium leading-none">
                          {formData.assets.map((asset, index) => {
                            return (
                              <span key={`asset_${index}`} className="mx-1">
                                {asset.toUpperCase() + ","}
                              </span>
                            );
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:w-1/3 p-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full my-4">
                    <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
                      <p className="text-sm text-muted-foreground">About</p>
                      <p className="text-sm font-medium leading-none">
                        {formData.bio}
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
      </Card>
    </div>
  );
}
