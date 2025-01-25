"use client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Dialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div
      className="w-screen h-screen top-0 left-0 bg-black/50 fixed z-10"
      onClick={(e) => {
        e.stopPropagation();
        router.back();
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div
          className="bg-white p-4 rounded-lg w-3/4 h-1/4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <div>{children}</div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
