// This was created to count the number of chars in a lecture, to help predict how many tokens it would amount to

import { json } from "@sveltejs/kit";
import { lecture1 } from "$lib/lectures/lecture-1";
import { lecture2 } from "$lib/lectures/lecture-2";
import { lecture3 } from "$lib/lectures/lecture-3";
import { lecture5 } from "$lib/lectures/lecture-5";
import { lecture7 } from "$lib/lectures/lecture-7";
import { lecture8 } from "$lib/lectures/lecture-8";
import { lecture10 } from "$lib/lectures/lecture-10";
import { lecture11 } from "$lib/lectures/lecture-11";
import { lecture12 } from "$lib/lectures/lecture-12";
import { lecture13 } from "$lib/lectures/lecture-13";
import { lecture15 } from "$lib/lectures/lecture-15";

export const GET = async () => {
    const count = lecture3.length;
    return json({ count })
}