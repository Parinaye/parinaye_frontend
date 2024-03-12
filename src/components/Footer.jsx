import React from "react";

export default function MyFooter() {
  return (
    <div className="mx-auto w-full">
      <footer className="flex justify-between items-center text-white m-4 ">
        <div className="flex flex-col items-start">
        <p className="flex items-center">&copy; 2024 <span className="text-xl font-bold px-2">Parinaye</span></p>
        <p className="flex items-center text-2sm">
          built with <span className="text-red-500 px-2">♥</span> by{" "}Nirvaan Solutions
        </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <ul
            className="flex items-center gap-4"
          >
            <li>
              <a href="/contactUs" className="text-white">
                Contact Us
              </a>
            </li>
          </ul>
          </div>
      </footer>
    </div>
  );
}
