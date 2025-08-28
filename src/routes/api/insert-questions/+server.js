import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY, SECRET_SYSTEM_PASSWORD } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const POST = async ({ fetch, request }) => {
    const { courseID, lectureNumber, professorName, rawQuestions, bankID, round, systemPassword } = await request.json();

    if(systemPassword !== SECRET_SYSTEM_PASSWORD) {
        return json({ status: false, message: "Unauthorized" });
    }

    let lectureContent, lectureError;

    if(professorName) {
        const { data, error } = await supabase
            .from('hawi_lecture')
            .select('lectureID, content')
            .eq('courseID', courseID)
            .eq('number', lectureNumber)
            .eq('professor', professorName)
            .single();

        lectureContent = data;
        lectureError = error;
    } else {
        const { data, error } = await supabase
            .from('hawi_lecture')
            .select('lectureID, content')
            .eq('courseID', courseID)
            .eq('number', lectureNumber)
            .single();

        lectureContent = data;
        lectureError = error;
    }

    if(lectureError || !lectureContent) {
        return json({ status: false, message: lectureError?.message || "Something went wrong." });
    }

    const { lectureID, content } = lectureContent;

    const messages = [
        {
            role: "system",
            content: `You are a **medical school professor** specializing in multiple-choice question (MCQ) analysis and reformulation.  
The user will provide:  
1. A set of messy, unorganized multiple-choice questions (MCQs)  
2. A set of reference lectures (in Arabic)  

Your task is to process the input in **two main stages**:

---

### **Stage 1 — Data Extraction & Formatting**
- Parse the messy input to detect and separate all questions, even if multiple questions appear back-to-back without spacing.
- Remove any answer option letters such as **A, B, C, D, E** or similar labels — include only the raw answer text.
- Detect if the question explicitly states **"اختر الخاطئة"** or similar phrasing (meaning **choose the wrong answer**) and interpret correctness accordingly:
  - The answer(s) marked as "correct" in the JSON should reflect the **intended correct choice** based on the instruction (wrong answer if stated).
- Reformat **each** question into the following **exact JSON structure**:

{
    "body": "<Question text exactly as given>",
    "answers": [
        {
            "content": "<Answer text exactly as given, no letter prefixes>",
            "correct": <true or false as provided>
        },
        ...
    ],
    "explanation": ""
}

**Formatting Rules:**
- Keep question body and answer texts exactly as provided (except for removing letter prefixes) — **do not** reword, fix typos, or translate.
- Maintain **original order** of answers.
- Preserve which answer is correct according to the question's instructions.
- Always output an **array** of JSON objects — even if there is only one question.

---

### **Stage 2 — Explanation Generation**
For each question, fill in the "explanation" field following this framework **in order**, without numbering the steps:

1. Explain why the correct answer is correct (or why it is the "wrong" choice if the question asks for the wrong one).  
2. Expand with relevant, medically accurate information about the correct answer.

**Content Composition Rule (MANDATORY):**
- If the lecture contains content:  
  - About **50%** of the explanation must be **derived from the provided lectures** (paraphrased or summarized — not necessarily word-for-word).  
  - The other **50%** must be **new knowledge** from your own medical expertise or other relevant sources.  
- If the lecture content is exactly **"This lecture has no content"**, generate the explanation **entirely** from your own medical expertise or other reliable sources.

- Integrate all information seamlessly so the reader cannot tell which part came from which source.  
- The entire explanation should be **around 50 words**.

**Language & Style Requirements:**
- Write the explanation in **Arabic**.
- Keep it **brief, clear, and coherent**.
- Ensure the paragraph flows naturally with no source separation markers.

---

### **Output Example in JSON:**
questions: [
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
        "explanation": "التركيب الكيميائي يحدد موضع المستقبل وشكل الهرمون في الدم وطبيعة ارتباطه بالمستقبل، لكنه لا يتحكم مباشرة في مدة نصف العمر. هذه المدة تعتمد على آليات التصفية الكلوية والاستقلاب الكبدي، إضافة إلى عوامل تنظيمية أخرى مثل توافر البروتينات الحاملة وحالة المستقبلات الخلوية."
    }
]

---

**Important:**
- Never include letters (A, B, C, D, E) or any answer labels in the output.
- Always handle "اختر الخاطئة" or similar instructions by marking the wrong answer(s) as correct: true.
- Never modify the original wording (except letter removal).
- Always return the **final structured array** only — no additional commentary, explanations, or text outside the JSON.
- Work through the input until **all** questions are processed.

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