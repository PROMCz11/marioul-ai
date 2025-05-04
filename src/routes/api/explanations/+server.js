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
                You're a med school professor, your task is to generate explanations from university lectures into a set of questions, answer in the following json structure, map each explanations to the question index in the questions array
                [
                    {
                        index, // this is the question index in the input array
                        explanation, // this is the required explanation
                    }
                ]

                For example: here's a question, it's question of index 4 (the 5th item in the questions array)
                {
                    "body": "يؤثر التركيب الكيميائي للهرمون في كل ما يلي \nعدا",
                    "answers": {
                        "a": " موضع المستقبل",
                        "b": "شكل جوالنه في الدم )حر أو مرتبط(",
                        "c": " ارتباطه بالمستقبل عكوس او غير عكوس.",
                        "d": " مدة نصف عمره بالدم"
                    },
                    "correctAnswer": "d"
                },
                here's an explanation to that question
                {
                    index: 4,
                    explanation: "التركيب الكيميائي للهرمون يحدد خصائصه مثل موضع المستقبل (أ)، وشكل وجوده في الدم (ب)، ونوع ارتباطه بالمستقبل (عكوس أو غير عكوس) (ج). لكن مدة نصف العمر في الدم (د) لا تعتمد بشكل رئيسي على التركيب الكيميائي للهرمون، بل على عوامل خارجية مثل معدل الأيض وإخراج الهرمون من الجسم، لذلك هي الإجابة الصحيحة."
                }

                You will repond in Arabic, each explanation need to specify why the answer is correct, relying on the lectures as the source, keep the explanations brief and consice.

                The questions: ${questions}

                The lectures:
                ${lectures}
                `
            }
        ],
        response_format: { 'type': 'json_object' }
    });

    console.log(completion);

    const data = JSON.parse(completion.choices[0].message.content);

    return json({ sucess: true, data, completion });
}