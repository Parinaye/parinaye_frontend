import React from "react";
import { Button } from "../../shadcn/components/ui/button";

export const UserTableColumns = [
  {
    accessorKey: "username",
    header: () => <div className="text-center">UserName</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("username")}</div>
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
    cell: ({ row }) => {
      return (
        <div className="flex justify-center gap-2">
          <Button variant="outline">Edit</Button>
          <Button variant={"destructive"}>Delete</Button>
        </div>
      );
    },
  }
];
