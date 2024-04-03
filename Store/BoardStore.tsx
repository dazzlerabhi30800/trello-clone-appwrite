import {
  ID,
  collectionId,
  database,
  databaseId,
  storage,
} from "@/Utils/appwriteConfig";
import { getTodosByColumn } from "@/libs/getTodos";
import { imageUpload } from "@/libs/uploadImage";
import { Board, Column, Image, Todo, TypedColumn } from "@/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BoardState {
  board: Board;
  image: File | null;
  newTaskInput: string;
  newTaskType: TypedColumn;
  columnOrder: TypedColumn[];
  setColumnOrder: (board: Board) => void;
  setNewTaskType: (input: TypedColumn) => void;
  setNewTaskInput: (task: string) => void;
  getBoard: () => void;
  setBoard: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  updateSameColumnInDB: (todo: Todo, index: number) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
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
      columnOrder: ["todo", "inprogress", "done"],
      setSearchString: (searchString) => set({ searchString }),
      setNewTaskInput: (task) => {
        set({ newTaskInput: task });
      },
      getBoard: async () => {
        const board = await getTodosByColumn(get().columnOrder);
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
      addTask: async (todo, columnId, image) => {
        let file: Image | undefined;
        if (image) {
          const imageFileUpload = await imageUpload(image);
          if (imageFileUpload) {
            file = {
              bucketId: imageFileUpload.bucketId,
              fileId: imageFileUpload.$id,
            };
          }
        }

        const newTask = await database.createDocument(
          databaseId,
          collectionId,
          ID.unique(),
          {
            title: todo,
            status: columnId,
            ...(file && { image: JSON.stringify(file) }),
          }
        );
        set({ newTaskInput: "" });
        const newColumns = new Map(get().board.columns);
        const length = newColumns.get(columnId)?.todos.length;
        if (!newTask) return;
        const newTodo: any = {
          $id: newTask.$id,
          $createdAt: new Date().toISOString(),
          title: todo,
          position: length! + 1,
          status: columnId,
          ...(file && { image: file }),
        };
        const column = newColumns.get(columnId);
        if (!column) {
          newColumns.set(columnId, {
            id: columnId,
            todos: [newTodo],
          });
        } else {
          newColumns.get(columnId)?.todos.push(newTodo);
        }

        set({ board: { columns: newColumns } });
      },
      setColumnOrder: (column) => {
        const entries = new Map(column.columns.entries());
        const order: TypedColumn[] = [];
        Array.from(entries.keys()).map((key) => {
          order.push(key);
        });
        set({columnOrder: order})
      },
    }),
    {
      name: "columnOrder",
      partialize: (state) => ({ columnOrder: state.columnOrder }),
    }
  )
);
