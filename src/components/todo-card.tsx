import type React from "react";

import type { Todo } from "../types/todo";

type Props = {
  todo: Todo;
  innerRef?: React.Ref<HTMLParagraphElement>
};

export const TodoCard = ({ todo, innerRef }: Props) => {
  return (
    <div
      key={todo.id}
      className={`p-3 rounded-lg border shadow-sm ${
        todo.completed ? "bg-green-50" : "bg-red-50"
      }`}
      ref={innerRef}
    >
      <h3 className="font-medium line-clamp-1">{todo.title}</h3>
      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
        <span>User: {todo.userId}</span>
        <span
          className={`font-medium ${
            todo.completed ? "text-green-600" : "text-red-600"
          }`}
        >
          {todo.completed ? "✓ Done" : "✗ Pending"}
        </span>
      </div>
    </div>
  );
};
