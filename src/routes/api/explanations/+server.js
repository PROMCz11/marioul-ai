import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { lectures } from "$lib/lectures";
import { questions } from "$lib/questions";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const GET = async ({ fetch }) => {
    const completion = await client.beta.chat.completions.parse({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `
      You're a medical school professor. Your task is to generate concise explanations for multiple-choice questions based on the provided lectures. Each explanation should justify the correct answer, referencing relevant lecture content.
      
      Respond in Arabic using the following JSON structure, fill in the empty explanation property of each question, here's an example question format:
      
      [    
        {
            "body": "يؤثر التركيب الكيميائي للهرمون في كل ما يلي \nعدا",
            "answers": {
                "a": {
                    "content": " موضع المستقبل",
                    "correct": false
                },
                "b": {
                    "content": "شكل جوالنه في الدم )حر أو مرتبط(",
                    "correct": false
                },
                "c": {
                    "content": " ارتباطه بالمستقبل عكوس او غير عكوس.",
                    "correct": false
                },
                "d": {
                    "content": " مدة نصف عمره بالدم",
                    "correct": true
                }
            },
            "explanation": ""
        },
        ...
      ]
      
      The lectures:
      ${lectures}
      
      The questions:
      ${questions}
            `
          }
        ],
        response_format: { type: 'json_object' }
      });      

    console.log(completion);

    const data = JSON.parse(completion.choices[0].message.content);

    return json({ sucess: true, data, completion });
}