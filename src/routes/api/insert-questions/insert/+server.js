import { json } from "@sveltejs/kit";

export const POST = async ({ fetch, request }) => {
    const { generatedQuestions } = await request.json();

    try {
        const insertionRes = await fetch("https://hawi.pages.dev/api/insert-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(generatedQuestions)
        })

        const insertionJSON = await insertionRes.json();

        if(!insertionJSON?.status) {
            return json({ status: false, message: insertionJSON?.message || "Something went wrong, 1" })
        }

        return json({ status: true });
    } catch (err) {
        return json({ status: false, message: err.message || "Something went wrong, 2" });
    }
}