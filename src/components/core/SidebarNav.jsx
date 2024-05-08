import React from "react";
import { Link } from "react-router-dom";

import { cn } from "../shadcn/lib/utils";
import { buttonVariants, Button } from "../shadcn/components/ui/button";


export default function SidebarNav({ className, items,activeTab, setActiveTab }) {
const pathname = window.location.pathname;
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-auto p-2",
        className
      )}
    >
      {Object.keys(items).map((itemKey) => {
        return (
          <Button
            key={itemKey}
            variant="ghost"
            onClick={() => setActiveTab(itemKey)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              activeTab === itemKey
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start",
              activeTab === itemKey? "shadow-md dark:shadow-primary" :""
            )}

          >
            {items[itemKey].title}
          </Button>
        );
      })}
    </nav>
  );
}
