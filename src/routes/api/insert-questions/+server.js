import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const POST = async ({ fetch, request }) => {
    const { courseID, lectureNumber, rawQuestions, bankID, round } = await request.json();

    const { data: lectureContent, error: lectureError } = await supabase
        .from('hawi_lecture')
        .select('lectureID, content')
        .eq('courseID', courseID)
        .eq('number', lectureNumber)
        .single();

    if(lectureError || !lectureContent) {
        return json({ status: false, message: lectureError?.message || "Something went wrong." });
    }

    const { lectureID, content } = lectureContent;

    const messages = [
        {
            role: "system",
            content: `
            You're a med school professor. the user will provide a set of multiple choice questions for you to analyse, you will also be provided with a set of lectures as reference, then for for each question you should:

  1. The input is messy and unorganized, First you need to analyze the input and re format it into something like this for each question:
{
    "body": " كل ما يلي صحيح حول مثبطات 9PCSK عدا:",
    "answers": [
        {
            "content": " تنقص LDL بمقدار -60 70%",
            "correct": false
        },
        {
            "content": "9PCSK بروتين كبدي يخرب مستقبلات LDL.",
            "correct": false
        },
        {
            "content": "تثبيط 9PCSK يزيد مستقبلات LDL الكبدية",
            "correct": false
        },
        {
            "content": "تعطى عن طريق الفم حبة واحدة يوميا",
            "correct": true
        }
    ],
    "explanation": ""
}

  Some messy question blocks might be right after each other with no spaces, so make sure to pay attention to that and keep going until you've collected and formatted all questions within the input.
  Notice how the explanation is empty for now, we need to fill it according to the rest of the instructions:

  2. generate an explanation following this framework on order:
        
        1. Explain why the correct answer is correct
        2. Elaborate on relevant information about the correct answer, from the lectures
        3. Explain why other options are incorrect

        Things to do:
        1. Keep the explanation brief and concise
        2. Generate explanations based on information from lectures which will be provided to you
        3. Respond in Arabic
        4. Always return an array even if only one question was provided

        Things not to do:
        1. Do not include the number of a step when following the explanation framework
        2. Do not change the question body, or answers
        3. Never change which answer is the correct answer, keep the answers exactly as they are in the same order

        Follow this JSON structure as shown in the example:

{
                        "body": "يؤثر التركيب الكيميائي للهرمون في كل ما يلي \nعدا",
                        "answers": [
                            {
                                "content": " موضع المستقبل",
                                "correct": false
                            },
                            {
                                "content": "شكل جوالنه في الدم )حر أو مرتبط(",
                                "correct": false
                            },
                            {
                                "content": " ارتباطه بالمستقبل عكوس او غير عكوس.",
                                "correct": false
                            },
                            {
                                "content": " مدة نصف عمره بالدم",
                                "correct": true
                            }
                        ],
                        "explanation": "التركيب الكيميائي للهرمون يؤثر في موضع المستقبل، وشكله في الدم، وطبيعة ارتباطه بالمستقبل، لكنه لا يؤثر مباشرة في مدة نصف عمره بالدم، والتي تتحدد بعوامل أخرى مثل معدل التصفية الكلوية والاستقلاب الكبدي."
}

Here are the lectures:

${content}
            `
        },
        {
            role: "user",
            content: `
            Here are the questions:

            ${rawQuestions}`
        },
    ]

    const completion = await client.beta.chat.completions.parse({
        model: "deepseek-chat",
        messages,
        response_format: { type: 'json_object' },
        max_tokens: 8192
    });

    const data = JSON.parse(completion.choices[0].message.content);

    const generatedQuestions = data?.questions || [];

    generatedQuestions.forEach(q => {
        q.round = round;
        q.lectures = [lectureID];
        q.bankID = bankID;
    })

    const { data: promptID, error } = await supabase
    .from('marioul_prompts')
    .insert([{ completion, prompt: messages }])
    .select('promptID')
    .single();

    return json({ success: true, data, completion, promptID, generatedQuestions });
}