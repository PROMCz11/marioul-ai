import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const GET = async ({ fetch }) => {
    const completion = await client.beta.chat.completions.parse({
        model: "deepseek-chat",
        messages: [
            {
                role: "system",
                content: `
                You're a medical expert, your task is to generate questions with answers from university lectures, answer in the following json structure
                {
                    body, // this is the question body
                    answers: {
                        a, // the body of the answer
                        b, // the body of the answer
                        c, // the body of the answer
                        d // the body of the answer
                    },
                    correctAnswer // this should equal 'a' or 'b' or 'c' or 'd'
                }
                You will also repond in Arabic, some questions should have multiple choices correct like this: a: example_answer_body, b: example_asnwer_body, c: example_answer_body, D: a and b.
                Some questions should have an option which is "كل ما سبق صحيح".
                Throw in some "اختر الخاطئة" questions which require the student to choose the wrong option out of the answer set.
                Make the questions more difficult by having some answers similar to each other sometimes.
                Some questions should not have a clear answer from the lecture, forcing the student to eliminate the wrong answers to get to the correct one.
                Some questions should focus on medical terms, make them more difficult by having some made-up terms which are similar to the correct terms in the answer set sometimes.

                Overall the questions should vary in difficulty, but generally they have to be harder than average, the user will specify the number of questions.

                The lectures:
                ${lectures}
                `
            },
            {
                role: "user",
                content: "20, twenty, it's very important that you generate twenty questions"
            }
        ],
        response_format: { 'type': 'json_object' }
    });

    console.log(completion);

    const data = JSON.parse(completion.choices[0].message.content);

    return json({ success: true, data, completion });
}