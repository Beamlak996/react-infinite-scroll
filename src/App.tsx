import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import type { Todo } from "./types/todo";
import { TodoCard } from "./components/todo-card";

function App() {
  const { ref, inView } = useInView();

  const fetchTodos = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}`
    );
    const data = await res.json();
    return data;
  };

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // return allPages.length + 1;
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  const content = data?.pages.map((todos: Todo[]) => 
    todos.map((todo) =>  <TodoCard innerRef={ref} todo={todo} />)
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="mt-10 w-full min-h-full flex justify-center">
        Loading...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-10 w-full min-h-full flex justify-center">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-3 p-3">
        {content}
        <div className="flex w-full justify-center">
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200  focus:ring-blue-500 ${
              !isFetchingNextPage && hasNextPage
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || !hasNextPage}
            ref={ref}
          >
            {isFetchingNextPage
              ? "Loading..."
              : hasNextPage
              ? "Load More"
              : "All items loaded"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
