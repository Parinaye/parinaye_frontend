import React, { useEffect, useState } from "react";
import { TypewriterEffectSmooth } from "../components/animations/components/ui/typewriter-effect.tsx";
import { Label } from "flowbite-react";
import video from "../assets/videos/wedding_background.mp4";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/shadcn/components/ui/alert.jsx";
import { Terminal } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/shadcn/components/ui/carousel.jsx";
import { useSelector } from "react-redux";
import { ScrollArea } from "../components/shadcn/components/ui/scroll-area.jsx";

export default function Home() {
  const [notices, setNotices] = useState([]);

  const [noticesLoading, setNoticesLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchNotices = async () => {
      setNoticesLoading(true);
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
        }
        setNotices(data.notices);
        setNoticesLoading(false);
      } catch (err) {
        console.log(err);
        setError(data.message);
        setNoticesLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const words = [
    {
      text: "Match",
      className: "text-xl sm:text-2xl xl:text-5xl",
    },
    {
      text: "your",
      className: "text-xl sm:text-2xl xl:text-5xl",
    },
    {
      text: "Soulmate",
      className: "text-xl sm:text-2xl xl:text-5xl",
    },
    {
      text: " @ ",
      className: "text-xl sm:text-2xl xl:text-5xl",
    },
    {
      text: "Parinaye.",
      className: "text-2xl sm:text-3xl xl:text-10xl text-primary",
    },
  ];
  return (
    <div className="mx-auto shadow-lg h-screen">
      <div className="grid">
        <video
          autoPlay
          loop
          muted
          className="w-full h-screen object-cover z-0 col-start-1 row-start-1"
        >
          <source src={video} type="video/mp4" />
        </video>
        <div className="flex flex-col z-10 h-screen items-center sm:py-10 py-5 text-white bg-zinc-900/[0.8] col-start-1 row-start-1">
          <Label className="text-sm mt-10 sm:text-base">
            The road to "US" starts from here
          </Label>
          <TypewriterEffectSmooth words={words} className="flex items-center" />
          {notices && notices.length > 0 && (
            <Carousel className="flex flex-row m-0 p-0">
              <CarouselContent className="sm:w-[600px] w-[300px] ">
                {notices.map((notice) => {
                  return (
                    <CarouselItem className="">
                      <Alert className="flex flex-col  items-center justify-center sm:h-[300px] h-[150px] shadow-slate-400
                     bg-[url('./src/assets/images/notice_bg.png')]  bg-cover bg-center">
                        <AlertDescription className="flex font-ntr font-medium sm:text-3xl text-xl text-primary-foreground min-h-full whitespace-pre-wrap sm:mx-5 mx-2 md:pt-10 md:px-5 md:pb-5  pt-5 px-2 pb-2">
                        <ScrollArea className="sm:mx-5 sm:mb-5 mx-2 mb-2">
                        {notice}
                        </ScrollArea>
                         
                        </AlertDescription>
                      </Alert>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="text-primary-foreground dark:text-inherit" />
              <CarouselNext className="text-primary-foreground dark:text-inherit" />
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
}
