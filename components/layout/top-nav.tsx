"use client";
import Image from "next/image";
import { getCloudinaryUrl } from "@/utils/cloudinary";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
// import cookie from "@/utils/cookie";

export default function TopNav({ logo }: { logo?: any }) {
  const router = useRouter();
  return (
    <div className="bg-white border-b border-[#DDDDDD66] font-inter">
      <div className="w-full h-20 lg:h-20 mt-0 bg-white px-5 lg:px-20 flex items-center justify-between">
        <Link
          href="https://mygrats.com"
          className="w-[7.5rem] h-[4rem] relative cursor-pointer"
        >
          {" "}
          <Image
            src={logo || getCloudinaryUrl("Grats_-_Logo_ug0dub")}
            className=""
            alt={`grats logo`}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
          />
        </Link>
      </div>
    </div>
  );
}
