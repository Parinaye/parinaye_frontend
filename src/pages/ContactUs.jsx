import React from "react";
import { Card } from "../components/shadcn/components/ui/card";

export default function ContactUs() {
  return (
    <div className="flex flex-col items-center w-full h-[90vh]">
      <Card className="w-full m-40 p-5 sm:w-1/2 ">
        <h1 className="text-4xl font-bold text-center p-4">Contact Us</h1>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-primary">Phone :</span> 
            <p>+91 77993 32277</p>
          </div>

          <div className="flex flex-col items-center gap-1 ">
            <span className="text-primary">Email :</span>
            <a href="mailto:parinaye.matrimony@gmail.com" className=" text-blue-500">
              {" "}
              parinaye.matrimony@gmail.com
            </a>
          </div>
          <div className="flex flex-col items-center gap-1 ">
            <span className="text-primary">Address :</span> 
            <p>Chilakaluripeta, Guntur(Dt)<br/> Andhra Pradesh - 522 616</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
