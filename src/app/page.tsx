"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-[20vh] gap-[60px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1
          className={`lg:text-[100px] text-[80px] font-light text-white text-center `}
        >
          Задай вопрос - получи ответ
        </h1>
        <h2 className={`text-[30px] font-light text-white text-center`}>
          Интуитивные расклады на Таро в один клик
        </h2>
      </div>
      <Button className="px-[60px] py-[20px] shadow-white/5 shadow-[0px_-10px_10px_0px_rgba(255,255,255,0.05)]">
        Сделать расклад
      </Button>
    </div>
  );
}
