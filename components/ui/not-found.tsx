"use client";
import { getCloudinaryUrl } from "@/utils/cloudinary";
import Link from "next/link";
import Image from "next/image";
import TopNav from "../layout/top-nav";

export default function NotFound() {
  return (
    <div className="bg-[#FFFEEA] min-h-screen">
      <TopNav />
     
      <div className="max-w-[480px] mx-auto mt-12 mb-6 px-6">
        <div className="w-full max-w-[250px] mx-auto object-cover relative">
          <Image
            src={getCloudinaryUrl("Group_rap5pw")}
            className=""
            alt={`not found`}
            layout="responsive"
            objectFit="contain"
            objectPosition="center"
            width={464}
            height={785}
          />
        </div>
        <h2 className="text-[#1E1E1E] mt-8 font-[600] text-[1.5rem] text-center lg:text-[1.6rem] leading-tight">
          Page Not Found
        </h2>
        <p className="text-[#1E1E1E] text-[.87rem] lg:text-[.95rem] mt-1 text-center">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="bg-white rounded-xl w-full border border-[#DDDDDD66] p-6 mt-[1rem]">
          <h3 className="text-[#1A1B1C] mb-1 font-[500] text-[.9rem]">
            What can you do:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#4A4D50]">
            <li>Double-check the url spelling</li>
            <li>Contact support if you believe this is an error</li>
          </ul>
        </div>
      
      </div>
    </div>
  );
}
