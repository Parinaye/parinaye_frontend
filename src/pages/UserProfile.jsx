import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import moment from "moment";

import {
  updateUserAtStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserAtStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutAtStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice.js";
import { Card } from "../components/shadcn/components/ui/card.jsx";
import { Input } from "../components/shadcn/components/ui/input.jsx";
import { Button } from "../components/shadcn/components/ui/button.jsx";
import { FaEdit , FaTimes} from "react-icons/fa";





export default function UserProfile() {
  const fileRef = useRef(null);
  const { currentUser, error, isSubmitting } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [editPic, setEditPic] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName =
      moment(new Date().getDate()).format("YYYYMMDDHHmmss") + file.name;
    const storageRef = ref(storage, `use_profile_avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
        setEditPic(false);
      }
    );
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.placeholder]: e.target.value });
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserAtStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      return;
    } catch (error) {
      dispatch(updateUserFailure(error));
      return;
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    dispatch(deleteUserAtStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(null));
      return;
    } catch (error) {
      dispatch(deleteUserFailure(error));
      return;
    }
  };

  const handleFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    return;
  };

  return (
    <div className="flex flex-row max-w-lg mx-auto justify-center">
      {currentUser && currentUser._id ? (
        <Card className="w-lg m-4 flex-grow">
          <h1 className="text-center text-4xl font-bold m-10">My Account</h1>
          <form className="flex flex-col items-center gap-5 p-4" onSubmit={handleSubmit}>
            <div className="flex flex-row justify-center items-start">
              <img
                src={formData.avatar || currentUser.avatar}
                alt="profile_pic"
                className="rounded-full h-24 w-24 object-cover cursor-pointer self-center m-2"
              />
              <div className="flex flex-col items-start" >
                {editPic ? 
                  (<FaTimes className="text-2xl cursor-pointer" onClick={() => setEditPic(!editPic)}/>):
                (<FaEdit
                  className="text-2xl cursor-pointer"
                  
                  onClick={() => setEditPic(!editPic)}
                />)}
              </div>
            </div>
            <input
              type="file"
              className="p-2"
              hidden={!editPic}
              accept="image/*"
              onChange={handleFile}
            />
            {fileUploadError ? (
              <span className="text-center block text-red-400">
                {"Upload failed, please try again"}
              </span>
            ) : progress > 0 && progress < 100 ? (
              <span className="text-center block text-blue-400">
                {"Upload is " + progress + "% done"}
              </span>
            ) : progress === 100 ? (
              <span className="text-center block text-green-400">
                {"Upload is complete"}
              </span>
            ) : null}
            <Input
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              className="p-2"
              id="username"
              disabled
            />
            <Input
              type="email"
              placeholder="email"
              defaultValue={currentUser.email}
              className="p-2"
              id="email"
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder={"change password"}
              className="p-2"
              id="password"
              onChange={handleChange}
            />
            <Button disabled={isSubmitting} className="m-4 w-full">
              {isSubmitting ? "Updating" : "Update"}
            </Button>
          </form>
          {/* <div className="flex justify-center mt-5">
            <span
              className="text-center block text-blue-400 cursor-pointer hover:underline"
              onClick={handleDeleteUser}
            >
              Delete Account
            </span>
          </div> */}
          {error && (
            <span className="text-red-500 text-center block">
              Error: {error}
            </span>
          )}
          {updateSuccess && (
            <span className="text-green-500 text-center block">
              Profile updated successfully
            </span>
          )}
        </Card>
      ) : null}
    </div>
  );
}
