import { json } from "@sveltejs/kit";
import { SECRET_SYSTEM_PASSWORD } from "$env/static/private";

export const POST = async ({ fetch, request }) => {
    const { generatedQuestions, systemPassword } = await request.json();

    if(systemPassword !== SECRET_SYSTEM_PASSWORD) {
        return json({ status: false, message: "Unauthorized" });
    }

    try {
        const insertionRes = await fetch("https://hawi.pages.dev/api/insert-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ systemPassword: SECRET_SYSTEM_PASSWORD, generatedQuestions })
        })

        const insertionJSON = await insertionRes.json();

        console.log(insertionJSON);

        if(!insertionJSON?.status) {
            return json({ status: false, message: insertionJSON?.message || "Something went wrong" })
        }

        return json({ status: true });
    } catch (err) {
        return json({ status: false, message: err.message || "Something went wrong" });
    }
}