"use client";
import { useBoardStore } from "@/Store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import Column from "./Column";

const Board = () => {
  const [getBoard, board] = useBoardStore((state) => [
    state.getBoard,
    state.board,
  ]);
  useEffect(() => {
    getBoard();
  }, [getBoard]);
  const handleOnDragEnd = (e: DropResult) => {
    console.log(e);
  };
  const dropId = "todoboard";
  // console.log(board);
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable
        droppableId={dropId.toString()}
        direction="horizontal"
        type="column"
      >
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} todos={column.todos} id={id} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
