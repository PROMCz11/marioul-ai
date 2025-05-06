import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { lectures } from "$lib/lectures/lectures-[3, 12, 13]";
import { questions } from "$lib/questions";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const GET = async ({ fetch }) => {
    const completion = await client.beta.chat.completions.parse({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `
      You're a medical school professor. Your task is to generate concise explanations for multiple-choice questions based on the provided lectures. Each explanation should justify the correct answer, referencing relevant lecture content, while also explaining why other options are wrong, form each explanation in one paragraph block in this logical order (without numbers):
      
      1. Explain why the correct answer is correct
      2. Elaborate on relevant information about the correct answer
      3. Explain why other options are incorrect

      Keep your explanations short and concise, and make sure to not change the questions.
      
      Respond in Arabic using the following JSON structure, fill in the empty explanation property of each question, here's an example question format (do not use this particular example in your response):
      
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
      ${questions.slice(17, 22)}
            `
          }
        ],
        response_format: { type: 'json_object' }
      });      

    console.log(completion);

    const data = JSON.parse(completion.choices[0].message.content);

    return json({ success: true, data, completion });
}