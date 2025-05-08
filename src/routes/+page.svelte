<script>
    import { questions } from "$lib/questions";
    import "../global.css";
    // const generateQuestions = () => {
    //     questionsResult = [];
    //     fetch("./api/questions")
    //     .then(res => res.json())
    //     .then(json => {
    //         console.log(json);
    //         questionsResult = json.completion;
    //     })
    // }

    let isSaving = false;

    const generateExplanations = () => {
        isSaving = true;

        if(!lectureList.find(l => l.checked) || questionStart === "" || questionStart === null || questionStart === undefined
         || !questionEnd || !prompt || questionStart < 0 || questionEnd > 40 || questionStart > questionEnd) {
            alert("Invalid data");
            return;
        }

        const questionsSpec = {};
        questionsSpec.start = questionStart;
        questionsSpec.end = questionEnd;

        const lecturesSpec = lectureList.filter(l => l.checked).map(l => l.lec);

        explanationsResult = [];

        fetch("./api/explanations", {
            method: "POST",
            body: JSON.stringify({
                lecturesSpec,
                questionsSpec,
                prompt
            })
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            questionStart = null;
            questionEnd = null;
            lectureList.forEach(l => l.checked = false);
            lectureList = lectureList;
            if(json.data.error) {
                console.log("ERROR");
                return;
            }
            explanationsResult = json.data.questions;
        })
    }

    let questionsResult = [];
    let explanationsResult = [];

    let questionStart = null;
    let questionEnd = null;

    let lectureList = [
        { lec: 1, checked: false },
        { lec: 2, checked: false },
        { lec: 3, checked: false },
        { lec: 5, checked: false },
        { lec: 7, checked: false },
        { lec: 8, checked: false },
        { lec: 10, checked: false },
        { lec: 11, checked: false },
        { lec: 12, checked: false },
        { lec: 13, checked: false },
        { lec: 15, checked: false },
    ]

    let prompt = `
        You're a med school professor. the user will provide a questions or a set of multiple choice questions for you to analyse, the user will also provide a set of lectures as reference, then for for each question you should generate an explanation following this framework on order:
        
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

        Example input:
        [
            {
                "body": "يؤثر التركيب الكيميائي للهرمون في كل ما يلي عدا",
                "answers": {
                    "a": {
                        "content": "موضع المستقبل",
                        "correct": false
                    },
                    "b": {
                        "content": "شكل جوالنه في الدم (حر أو مرتبط)",
                        "correct": false
                    },
                    "c": {
                        "content": "ارتباطه بالمستقبل عكوس او غير عكوس.",
                        "correct": false
                    },
                    "d": {
                        "content": "مدة نصف عمره بالدم",
                        "correct": true
                    }
                },
                "explanation": ""
            },
            ...
        ]

        Example output:
        [
            {
                "body": "يؤثر التركيب الكيميائي للهرمون في كل ما يلي عدا",
                "answers": {
                    "a": {
                        "content": "موضع المستقبل",
                        "correct": false
                    },
                    "b": {
                        "content": "شكل جوالنه في الدم (حر أو مرتبط)",
                        "correct": false
                    },
                    "c": {
                        "content": "ارتباطه بالمستقبل عكوس او غير عكوس.",
                        "correct": false
                    },
                    "d": {
                        "content": "مدة نصف عمره بالدم",
                        "correct": true
                    }
                },
                "explanation": "التركيب الكيميائي للهرمون يؤثر في موضع المستقبل، وشكله في الدم، وطبيعة ارتباطه بالمستقبل، لكنه لا يؤثر مباشرة في مدة نصف عمره بالدم، والتي تتحدد بعوامل أخرى مثل معدل التصفية الكلوية والاستقلاب الكبدي. مدة نصف العمر تعتمد على عوامل خارجية مثل الارتباط بالبروتينات الناقلة ومعدل التخلص من الهرمون، وليس على التركيب الكيميائي الداخلي للهرمون نفسه."
            },
            ...
        ]
    `;


    const downloadAsJSON = (variable, filename = 'data') => {
        const jsonString = JSON.stringify(variable, null, 4);
        
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.json';
        
        document.body.appendChild(a);
        
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    let filename;
</script>

<main>
    <div class="settings">
        <div>
            <p class="bold">Select question range (start from 0 not 1, and the end is exclusive)</p>
            <p>For example if I needed questions 1 to 11, I would say 0, 11</p>
            <p>Start can only be 0 and above</p>
            <p>End can only be 40 and below</p>
            <input bind:value={questionStart} type="number" placeholder="Question start">
            <input bind:value={questionEnd} type="number" placeholder="Question end">
        </div>
        <div>
            <p class="bold">Select lectures you would like to include in the context</p>
            {#each lectureList as { lec, checked }}
                <button class:checked on:click={() => checked = !checked}>Lecture {lec}</button>
            {/each}
        </div>
        <div>
            <p class="bold">Edit the prompt (only of needed), note that the questions, lectures, and examples are already provided</p>
            <textarea bind:value={prompt} cols="60" rows="10" placeholder="Enter a prompt"></textarea>
        </div>
        <div>
            {#if isSaving}
            <p>Loading ...</p>
            {:else}
            <button on:click={generateExplanations}>Generate explanations ✨</button>
            {/if}
        </div>
    </div>

    

    {#if explanationsResult?.length}
        <div class="questions-explained fs-400" dir="rtl">
            {#each explanationsResult as question}
            <p class="bold">{question.body}</p>
            <p class:correct={question.answers.a.correct}>a: {question.answers.a.content}</p>
            <p class:correct={question.answers.b.correct}>b: {question.answers.b.content}</p>
            <p class:correct={question.answers.c.correct}>c: {question.answers.c.content}</p>
            <p class:correct={question.answers.d.correct}>d: {question.answers.d.content}</p>
            <p class="bold">الشرح</p>
            <p>{question.explanation}</p>
            {/each}
        </div>
        <div>
            <p class="bold">Download</p>
            <input bind:value={filename} type="text" placeholder="filename">
        </div>
        <button on:click={() => downloadAsJSON(explanationsResult, filename || "data")}>Download as JSON</button>
    {/if}
</main>

<style>
    main {
        padding: 1rem;
    }

    .settings {
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .questions-explained {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 700px;
        margin-inline: auto;
    }

    p.correct {
        color: green;
    }

    button.checked {
        background-color: #a1a1a1;
        color: black;
    }
</style>