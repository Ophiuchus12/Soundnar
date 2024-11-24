import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useLottie } from "lottie-react";
import "../styles/index.css";

export default function Index() {

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-cover bg-center flex">
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-white text-3xl">Welcome to the Music App</h1>
        </div>
      </div>
    </div>
  );
}