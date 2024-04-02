import { Board, TypedColumn, Todo } from "@/type";

const formatTodosForAI = (board: Board) => {
  const todos = Array.from(board.columns.entries());
  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos;
    return map;
  }, {} as { [key in TypedColumn]: Todo[] });
  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TypedColumn] = value.length;
      return map;
    },
    {} as { [key in TypedColumn]: number }
  );
  return flatArrayCounted;
};

export const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board);
  // console.log(todos);
  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });
  const data = await res.json();
  console.log(data);
  return "hello";
};
