import {
  collectionId,
  database,
  databaseId,
  storage,
} from "@/Utils/appwriteConfig";
import { getTodosByColumn } from "@/libs/getTodos";
import { Board, Column, Todo, TypedColumn } from "@/type";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoard: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  updateSameColumnInDB: (todo: Todo, index: number) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
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
  updateSameColumnInDB: async (todo, index) => {
    await database.updateDocument(databaseId, collectionId, todo.$id, {
      title: todo.title,
      position: index + 1,
    });
  },
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)!.todos.splice(taskIndex, 1);
    const newTodos = newColumns.get(id)!.todos;
    newTodos.map((todo, index) => {
      get().updateSameColumnInDB(todo, index);
    });
    set({ board: { columns: newColumns } });
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await database.deleteDocument(databaseId, collectionId, todo.$id);
  },
}));
