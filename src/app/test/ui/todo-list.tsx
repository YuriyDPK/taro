"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { unsubscribe } from "diagnostics_channel";
import { useCallback, useRef, useState } from "react";

export const TodoList = () => {
  const [page, setPage] = useState(1);
  const {
    data,
    error,
    isLoading,
    isError,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = useInfiniteQuery({
    queryKey: ["tasks"],
    queryFn: (meta) => todoListApi.getTasks({ page: meta.pageParam }, meta),
    initialPageParam: 1,
    getNextPageParam: (res) => res.next,
    select: (result) => result.pages.flatMap((page) => page.data),
  });
  const cursorRef = useIntersection(() => {
    fetchNextPage();
  });
  if (isLoading) return <div>Loading...</div>;
  if (isPending) return <div>Pending...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className={`${isPlaceholderData ? "opacity-50" : ""}`}>
      {data?.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
      <div className="text-gray-500" ref={cursorRef}>
        {!hasNextPage && <div>no data for loading</div>}
        {isFetchingNextPage && <div>loading...</div>}
      </div>
    </div>
  );
};

export function useIntersection(onIntersect: () => void) {
  const unsubscribe = useRef<(() => void) | null>(null);

  return useCallback(
    (el: HTMLDivElement | null) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((intersection) => {
          if (intersection.isIntersecting) {
            onIntersect();
          }
        });
      });

      if (el) {
        observer.observe(el);
        unsubscribe.current = () => observer.disconnect();
      } else if (unsubscribe.current) {
        unsubscribe.current();
      }
    },
    [onIntersect]
  );
}

export const todoListApi = {
  getTasks: (
    { page }: { page: number },
    { signal }: { signal: AbortSignal }
  ) => {
    const start = (page - 1) * 5;
    const end = start + 5;
    return new Promise<{ id: number; title: string }[]>((res) => {
      const tasks: { id: number; title: string }[] = [];
      for (let i = start; i < end; i++) {
        tasks.push({ id: i, title: `Task ${i}` });
      }
      setTimeout(() => {
        res(tasks);
      }, 1000);
    });
  },
};
