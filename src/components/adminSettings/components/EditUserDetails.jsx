import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/components/ui/dialog";
import { Button } from "../../shadcn/components/ui/button";
import { Label } from "../../shadcn/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shadcn/components/ui/form";
import { updateUserSuccess } from "../../../redux/user/userSlice";

const FormSchema = z.object({});

export default function vEditUserDetails(props) {
  const form = useForm({ resolver: zodResolver(FormSchema) });
  const [editFormData, setEditFormData] = useState(props.userData);
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState("");
  
  const dispatch = useDispatch();

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        import.meta.env.VITE_MY_BACKEND_URL +
          `api/user/update/${editFormData._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + currentUser.token,
          },
          body: JSON.stringify({ role: editFormData.role }),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      if(data._id === currentUser._id){
        dispatch(updateUserSuccess(data))
      }
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_MY_BACKEND_URL +
          `api/user/delete/${editFormData._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + currentUser.token,
          },
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      window.location.reload();
    } catch (err) {
      setError(data.message);
    }
  };

  const handleEditRole = (value) => {
    setEditFormData({
      ...editFormData,
      role: value,
    });
  };

  return (
    <div className="flex flex-row gap-2 justify-center">
      <Dialog className="shadow-lg shadow-secondary">
        <DialogTrigger asChild>
          <Button variant="default" disabled={currentUser._id === editFormData._id }>Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-screen">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit the user profile here. Click update when you're done.
            </DialogDescription>
            <div>
              <div className="grid grid-cols-1 gap-2 mx-2">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <Select
                          onValueChange={handleEditRole}
                          defaultValue={editFormData.role}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {["admin", "user"].map((role) => {
                                return (
                                  <SelectItem value={role}>{role}</SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" onClick={handleUpdateUser}>
                    Update
                  </Button>
                </Form>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog className="shadow-lg shadow-secondary">
        <DialogTrigger asChild>
          <Button variant="destructive" disabled={currentUser._id === editFormData._id }>Delete</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-screen">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mx-2">
              <h1 className="col-span-1 sm:col-span-3">Are you sure want to Delete?</h1>
              <Button variant="destructive" onClick={handleDelete} className="col-span-1">
                Delete
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
