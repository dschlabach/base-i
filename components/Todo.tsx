import React from "react";

import {
  TodoType,
  useTodoDispatch,
  useTodoState,
} from "@/components/TodoContextProvider";

interface TodoProps {
  id: string;
  todo: TodoType;
}

const Todo = ({ id, todo }: TodoProps) => {
  const dispatch = useTodoDispatch();
  const state = useTodoState();

  if (!todo) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch({ type: "COMPLETE_TODO", payload: { id } })}
        />
        <input
          type="text"
          value={todo.title}
          onChange={(e) =>
            dispatch({
              type: "EDIT_TODO_TITLE",
              payload: { id, newTitle: e.target.value },
            })
          }
        />
        <button
          onClick={() => dispatch({ type: "DELETE_TODO", payload: { id } })}
        >
          Delete
        </button>
        <button
          onClick={() =>
            dispatch({
              type: "ADD_CHILD_TODO",
              payload: {
                parentId: id,
                childId: Date.now().toString(),
                childTitle: "New Child Todo",
              },
            })
          }
        >
          Add Child
        </button>
      </div>
      {todo.childrenIds && (
        <div className="ml-4">
          {todo.childrenIds.map((childId) => (
            <Todo key={childId} id={childId} todo={state[childId]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Todo;
