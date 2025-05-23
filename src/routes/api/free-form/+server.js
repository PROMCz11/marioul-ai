import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const POST = async ({ fetch, request }) => {
  const { prompt } = await request.json();

  const messages = [
    {
      role: "system",
      content: `
      ${prompt.system}
      `
    },
    {
      role: "user",
      content: `
      ${prompt.user}`
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
    .insert([{ completion, prompt }])
    .select('promptID')
    .single();

    return json({ success: true, data, completion, promptID, messages });
}