import React from "react";
import { Card } from "../components/shadcn/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/shadcn/components/ui/tabs";
import { Separator } from "../components/shadcn/components/ui/separator";
import SidebarNav from "../components/core/SidebarNav";
import UsersSettings from "../components/adminSettings/UsersSettings";

export default function AdminDashBoard() {
  const [activeTab, setActiveTab] = React.useState("manageUsers");
  const sidebarNavItems = {
    manageUsers: {
      title: "Manage Users",
      component: (
        <div className="border-2 rounded w-full">
          <UsersSettings />
        </div>
      ),
    },
    manageConfigurations: {
      title: "Manage Configurations",
      component: (
        <div className="border-2 rounded w-full">
          <h1>Manage Configurations</h1>
        </div>
      ),
    },
  };
  return (
    <div className=" space-y-6 p-10 pb-16 md:block">
      <section className="flex-grow m-4 min-h-[90vh] w-full">
        <Card className="p-4 min-h-[70vh]">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              Admin Settings
            </h2>
            <p className="text-muted-foreground">
              Manage your Users and Configurations.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <div className="mx-4 lg:w-1/5">
              <SidebarNav
                items={sidebarNavItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            {sidebarNavItems[activeTab].component}
          </div>
        </Card>
      </section>
    </div>
  );
}
