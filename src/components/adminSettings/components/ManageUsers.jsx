import React, { useEffect, useState } from "react";
import DataTable from "../../shadcn/components/ui/data-table";
import { UserTableColumns } from "./UserTableColumns";
import { useSelector } from "react-redux";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [usertableData, setUsertableData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_MY_BACKEND_URL + "api/user/all_users",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + currentUser.token,
            },
          }
        );
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

  return <DataTable data={users} columns={UserTableColumns()} />;
}
