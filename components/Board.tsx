"use client";
import { useBoardStore } from "@/Store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Board = () => {
  const [getBoard, board] = useBoardStore((state) => [
    state.getBoard,
    state.board,
  ]);
  useEffect(() => {
    getBoard();
  }, [getBoard]);
  console.log(board);
  return <h1>hello world</h1>;
};

export default Board;
{
  /* <DragDropContext> */
}
{
  /*   <Droppable droppableId="board" direction="horizontal" type="column"> */
}
{
  /*     {(provided) => <div></div>} */
}
{
  /*   </Droppable> */
}
{
  /* </DragDropContext> */
}
