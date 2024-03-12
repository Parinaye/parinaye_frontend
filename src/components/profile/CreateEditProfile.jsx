import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app } from "../../firebase";
import moment from "moment";
import {
  ASSETS_ENUM,
  EDUCATION_ENUM,
  PROFESSION_ENUM,
  INCOME_ENUM,
  MARITAL_STATUS_ENUM,
  GENDER_ENUM,
  RELIGION_ENUM,
  CASTE_ENUM,
} from "../../../config/enums.config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../shadcn/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "../shadcn/components/ui/radio-group";
import { Label } from "../shadcn/components/ui/label";
import { Slider } from "../shadcn/components/ui/slider";
import { FaTrash } from "react-icons/fa";
import { Button } from "../shadcn/components/ui/button";
import { cn } from "../shadcn/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../shadcn/components/ui/select";
import { Textarea } from "../shadcn/components/ui/textarea";
import Stepper from "../../pages/Stepper";
import { isValidImageURL } from "../../utils/helpers.jsx";
import { Calendar } from "../shadcn/components/ui/calendar";

const formSchema = z.object({
  firstName: z.string().min(1),
});

export default function CreateEditProfile({
  profile = {
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    dob: "",
    religion: "",
    caste: "",
    bio: "",
    profilePictures: [],
    profession: "",
    assets: [],
    maritalStatus: "",
    education: "",
    income: "",
    height: {
      feet: "",
      inches: "",
    },
  },
  enableEdit,
  setEnableEdit,
}) {
  const [formData, setFormData] = useState(profile);
  const [imageFiles, setImageFiles] = useState([]);
  const [deletedImageFiles, setDeletedImageFiles] = useState([]);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileUploadError, setProfileUploadError] = useState("");
  const navigate = useNavigate();

  console.log(formData);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: profile,
  });

  const handleImageUpload = (e) => {
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      images.push(e.target.files[i]);
    }
    setImageFiles(images);
  };

  const handleDeleteImage = async (e) => {
    const imageTobeDeleted = e.target.value;
    try {
      setProfileUploadError("");
      if (formData.profilePictures.includes(imageTobeDeleted)) {
        if (await isValidImageURL(imageTobeDeleted)) {
          setDeletedImageFiles([...deletedImageFiles, imageTobeDeleted]);
        }
        const newImages = formData.profilePictures.filter(
          (image) => image != imageTobeDeleted
        );
        setFormData({ ...formData, profilePictures: newImages });
        return;
      }
      setProfileUploadError(
        "Unable find the image to delete : " + imageTobeDeleted
      );
    } catch (error) {
      setProfileUploadError("Unable to delete image. : " + error.message);
    }
  };

  const handleUploadImages = async () => {
    try {
      if (imageFiles.length == 0 && formData.profilePictures.length == 0) {
        setProfileUploadError("Please upload atleast one image");
        return;
      } else if (imageFiles.length + formData.profilePictures.length > 6) {
        setProfileUploadError("You can only have 6 images per profile.");
        return;
      } else {
        setImagesUploading(true);
        const promises = [];
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];

          promises.push(uploadImage(file));
        }
        Promise.all(promises)
          .then(async (urls) => {
            urls = formData.profilePictures.concat(urls);
            setFormData({ ...formData, profilePictures: urls });

            setImagesUploading(false);
            setProfileUploadError("");
            setImageFiles([]);
            document.getElementById("image_upload").value = "";
          })
          .catch((error) => {
            setProfileUploadError(error.message);
            setImagesUploading(false);
          });
      }
    } catch (error) {
      setProfileUploadError(error);
      setImagesUploading(false);
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = null;
    try {
      if (enableEdit) {
        for (let i = 0; i < deletedImageFiles.length; i++) {
          const promises = [];
          promises.push(deleteUploadedImage(deletedImageFiles[i]));
          Promise.all(promises)
            .then((urls) => {
              console.log("Image has been deleted from storage");
            })
            .catch((error) => {
              setProfileUploadError(error.message);
            });
        }

        res = await fetch(`/api/profile/update/${profile._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        setEnableEdit(false);
      } else {
        res = await fetch(`/api/profile/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }
      const data = await res.json();

      setProfileUploading(false);
      if (data.success === false) {
        setProfileUploadError(data.message);
        return;
      }
      setProfileUploadError("");
      navigate(`/profile/${data._id}`);
      return;
    } catch (error) {
      setProfileUploadError(error);
      setProfileUploading(false);
      return;
    }
  };

  const deleteUploadedImage = (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const storageRef = ref(storage, `${image}`);
      deleteObject(storageRef)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
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
    if (e.target.id === "dob") {
      const dob = moment(e.target.value).format("YYYY-MM-DD");
      setFormData({ ...formData, dob });
      
    }else{
    setFormData({ ...formData, [e.target.id]: e.target.value });
    }
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

  const handleReligionChange = (religion) => {
    setFormData({ ...formData, religion });
  };

  const handleCasteChange = (caste) => {
    setFormData({ ...formData, caste });
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

  // test data with title and description
  const stepsConfig = [
    {
      title: "Basic Information",
      component: () => (
        <>
          <div className="flex flex-col justify-center sm:flex-row sm:justify-between my-2">
            <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
              <FormField
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={formData.firstName}
                        id="firstName"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
              <FormField
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={formData.lastName}
                        id="lastName"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center sm:flex-row sm:justify-betwen my-2">
            <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        onChange={handleChange}
                        defaultValue={formData.email}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
              <FormField
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={formData.phoneNumber}
                        id="phoneNumber"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Personal and Caste Information",
      component: () => (
        <>
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between m-2">
            <RadioGroup
              defaultValue={formData.gender === "male"}
              className="flex flex-row m-2 gap-2 justify-start w-1/3"
            >
              {GENDER_ENUM.map((gender) => {
                return (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={gender}
                      id={"gender"}
                      checked={formData.gender === gender}
                      onClick={handleChange}
                    />
                    <Label htmlFor={gender}>{gender}</Label>
                  </div>
                );
              })}
            </RadioGroup>

            <div className="flex flex-row justify-end w-full sm:w-2/3 m-2">
              <div className="flex flex-col gap-2 flex-grow">
                <FormField
                  name="heightFeet"
                  className="w-full"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (Ft)</FormLabel>
                      <FormControl>
                        <Slider
                          id="heightFeet"
                          onValueChange={handleFeetChange}
                          defaultValue={[formData.height.feet]}
                          max={7}
                          step={1}
                          min={4}
                          className="mt-1 w-full rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-center text-sm">
                  {formData.height.feet} feet
                </span>
              </div>
              <div className="flex mx-2 flex-col gap-2 flex-grow">
                <FormField
                  name="heightInches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (In)</FormLabel>
                      <FormControl>
                        <Slider
                          id="heightInches"
                          onValueChange={handleInchesChange}
                          defaultValue={[formData.height.inches]}
                          max={12}
                          step={1}
                          min={1}
                          className="mt-1 w-full rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-center text-sm">
                  {formData.height.inches} inches
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-col-1 sm:grid-cols-3 m-2 gap-4">
            <div className="grid grid-cols-1 gap-2 ">
              <FormField
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        id="dob"
                        defaultValue={ moment(new Date(formData.dob)).format("YYYY-MM-DD")}
                        onChange={handleChange}
                        className="w-full bg-secondary rounded-md p-1"
                      />
                  

                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 ">
              <FormField
                name="education"
                id="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={handleReligionChange}
                        defaultValue={formData.religion}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Religion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {RELIGION_ENUM.map((religion) => {
                              return (
                                <SelectItem value={religion}>
                                  {religion}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 ">
              <FormField
                onChange={handleChange}
                name="education"
                id="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caste</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={handleCasteChange}
                        defaultValue={formData.caste}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Caste" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(CASTE_ENUM).map((caste) => {
                            return (
                              <SelectGroup>
                                <SelectLabel value={caste}>
                                  {" --- "}
                                  {caste.toUpperCase()}
                                  {" --- "}
                                </SelectLabel>
                                {CASTE_ENUM[caste].map((subCaste) => {
                                  return (
                                    <SelectItem value={caste + ":" + subCaste}>
                                      {subCaste}
                                    </SelectItem>
                                  );
                                })}
                              </SelectGroup>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Professional and Wealth Information",
      component: () => (
        <>
          <div className="grid grid-col-1 sm:grid-cols-2 m-5 gap-4">
            <div className="grid grid-cols-1 gap-2 ">
              <Label htmlFor="area">Education</Label>
              <Select
                onValueChange={handleEducationChange}
                defaultValue={formData.education}
                className={cn("w-[200px] appearance-none font-normal")}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select Education"
                    className="overflow-hidden"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {EDUCATION_ENUM.map((education) => {
                      return (
                        <SelectItem value={education}>{education}</SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2 ">
              <Label htmlFor="area">Profession</Label>
              <Select
                onValueChange={handleProfessionChange}
                defaultValue={formData.profession}
                className={cn("w-[200px] appearance-none font-normal")}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select profession"
                    className="overflow-hidden"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PROFESSION_ENUM.map((profession) => {
                      return (
                        <SelectItem value={profession}>{profession}</SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-col-1 sm:grid-cols-2 m-5 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label>Income</Label>
              <Select
                onValueChange={handleIncomeChange}
                defaultValue={formData.income}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select income range"
                    className="overflow-hidden"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INCOME_ENUM.map((income) => {
                      return <SelectItem value={income}>{income}</SelectItem>;
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label>Marital Status</Label>
              <Select
                onValueChange={handleMaritalStatusChange}
                defaultValue={formData.maritalStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maritalStatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {MARITAL_STATUS_ENUM.map((maritalStatus) => {
                      return (
                        <SelectItem value={maritalStatus}>
                          {maritalStatus}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid col-span-1 sm:col-span-3 m-5 gap-4">
            <div className="grid grid-cols-1 gap-2  ">
              <Label class="text-sm font-medium">Assets</Label>
              <div className="border-2 rounded">
                <div className="flex flex-row flex-wrap justify-start m-1">
                  {ASSETS_ENUM.map((asset) => {
                    return (
                      <div class="flex items-center mx-4">
                        <Input
                          id={asset}
                          type="checkbox"
                          class="w-4 h-4 rounded border-2 border-primary my-2"
                          onClick={handleAssetsChnage}
                          value={asset}
                          checked={formData.assets.includes(asset)}
                        />
                        <Label class="mx-2 text-sm">{asset}</Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Bio and Profile Pictures",
      component: () => (
        <>
          <div className="flex flex-col justify-start p-2">
            <div className="flex flex-col flex-grow">
              <FormField
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more..."
                        id="bio"
                        onChange={handleChange}
                        className="resize-y"
                        defaultValue={formData.bio}
                      />
                    </FormControl>
                    <FormDescription>{}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col grow">
              <Label className="my-4">
                <b>Add Images : </b>
                <i className="text-sm text-muted-foreground">
                  first one will be profile pic ..
                </i>{" "}
              </Label>
              <div className="flex flex-row justify-between items-center">
                <Input
                  type="file"
                  id="image_upload"
                  className="mx-2 p-2 mr:4 border-2 rounded-md w-full"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <Button onClick={handleUploadImages}>
                  {imagesUploading ? "Uploading" : "Upload Images"}
                </Button>
              </div>
              <div className="flex flex-row flex-wrap">
                {formData.profilePictures.map((image, index) => {
                  return (
                    <div
                      className="flex flex-col m-4 h-[10vh] sm:h-[15vh] w-[30vw] sm:w-[15vw]"
                      key={`profile_pic_${index}`}
                    >
                      <img
                        src={image}
                        alt={`profile_pic_${index}`}
                        className="rounded-md h-full w-full border-2 object-cover cursor-pointer self-center mx-2"
                      />
                      <Button
                        value={image}
                        onClick={(e) => handleDeleteImage(e, "value")}
                        className="my-1"
                        variant={"ghost"}
                      >
                        Delete
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <Form className="mx-auto p-3 items-center" {...form}>
      <Stepper
        stepsConfig={stepsConfig}
        handleFinish={handleSubmit}
        finishButtonText={
          profileUploading
            ? "Uploading"
            : enableEdit
            ? "Update profile"
            : "Create Profile"
        }
        error={profileUploadError}
      />
    </Form>
  );
}
