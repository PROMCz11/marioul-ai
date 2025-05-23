import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";
import { lecture1 } from "$lib/lectures/lecture-1";
import { lecture2 } from "$lib/lectures/lecture-2";
import { lecture3 } from "$lib/lectures/lecture-3";
import { lecture5 } from "$lib/lectures/lecture-5";
import { lecture7 } from "$lib/lectures/lecture-7";
import { lecture8 } from "$lib/lectures/lecture-8";
import { lecture10 } from "$lib/lectures/lecture-10";
import { lecture11 } from "$lib/lectures/lecture-11";
import { lecture12 } from "$lib/lectures/lecture-12";
import { lecture13 } from "$lib/lectures/lecture-13";
import { lecture15 } from "$lib/lectures/lecture-15";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

let lectures = ``;

export const POST = async ({ fetch, request }) => {
  const { question, lectureNumbers } = await request.json();

  compileLectures(lectureNumbers);

  const messages = [
    {
      role: "system",
      content: `
      You're a med school professor, your goal is to answer student questions with information from university lectures which will be provided later in this message.

      Answer according to this framework:
      1. Search through the provided lectures for information which related to the student's question.
      2. Generate a comprehensive answer with an example (example only if needed).
      3. Quote information from the lecture which you have based your answer on.
      4. Elaborate on the quote in a way that relates to the question.

      If you cannot find information in the lectures to base your answer on, then say this before you answer "هذا الجواب قد يكون غير دقيق", then continue to answer based on your own knowledge regardless of the conttext, without hallucinating or inventing incorrect information.

      Things to do:
      1. Answer from the given context which is the set of lectures.
      2. Answer in Arabic.
      3. Stop and think before you answer.

      Things not to do:
      1. Answer with information outside of the context.
      2. Include the number of a step when you're following the answering framework.
      3. Stop after saying "هذا الجواب قد يكون غير دقيق" when the question is outside of the context, instead, you have to answer based on your available general knowledge.

      Format your answer in JSON like this:
      {
        answer: "this is the generated answer",
        source: "this is the unedited block of text from the lectures, on which you have based your answer, if it doesn't exist, leave this as an empty string"
      }


      Here are the lectures in Arabic:
      ${lectures}
      `
    },
    {
      role: "user",
      content: `
      ${question}`
    },
  ]

    const completion = await client.beta.chat.completions.parse({
        model: "deepseek-chat",
        messages,
        response_format: { type: 'json_object' },
        max_tokens: 8192
      });

    const data = JSON.parse(completion.choices[0].message.content);

    const { data: promptID, error } = await supabase
    .from('marioul_prompts')
    .insert([{ completion, prompt: { question, lectureNumbers } }])
    .select('promptID')
    .single();

    return json({ success: true, data, completion, promptID, messages });
}

const compileLectures = specification => {
  if(specification.includes(1)) {
    lectures += lecture1 + "\n";
  }
  
  if(specification.includes(2)) {
    lectures += lecture2 + "\n";
  }
  
  if(specification.includes(3)) {
    lectures += lecture3 + "\n";
  }
  
  if(specification.includes(5)) {
    lectures += lecture5 + "\n";
  }
  
  if(specification.includes(7)) {
    lectures += lecture7 + "\n";
  }
  
  if(specification.includes(8)) {
    lectures += lecture8 + "\n";
  }
  
  if(specification.includes(10)) {
    lectures += lecture10 + "\n";
  }
  
  if(specification.includes(11)) {
    lectures += lecture11 + "\n";
  }
  
  if(specification.includes(12)) {
    lectures += lecture12 + "\n";
  }
  
  if(specification.includes(13)) {
    lectures += lecture13 + "\n";
  }
  
  if(specification.includes(15)) {
    lectures += lecture15 + "\n";
  }
}