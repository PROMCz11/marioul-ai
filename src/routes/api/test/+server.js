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
                content: "You're a space engineer, you also only answer in structured json which will be specified by the user, only output stringified json without any formatting without '```json\n'"
            },
            {
                role: "user",
                content: "Give me 5 interesting facts about space, structure of fact array: [ { name, description } ]"
            }
        ],
        response_format: { 'type': 'json_object' }
    });
    // const completion = {"id":"27b3a0a6-3b62-4cd9-8a39-773e1eeb4e96","object":"chat.completion","created":1746018021,"model":"deepseek-chat","choices":[{"index":0,"message":{"role":"assistant","content":"```json\n[\n    {\n        \"name\": \"The Great Red Spot\",\n        \"description\": \"A giant storm on Jupiter that has been raging for at least 400 years. It's so large that three Earths could fit inside it.\"\n    },\n    {\n        \"name\": \"Neutron Stars\",\n        \"description\": \"These incredibly dense remnants of supernova explosions can spin up to 600 times per second and have magnetic fields a trillion times stronger than Earth's.\"\n    },\n    {\n        \"name\": \"The Coldest Place in the Universe\",\n        \"description\": \"The Boomerang Nebula, located 5,000 light-years away, is the coldest known place in the universe at -272°C, just 1°C above absolute zero.\"\n    },\n    {\n        \"name\": \"Time Dilation\",\n        \"description\": \"Due to Einstein's theory of relativity, time moves slower near massive objects. Astronauts on the ISS age slightly slower than people on Earth—about 0.007 seconds less per six months.\"\n    },\n    {\n        \"name\": \"Water in Space\",\n        \"description\": \"There's a massive water vapor cloud in space, holding 140 trillion times the water in Earth's oceans, located around a quasar 12 billion light-years away.\"\n    }\n]\n```","parsed":null},"logprobs":null,"finish_reason":"stop"}],"usage":{"prompt_tokens":44,"completion_tokens":272,"total_tokens":316,"prompt_tokens_details":{"cached_tokens":0},"prompt_cache_hit_tokens":0,"prompt_cache_miss_tokens":44},"system_fingerprint":"fp_8802369eaa_prod0425fp8"}

    const data = completion.choices[0].message.content;
    console.log(data);
    // const data = "{\"facts\":[{\"name\":\"The Sun's Mass\",\"description\":\"The Sun accounts for about 99.86% of the total mass in our solar system.\"},{\"name\":\"Neutron Stars\",\"description\":\"A neutron star is so dense that a sugar-cube-sized amount of its material would weigh about a billion tons on Earth.\"},{\"name\":\"The Great Red Spot\",\"description\":\"Jupiter's Great Red Spot is a giant storm that has been raging for at least 400 years and is large enough to fit two Earths side by side.\"},{\"name\":\"Black Holes\",\"description\":\"Black holes have such strong gravitational pulls that not even light can escape them, making them invisible to the naked eye.\"},{\"name\":\"The Coldest Place\",\"description\":\"The Boomerang Nebula, located 5,000 light-years away, is the coldest known place in the universe, with temperatures dropping to -458°F (-272°C).\"}]}"

    return json({ sucess: true, data });
}