import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const POST = async ({ fetch, request }) => {
    const { courseID, lectureNumber, rawQuestions, systemPrompt } = await request.json();

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
            content: `${systemPrompt}${content}
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
        q.round = "2xxx - 2xxx";
        q.lectures = [lectureID];
        q.bankID = "mock-bankID-xxxx";
    })

    const { data: promptID, error } = await supabase
    .from('marioul_prompts')
    .insert([{ completion, prompt: messages }])
    .select('promptID')
    .single();

    return json({ success: true, data, completion, promptID, generatedQuestions });
}