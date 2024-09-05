import { Todo, TypedColumn } from "@/type";
import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TodoCard from "./TodoCard";
import { FaPlusCircle } from "react-icons/fa";
import { useBoardStore } from "@/Store/BoardStore";
import { useModalStore } from "@/Store/ModalStore";

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
  const [debouncedString, setNewTaskType] = useBoardStore((state) => [
    state.debouncedString,
    state.setNewTaskType,
  ]);
  const [openModal] = useModalStore((state) => [state.openModal]);

  const handleOpenModal = () => {
    setNewTaskType(id);
    openModal();
  };
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
                className={`p-3 flex flex-col gap-3 flex w-full rounded-2xl shadow-md ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
              >
                <h2 className="flex w-full font-bold text-xl justify-between items-center">
                  {idToColumnText[id]}{" "}
                  <span className="text-gray-800 bg-green-200 rounded-[50%] py-1 px-[10px] shadow-md text-sm font-normal">
                    {!debouncedString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(debouncedString.toLowerCase()),
                        ).length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      debouncedString &&
                      !todo.title
                        .toLowerCase()
                        .includes(debouncedString.toLowerCase())
                    )
                      return null;
                    return (
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
                    );
                  })}
                  {provided.placeholder}
                  <div className="flex justify-end items-center py-2">
                    <button
                      onClick={handleOpenModal}
                      className="text-2xl md:text-3xl text-green-500 hover:text-sky-500"
                    >
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
