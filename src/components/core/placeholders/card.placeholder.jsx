import React from "react";
import { Skeleton } from "../../shadcn/components/ui/skeleton";

export default function CardPlaceHolder() {
  return (
    <div
    className=" lg:col-span-2 sm:col-span-3 col-span-1 flex felx-row p-4 m-4 border border-gray-200 rounded shadow-lg animate-pulse dark:border-gray-400"
    >
      <div className="flex items-center justify-center bg-gray-300 rounded dark:bg-gray-400 w-1/4">
        <Skeleton className="h-24 w-24 rounded-xl"/>
      </div>
      <div className="flex flex-col justify-start flex-grow gap-2 m-4">
        {/* <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-400 w-48 mb-4"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-400 mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-400 mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div> */}

        <Skeleton className="h-4 w-1/2 rounded-xl" />
        <Skeleton className="h-4 w-1/3 rounded-xl" />
        <Skeleton className="h-4 w-1/3 rounded-xl" />
        <Skeleton className="h-4 w-1/4 rounded-xl" />
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
