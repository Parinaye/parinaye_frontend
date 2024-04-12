"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    <SliderPrimitive.Track
      className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
      {
        props.showSteps && Array.from({ length: (props.max - props.min) / props.step + 1 }, (_, i) => {
      const value = props.min + i * props.step
      const position = ((value - props.min) / (props.max - props.min)) * 100
      return (
        <div
          key={i}
          className="absolute top-full -translate-x-1/2 transform -translate-y-1/2 bg-primary rounded-full w-1 h-4"
          style={{ left: `calc(${position}% - 0.05rem)` }} // Adjusted position
        />
      )
    })}
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
