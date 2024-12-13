import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import Sidebar from "./components/Sidebar";
import "./styles/index.css";
import { useState } from "react";
import animationData from "../assets/dataMusic.json";
import { useLottie } from "lottie-react";


export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export default function App() {

  const [isAnimationComplete, setIsAnimationComplete] = useState(true);

  const options = {
    animationData: animationData,
    loop: false,
    autoplay: true,
    onComplete: () => setIsAnimationComplete(true),
  };

  const home = useLottie(options);

  return (
    <html lang="en" className="h-full bg-black">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black ">
        {!isAnimationComplete && (
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            <div style={{ width: "50%" }}>{home.View}</div>
          </div>
        )}
        {isAnimationComplete && (
          <div className="flex h-full min-h-screen fade-in">
            <Sidebar />
            <main className="flex-1 ml-64">
              <Outlet />
            </main>
          </div>
        )}
        <ScrollRestoration />
        <Scripts />

      </body>
    </html>
  );
}