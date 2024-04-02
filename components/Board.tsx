"use client";
import { useBoardStore } from "@/Store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import ColumnComp from "./ColumnComp";
import { Column, TypedColumn } from "@/type";

const Board = () => {
  const [getBoard, board, setBoard, updateTodoInDB, updateSameColumnInDB] =
    useBoardStore((state) => [
      state.getBoard,
      state.board,
      state.setBoard,
      state.updateTodoInDB,
      state.updateSameColumnInDB,
    ]);
  useEffect(() => {
    getBoard();
  }, [getBoard]);
  // function to handleDrag End func
  const handleOnDragEnd = (e: DropResult) => {
    const { source, destination, type } = e;
    if (!destination) return;
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map<TypedColumn, Column>(entries);
      setBoard({ ...board, columns: rearrangedColumns });
    }

    // This step is necessary to store indexes of store as number 0, 1, 2 etc instead of droppableIds as they are in string so first we have to convert them into numbers.
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];
    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };
    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };
    if (!startCol || !finishCol) return;
    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoard({ ...board, columns: newColumns });
      // console.log(newTodos);
      newTodos.map((todo, index) => {
        updateSameColumnInDB(todo, index);
      });
    } else {
      // dragging to another column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      // update the db
      updateTodoInDB(todoMoved, finishCol.id);

      setBoard({ ...board, columns: newColumns });
    }
  };
  const dropId = "todoboard";
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId={dropId} direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-7xl mx-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <ColumnComp key={id} todos={column.todos} id={id} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
