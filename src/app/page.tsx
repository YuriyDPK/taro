"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { DonationBlock } from "@/components/DonationBlock";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-[5vh] gap-[60px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1
          className={`xl:text-[100px] lg:text-[80px] sm:text-[60px] text-[40px] font-light text-white text-center `}
        >
          Задай вопрос - получи ответ
        </h1>
        <h2
          className={`xl:text-[30px] lg:text-[26px] text-[20px] font-light text-white text-center`}
        >
          Интуитивные расклады на Таро в один клик
        </h2>
      </div>
      <Link href="/spreads">
        <Button className="px-[60px] py-[20px] shadow-white/5 shadow-[0px_-10px_10px_0px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-300">
          Сделать расклад
        </Button>
      </Link>

      {/* Блок пожертвований */}
      <div className="max-w-md w-full px-4">
        <DonationBlock />
      </div>
    </div>
  );
}
