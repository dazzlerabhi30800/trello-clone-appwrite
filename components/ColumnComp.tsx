import { Todo, TypedColumn } from "@/type";
import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TodoCard from "./TodoCard";
import { FaPlusCircle } from "react-icons/fa";

type props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};
const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const ColumnComp = ({ id, todos, index }: props) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* render droppable todos in the column */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-3 flex flex-col gap-3 flex w-full rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
              >
                <h2 className="flex w-full font-bold text-xl justify-between items-center">
                  {idToColumnText[id]}{" "}
                  <span className="text-gray-800 bg-green-200 rounded-[50%] py-1 px-[10px] shadow-md text-sm font-normal">
                    {todos.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.$id}
                      draggableId={todo.$id}
                      index={index}
                    >
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          innerRef={provided.innerRef}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className="flex justify-end items-center py-2">
                    <button className="text-2xl md:text-3xl text-green-500 hover:text-sky-500">
                      <FaPlusCircle />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default ColumnComp;
