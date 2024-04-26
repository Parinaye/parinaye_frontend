import React from "react";
import { Button } from "../../shadcn/components/ui/button";

import CreateEditProfile from "../../profile/CreateEditProfile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../../shadcn/components/ui/form";
import { Label } from "../../shadcn/components/ui/label";
import { Input } from "../../shadcn/components/ui/input";
import EditUserDetails from "./EditUserDetails";

export const UserTableColumns = () => [
  {
    accessorKey: "username",
    header: () => <div className="text-center">UserName</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("username")}
        </div>
      );
    },
  },
  {
    header: () => <div className="text-center">Email</div>,
    accessorKey: "email",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("email")}</div>
      );
    },
  },
  {
    header: () => <div className="text-center">Role</div>,
    accessorKey: "role",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("role")}</div>
      );
    },
  },
  {
    header: () => <div className="text-center">Actions</div>,
    accessorKey: "actions",
    cell:  ({ row }) => {
      console.log(row)
      return (
         <EditUserDetails userData={row.original} />
      )}
  },
];
