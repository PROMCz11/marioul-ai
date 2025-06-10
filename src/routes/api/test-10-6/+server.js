import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

import lectures from "./4-7.json";

export const POST = async ({ fetch, request }) => {
  let { messages } = await request.json();

  messages = [
    {
      role: "system",
      content: `
      You're a med school professor, your goal is to answer student questions with information from university lectures which will be provided later in this message.

      Answer according to this framework:
      1. Search through the provided lectures for information which are related to the student's question.
      2. Generate a comprehensive answer with an example (example only if needed).
      3. Quote information from the lecture which you have based your answer on.
      4. Elaborate on the quote in a way that relates to the question.

      If you cannot find information in the lectures to base your answer on, then generate an answer based on your general knowledge regardless of the lectures, then add this exact text snippet to the start of your answer "هذا الجواب من خارج المحاضرات وقد يكون غير دقيق: ".

      Things to do:
      1. Answer from the given context which is the set of lectures.
      2. Answer in Arabic.
      3. Stop and think before you answer.

      Things not to do:
      1. Answer with information outside of the context.
      2. Include the number of a step when you're following the answering framework.
      3. Change the provided text snippet ("هذا الجواب من خارج المحاضرات وقد يكون غير دقيق: ") when you need to generate an answer from your general knowledge

      Format your answer in JSON like this:
      {
        answer: "this is the generated answer in plain text",
        source: "this is the unedited block of text from the lectures, on which you have based your answer, if it doesn't exist, leave this as an empty string"
      }


      Here are the lectures in Arabic:
      ${lectures.content}
      `
    },
    ...messages
  ]

    const completion = await client.beta.chat.completions.parse({
        model: "deepseek-chat",
        messages,
        response_format: { type: 'json_object' },
        max_tokens: 8192,
    });

    const data = JSON.parse(completion.choices[0].message.content);
    const message = completion.choices[0].message;

    const { data: promptID, error } = await supabase
    .from('marioul_prompts')
    .insert([{ completion, prompt: { messages: messages.slice(1) } }])
    .select('promptID')
    .single();

    return json({ status: true, data, completion, promptID, message });
}