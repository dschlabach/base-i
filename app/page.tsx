"use client";
import Image from "next/image";
import React from "react";
import Todo from "@/components/Todo";
import { nanoid } from "nanoid";
import {
  useTodoState,
  useTodoDispatch,
  TodoProvider,
} from "@/components/TodoContextProvider";

const TodoApp = () => {
  const todos = useTodoState();
  const dispatch = useTodoDispatch();
  const [input, setInput] = React.useState("");

  const addTodo = (title: string) =>
    dispatch({
      type: "ADD_TODO",
      payload: { id: nanoid(), title },
    });

  // Get the top-level todos (those without parent references)
  const topLevelTodos = Object.entries(todos).filter(
    ([id, todo]) =>
      !Object.values(todos).some((t) => t.childrenIds?.includes(id))
  );

  return (
    <div className="flex min-w-80 justify-center items-center flex-col gap-4 border rounded p-4">
      <h1>Todo List</h1>
      <input
        className="border rounded p-2 w-80"
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <button
        onClick={() => {
          addTodo(input);
          setInput("");
        }}
      >
        Add Todo
      </button>
      <div>
        {topLevelTodos.map(([id, todo]) => (
          <Todo key={id} id={id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

const App = () => (
  <TodoProvider>
    <TodoApp />
  </TodoProvider>
);

export default App;
