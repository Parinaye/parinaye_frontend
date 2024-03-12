import React from "react";
import { useState, useRef } from "react";
import { Button } from "../components/shadcn/components/ui/button";
import { ScrollArea, ScrollBar } from "../components/shadcn/components/ui/scroll-area";
import { Card } from "../components/shadcn/components/ui/card";

export default function Stepper({
  stepsConfig,
  handleFinish,
  finishButtonText = "Finish",
  error,
}) {
  const [activeStep, setActiveStep] = useState(0);

  const stepRef = useRef([]);

  if (stepsConfig.length === 0) {
    return <div></div>;
  }


  const ActiveComponent = stepsConfig[activeStep].component;

  return (
    <Card className="w-full border-0 p-4 shadow-inner">
      <div className="grid p-4 m-4 ">
        <div className="z-20 col-start-1 row-start-1 flex flex-row justify-between items-center">
          {stepsConfig.map((step, index) => {
            return (
              <div
                key={index}
                ref={(el) => (stepRef.current[index] = el)}
                className="flex flex-col items-center"
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    activeStep >= index
                      ? "bg-primary dark:text-primary-foreground"
                      : "bg-secondary dark:text-primary"
                  }`}
                >
                  {index + 1}
                </div>
                {/* <div className="text-sm">{step.title}</div> */}
              </div>
            );
          })}
        </div>
      </div>
    <div>
        
      <h1 className="text-md font-semibold text-center m-4">
        {stepsConfig[activeStep].title}
      </h1>
      <ScrollArea className="rounded-md h-[50vh] w-full overflow-scroll">
      {stepsConfig[activeStep].component()}
      <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>

      <div className="flex flex-row items-center justify-between gap-2 w-full">
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Previous
        </Button>

        <Button
          onClick={(e) => {
            if (activeStep < stepsConfig.length - 1) {
              setActiveStep(activeStep + 1);
            }else{
                handleFinish(e)
            }
          }}
        >
          {activeStep >= stepsConfig.length - 1 ? finishButtonText : "Next"}
        </Button>
      </div>
      {error && <span className="text-destructive">{error}</span>}
    </Card>
  );
}
