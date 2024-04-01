import { collectionId, database, databaseId } from "@/Utils/appwriteConfig";
import { getTodosByColumn } from "@/libs/getTodos";
import { Board, Column, Todo, TypedColumn } from "@/type";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoard: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosByColumn();
    set({ board });
  },
  setBoard: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await database.updateDocument(databaseId, collectionId, todo.$id, {
      title: todo.title,
      status: columnId,
    });
  },
}));
