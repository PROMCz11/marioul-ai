import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { questions } from "$lib/questions";
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
import { supabase } from "$lib/supabaseClient";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

let lectures = ``;

export const POST = async ({ fetch, request }) => {
  const { lecturesSpec, questionsSpec, prompt } = await request.json();

  compileLectures(lecturesSpec);
  const { start, end } = questionsSpec;

  console.log(questionsSpec, lecturesSpec);

  const messages = [
    {
      role: "system",
      content: `
      ${prompt}
      `
    },
    {
      role: "user",
      content: `The Lectures: 
      ${lectures}`
    },
    {
      role: "user",
      content: `The questions: 
      ${JSON.stringify(questions.slice(start, end))}`
    }
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
    .insert([{ completion, prompt: { lecturesSpec, questionsSpec, instructions: prompt } }])
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