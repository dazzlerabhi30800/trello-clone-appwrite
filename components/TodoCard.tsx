import { useBoardStore } from "@/Store/BoardStore";
import { Todo, TypedColumn } from "@/type";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd";
import React from "react";
import { FaTimes } from "react-icons/fa";

type todocard = {
  todo: Todo;
  id: TypedColumn ;
  index: number;
  innerRef: (element?: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const TodoCard = ({
  todo,
  index,
  id,
  innerRef,
  dragHandleProps,
  draggableProps,
}: todocard) => {
  const [deleteTask] = useBoardStore((state) => [state.deleteTask]);
  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className="bg-white bg-white space-y-2 drop-shadow-md rounded-md"
    >
      <div className="flex justify-between items-center p-5">
        <p className="text-sm font-medium">{todo.title}</p>
        <button
          onClick={() => deleteTask(index, todo, id)}
          className="bg-red-600 rounded-full text-sm p-1 text-white hover:bg-red-800"
        >
          <FaTimes />
        </button>
      </div>
      {/* Add Image Here */}
    </div>
  );
};

export default TodoCard;
