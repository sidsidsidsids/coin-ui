"use client";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div
      className="w-screen h-screen top-0 left-0 bg-black/50 fixed z-2"
      onClick={(e) => {
        e.stopPropagation();
        router.back();
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div
          className="bg-white p-4 rounded-lg w-5/6 h-5/6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
