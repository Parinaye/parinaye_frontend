import React, { useEffect, useState } from "react";
import DataTable from "../shadcn/components/ui/data-table";
import { UserTableColumns } from "./components/UserTableColumns";
import { ScrollArea } from "../shadcn/components/ui/scroll-area";

export default function UsersSettings() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [usertableData, setUsertableData] = useState([]);

  const handleEdit = async (formData) => {
    try {
      const res = await fetch(`/api/user/update_user/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/user/delete_user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
    } catch (err) {
      setError(data.message);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/all_users", {
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
        setUsers(data);
      } catch (err) {
        setError(data.message);
      }
    };
    fetchUsers();
    users.map((user) => {
      setUsertableData([
        ...usertableData,
        {
          username: user.username,
          email: user.email,
          role: user.role,
          id: user._id,
        },
      ]);
    });
  }, []);

  return <DataTable data={users} columns={UserTableColumns} />;
}
