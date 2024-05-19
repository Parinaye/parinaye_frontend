import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../../shadcn/components/ui/button";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../shadcn/components/ui/dialog";
import { ScrollArea } from "../../shadcn/components/ui/scroll-area";
import { FaSpinner } from "react-icons/fa";
import { Card } from "../../shadcn/components/ui/card";
import { Skeleton } from "../../shadcn/components/ui/skeleton";

export default function ManageConfigurations() {
  const [configData, setConfigData] = useState({ notices: [] });
  const [configDataLoading, setConfigDataLoading] = useState(false);

  const [error, setError] = useState(null);
  const [noticesDataError, setNoticesDataError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchConfigData = async () => {
      setConfigDataLoading(true);
      try {
        const res = await fetch(
          import.meta.env.VITE_MY_BACKEND_URL + `api/config?env=prod`,
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
        if (data.success === false && data.statusCode === 403) {
          setError(data.message);
          navigate("/sign-in");
          return;
        } else if (data.success === false) {
          setError(data.message);
          return;
        }
        setConfigData(data);
        setConfigDataLoading(false);
      } catch (err) {
        console.log(err);
        setError(data.message);
        setConfigDataLoading(false);
      }
    };
    fetchConfigData();
  }, []);

  const handleNoticesUpdate = async (e) => {
    try {
      setConfigDataLoading(true);
      const res = await fetch(
        import.meta.env.VITE_MY_BACKEND_URL + `api/config/update`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + currentUser.token,
          },
          body: JSON.stringify({
            env: "prod",
            notices: configData.notices,
          }),
        }
      );
      const data = await res.json();
      if (data.success === false && data.statusCode === 403) {
        setError(data.message);
        navigate("/sign-in");
        setConfigDataLoading(false);
        return;
      } else if (data.success === false) {
        setError(data.message);
        setConfigDataLoading(false);
        return;
      }
      setConfigData(data);
      setConfigDataLoading(false);
      // window.location.reload();
    } catch (err) {
      console.log(err);
      setError(data.message);
      setConfigDataLoading(false);
    }
  };

  const handleNoticesConfigChange = (e) => {
    // Parse the decoded JSON string
    let parsedData;
    console.log(e.target.value.replace(/\r?\n/g, ""));
    try {
      parsedData = JSON.parse(e.target.value.replace(/\r?\n/g, ""));
    } catch (error) {
      setNoticesDataError("Error parsing notices data : " + error);
      return;
    }
    console.log(parsedData);
    setNoticesDataError(null);
    setConfigData({ ...configData, notices: parsedData });
  };
  return (
    <div className="rounded w-full">
      <h1 className="text-muted-foreground font-semibold text-md my-2">
        Your configurations can be provided here
      </h1>
      <Card className="shadow-md rounded-lg dark:shadow-slate-100">
        <div className="grid sm:grid-cols-8 grid-col-1 items-center">
          <div className="sm:col-span-2 col-span-1 justify-end m-2">
            <span className="font-bold">Notices</span>
          </div>
          <div className="sm:col-span-5 col-span-1 flex flex-col gap-2 p-2 border">
            {configDataLoading && (
              <>
                <Skeleton className={"h-4 w-full bg-primary-foreground/10"} />
                <Skeleton className={"h-4 w-[80%] dark:bg-primary/10 bg-primary-foreground/10"} />
              </>
            )}
            {!configDataLoading &&
              configData.notices &&
              configData.notices.map((notice, idx) => {
                return (
                  <span className="font-normal border-b-2 text-secondary-foreground whitespace-pre-wrap">
                    {idx + 1}
                    {". "}
                    {notice}
                  </span>
                );
              })}
          </div>
          <div className="col-span-1 flex flex-row sm:justify-center justify-end m-2">
            <Dialog className="shadow-lg shadow-secondary">
              <DialogTrigger asChild>
                <Button variant="default">Edit</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-screen">
                <DialogHeader>
                  <DialogTitle>Update Notices</DialogTitle>
                  <DialogDescription>
                    <p>
                      Update your Notices Config here. Click update when you're
                      done.
                    </p>
                    <span className=" text-orange-600">
                      Note: the format of data should be
                      <code>["message1","message2"]</code>
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="rounded-md max-h-lvh shadow-md dark:shadow-secondary">
                  <form className="flex flex-row ">
                    <textarea
                      className="w-full min-h-[30vh] whitespace-pre-line p-4 bg-inherit"
                      onChange={handleNoticesConfigChange}
                      id="notices"
                      defaultValue={JSON.stringify(configData.notices)}
                    />
                  </form>
                </ScrollArea>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button onClick={handleNoticesUpdate} type="button">
                      {configDataLoading ? (
                        <FaSpinner className="mr-2 animate-spin" />
                      ) : (
                        "Update Notices"
                      )}
                    </Button>
                  </DialogClose>

                  {noticesDataError && (
                    <p className="text-red-600">{noticesDataError}</p>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </div>
  );
}
