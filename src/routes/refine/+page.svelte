<script>
    let courseID, lectureNumber;
    let rawQuestions;
    let systemPrompt = `
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

`;

    let isGenerating = false;

    const generate = async () => {
        if(
            !courseID ||
            !lectureNumber ||
            !rawQuestions
        ) {
            alert("Invalid data");
            return;
        }

        if(isGenerating) {
            return;
        }

        generatedQuestions = [];

        try {
            isGenerating = true;
            const res = await fetch('/api/refine', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseID,
                    lectureNumber,
                    rawQuestions,
                    systemPrompt
                })
            })
            
            const json = await res.json();
            console.log(json);

            if(!json?.success) {
                return;
            }
            generatedQuestions = json.generatedQuestions;
        } catch (err) {
            console.log(err.message);
        } finally {
            isGenerating = false;
        }
    }

    let generatedQuestions = [];
</script>

<main>
    <div>
        <p>Course ID</p>
        <input bind:value={courseID} type="number" placeholder="Write something ...">
    </div>
    <div>
        <p>Lecture Number</p>
        <input bind:value={lectureNumber} type="number" placeholder="Write something ...">
    </div>

    <textarea bind:value={rawQuestions} cols="60" rows="17" placeholder="Write questions ..."></textarea>
    
    <textarea bind:value={systemPrompt} cols="60" rows="17" placeholder="Write system prompt ..."></textarea>

    {#if isGenerating}
    <p class="loading">Generating ...</p>
    {:else}
    <div>
        <button on:click={generate}>Generate ✨</button>
    </div>
    {/if}

    <div class="generated-questions" dir="rtl">
        {#each generatedQuestions as question, index}
            <div>
                <p class="body bold">{index + 1}. {question.body}</p>
                {#each question.answers as answer}
                    <p class:correct={answer.correct}>- {answer.content}</p>
                {/each}
                <p>{question.explanation}</p>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 700px;
        margin-inline: auto;
    }

    .generated-questions {
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    .generated-questions div p:first-of-type {
        margin-bottom: .5rem;
    }

    .generated-questions div p:last-of-type {
        margin-top: .5rem;
    }

    p.correct {
        color: green;
    }

    .loading {
        animation: loading 500ms linear alternate infinite;
    }

    @keyframes loading {
        0% {
            opacity: 1;
        }

        100% {
            opacity: .5;
        }
    }
</style>