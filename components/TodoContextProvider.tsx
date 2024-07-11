import React from "react";

export type TodoType = {
  title: string;
  completed: boolean;
  childrenIds?: string[];
};

export type TodoDatabase = Record<string, TodoType>;

// Define the action types
export type TodoAction =
  | { type: "ADD_TODO"; payload: { id: string; title: string } }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "COMPLETE_TODO"; payload: { id: string } }
  | { type: "EDIT_TODO_TITLE"; payload: { id: string; newTitle: string } }
  | {
      type: "ADD_CHILD_TODO";
      payload: { parentId: string; childId: string; childTitle: string };
    };

// Reducer function
const todoReducer = (state: TodoDatabase, action: TodoAction): TodoDatabase => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        [action.payload.id]: {
          title: action.payload.title,
          completed: false,
          childrenIds: [],
        },
      };
    // TODO: handle uncollected children
    case "DELETE_TODO": {
      const { [action.payload.id]: _, ...rest } = state;

      return rest;
    }
    case "COMPLETE_TODO":
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          completed: !state[action.payload.id].completed,
        },
      };
    case "EDIT_TODO_TITLE":
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          title: action.payload.newTitle,
        },
      };
    case "ADD_CHILD_TODO": {
      const parentTodo = state[action.payload.parentId];
      return {
        ...state,
        [action.payload.parentId]: {
          ...parentTodo,
          childrenIds: [
            ...(parentTodo.childrenIds || []),
            action.payload.childId,
          ],
        },
        [action.payload.childId]: {
          title: action.payload.childTitle,
          completed: false,
          childrenIds: [],
        },
      };
    }
    default:
      return state;
  }
};

// Create context
const TodoStateContext = React.createContext<TodoDatabase | undefined>(
  undefined
);
const TodoDispatchContext = React.createContext<
  React.Dispatch<TodoAction> | undefined
>(undefined);

interface TodoProviderProps {
  children: React.ReactNode;
}

const loadState = (): TodoDatabase => {
  const storedState = localStorage.getItem("todos");
  return storedState ? JSON.parse(storedState) : {};
};

// Create provider component
export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [state, dispatch] = React.useReducer(todoReducer, {}, loadState);

  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(state));
  }, [state]);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};

// Custom hooks to use the context
export const useTodoState = () => {
  const context = React.useContext(TodoStateContext);
  if (context === undefined) {
    throw new Error("useTodoState must be used within a TodoProvider");
  }
  return context;
};

export const useTodoDispatch = () => {
  const context = React.useContext(TodoDispatchContext);
  if (context === undefined) {
    throw new Error("useTodoDispatch must be used within a TodoProvider");
  }
  return context;
};
