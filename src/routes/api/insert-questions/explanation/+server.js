import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY, SECRET_SYSTEM_PASSWORD } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const POST = async ({ request }) => {
    const { question, lectureID, systemPassword } = await request.json();

    if(systemPassword !== SECRET_SYSTEM_PASSWORD) {
        return json({ status: false, message: "Unauthorized" });
    }

    if (!question || !lectureID) {
        return json({ status: false, message: "Missing required fields" });
    }

    let lectureContent, lectureError;

    const { data, error } = await supabase
        .from('hawi_lecture')
        .select('content')
        .eq('lectureID', lectureID)
        .single();

    lectureContent = data;
    lectureError = error;

    if(lectureError || !lectureContent) {
        return json({ status: false, message: lectureError?.message || "Something went wrong." });
    }

    const { content } = lectureContent;

    const messages = [
        {
            role: "system",
            content: `You are a **medical school professor** specializing in generating explanations for multiple-choice questions (MCQs).  
The user will provide:  
1. A single question with its answers (in JSON format)  
2. A set of reference lectures (in Arabic)  

Your task is to generate an explanation for the provided question following this framework **in order**, without numbering the steps:

1. Explain why the correct answer is correct (or why it is the "wrong" choice if the question asks for the wrong one).  
2. Expand with relevant, medically accurate information about the correct answer.

**Content Composition Rule (MANDATORY):**
- If the lecture contains content:  
  - About **50%** of the explanation must be **derived from the provided lectures** (paraphrased or summarized).  
  - The other **50%** must be **new knowledge** from your own medical expertise or other relevant sources.  
- If the lecture content is exactly **"This lecture has no content"**, generate the explanation **entirely** from your own medical expertise or other reliable sources.

- **Do not** indicate which part of the explanation came from lectures or external knowledge — integrate seamlessly.  
- The entire explanation should be **around 50 words**.

**Language & Style Requirements:**
- Write the explanation in **Arabic**.
- Keep it **brief, clear, and coherent**.
- Ensure the paragraph flows naturally.

---

### **Question Structure Example:**
{
    "body": "يؤثر التركيب الكيميائي للهرمون في كل ما يلي عدا",
    "answers": [
        {
            "content": "موضع المستقبل",
            "correct": false
        },
        {
            "content": "شكل جوالنه في الدم )حر أو مرتبط(",
            "correct": false
        },
        {
            "content": "ارتباطه بالمستقبل عكوس او غير عكوس.",
            "correct": false
        },
        {
            "content": "مدة نصف عمره بالدم",
            "correct": true
        }
    ],
    "explanation": ""
}

---

**Important:**
- Always handle "اختر الخاطئة" or similar instructions by explaining why the marked correct answer is the wrong choice.
- Never include letters (A, B, C, D, E) or any answer labels in the explanation.
- Ensure the explanation aligns with which answer is marked as correct: true.
- Never indicate which information came from lectures or external sources.
- Always return the **explanation text only** — no additional commentary, explanations, or text outside the explanation.

Here are the lectures:

${content}
            `
        },
        {
            role: "user",
            content: `
            Generate an explanation for this question:

            ${JSON.stringify(question)}`
        },
    ];

    try {
        const completion = await client.beta.chat.completions.parse({
            model: "deepseek-chat",
            messages,
            response_format: { type: 'text' },
            max_tokens: 2048,
            temperature: 1.2
        });

        const newExplanation = completion.choices[0].message.content.trim();

        return json({ 
            success: true, 
            explanation: newExplanation 
        });
    } catch (error) {
        console.error("Error generating explanation:", error);
        return json({ 
            success: false, 
            message: "Error generating explanation" 
        });
    }
};