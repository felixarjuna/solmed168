"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "public/logo.jpg";

export default function Logo() {
  const router = useRouter();
  return (
    <nav
      className="m-8 mb-0 flex items-center gap-1"
      onClick={() => router.push("/")}
    >
      <Image src={logo} alt="solmed-logo" width={70} height={70} />
      <h1 className="text-3xl font-bold">SOLMED 168</h1>
    </nav>
  );
}
