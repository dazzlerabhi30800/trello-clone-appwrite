import { collectionId, database, databaseId } from "@/Utils/appwriteConfig";
import { Board, Column, TypedColumn } from "@/type";

export const getTodosByColumn = async () => {
  const data = await database.listDocuments(databaseId, collectionId);
  const todos = data.documents;
  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      description: todo.description,
      // to check if image exist or not
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());
  // if columns doesn't have tods, inprogress or done then add them with empty todos
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }
  // console.log(columns);
  // sort the column by columnTypes
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]),
    ),
  );
  const board: Board = {
    columns: sortedColumns,
  };
  return board;
};
