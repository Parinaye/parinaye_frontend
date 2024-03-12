import React from "react";
import { Card } from "../components/shadcn/components/ui/card";

export default function ContactUs() {
  return (
    <div className="flex flex-col items-center w-full h-[90vh]">
      <Card className="m-20 p-5">
        <h1 className="text-4xl font-bold text-center p-4">
          Contact Us
        </h1>
        <div className="flex flex-col items-center gap-6">
          <p>
            <span className="text-primary">Phone :</span> 1234567890
          </p>
          <p>
            <span className="text-primary">Email :</span>
            <a href="mailto:Parinaye@gmail.com" className=" text-blue-500"> Parinaye@gmail.com</a>
          </p>
          <p>
            <span className="text-primary">Address :</span> 123, XYZ Street, ABC
            City, 123456
          </p>
        </div>
      </Card>
    </div>
  );
}
