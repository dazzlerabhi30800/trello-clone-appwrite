import OpenAI from "openai";

const openai = new OpenAI({
  // organization: "org-5ysCR1kcFMWB5lVVEN0YuMhG",
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});

export default openai;
