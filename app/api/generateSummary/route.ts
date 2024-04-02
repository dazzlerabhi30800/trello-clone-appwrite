import openai from "@/components/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "Hello Dazzler Abhi and greet on the depending on time. Limit the response to 200 chracters",
      },
      {
        role: "user",
        content: `Hi ther, provide the summary for the following todos, County how many todos are in each category such as To do, in progress and done, then tell user to have productive day! Here's the data ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });
  // console.log(response);
  // console.log(response.choices[0].message);
  // return NextResponse.json(response.choices[0].message);
  return NextResponse.json("hello");
}
