import {
  collectionId,
  database,
  databaseId,
  storage,
} from "@/Utils/appwriteConfig";
import { getTodosByColumn } from "@/libs/getTodos";
import { Board, Column, Image, Todo, TypedColumn } from "@/type";
import { create } from "zustand";

interface BoardState {
  board: Board;
  image: File | null;
  newTaskInput: string;
  newTaskType: TypedColumn;
  setNewTaskType: (input: TypedColumn) => void;
  setNewTaskInput: (task: string) => void;
  getBoard: () => void;
  setBoard: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  updateSameColumnInDB: (todo: Todo, index: number) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  newTaskInput: "",
  image: null,
  searchString: "",
  newTaskType: "todo",
  setNewTaskType: (input) => {
    set({ newTaskType: input });
    console.log(get().newTaskType);
  },
  setSearchString: (searchString) => set({ searchString }),
  setNewTaskInput: (task) => {
    set({ newTaskInput: task });
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
  setImage: (image) => {
    set({ image });
  },
}));
