import { useBoardStore } from "@/Store/BoardStore";
import { getUrlImage } from "@/libs/getImageUrl";
import { Todo, TypedColumn } from "@/type";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

type todocard = {
  todo: Todo;
  id: TypedColumn;
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!todo.image) return;
    const fetchImage = async () => {
      const url = await getUrlImage(todo.image!);
      if (url) {
        setImageUrl(url);
      }
    };
    fetchImage();
  }, [todo]);
  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className="bg-white overflow-hidden bg-white space-y-2 drop-shadow-md rounded-md"
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
      {imageUrl && (
        <div className="w-full h-[200px] p-2">
          <Image
            src={imageUrl}
            alt={todo.title}
            width={200}
            height={200}
            className="object-cover w-full h-full rounded-b-md"
          />
        </div>
      )}
    </div>
  );
};

export default TodoCard;
