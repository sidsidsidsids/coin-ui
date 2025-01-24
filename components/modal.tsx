"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);
  return (
    <div
      className="w-screen h-screen top-0 left-0 bg-black/50 fixed z-1"
      onClick={(e) => {
        e.stopPropagation();
        router.back();
      }}
    >
      <div
        className="flex flex-col items-center justify-center w-full h-full"
      >
        <div
          className="bg-white p-4 rounded-lg w-5/6 h-5/6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
