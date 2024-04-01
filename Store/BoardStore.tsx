import { getTodosByColumn } from "@/libs/getTodos";
import { Board, Column, TypedColumn } from "@/type";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async() => {
    const board = await getTodosByColumn();
    set({board});
  } ,
}));
