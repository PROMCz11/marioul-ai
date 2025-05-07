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

    const generateExplanations = () => {
        if(!lectureList.find(l => l.checked) || !questionStart == "" || !questionStart == null || !questionStart == undefined
         || !questionEnd || !prompt) {
            alert("Missing data")
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
            console.log(json);
            questionStart = null;
            questionEnd = null;
            lectureList.forEach(l => l.checked = false);
            explanationsResult = json.data.questions;
        })
    }

    let questionsResult = [];
    let explanationsResult = [];

    let questionStart = "";
    let questionEnd = "";

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

    let prompt = `You're a medical school professor. Your task is to generate concise explanations for multiple-choice questions based on the provided lectures. Each explanation should justify the correct answer, referencing relevant lecture content, while also explaining why other options are wrong, form each explanation in one paragraph block in this logical order (without numbers):
      
1. Explain why the correct answer is correct
2. Elaborate on relevant information about the correct answer
3. Explain why other options are incorrect

Keep your explanations short and concise, and make sure to not change the questions.

Respond in Arabic using the following JSON structure, fill in the empty explanation property of each question, here's an example question format (do not use this particular example in your response):`;


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
            <button on:click={generateExplanations}>Generate explanations ✨</button>
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