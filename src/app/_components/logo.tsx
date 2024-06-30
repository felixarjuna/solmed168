"use client";

import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();
  return (
    <nav
      className="m-8 mb-0 text-xl font-extrabold"
      onClick={() => router.push("/")}
    >
      SOLMED 168
    </nav>
  );
}
