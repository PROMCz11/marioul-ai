<script>
    import { questions } from "$lib/questions";
    import "../global.css";
    const generateQuestions = () => {
        questionsResult = [];
        fetch("./api/questions")
        .then(res => res.json())
        .then(json => {
            console.log(json);
            questionsResult = json.completion;
        })
    }
    const generateExplanations = () => {
        explanationsResult = [];
        fetch("./api/explanations")
        .then(res => res.json())
        .then(json => {
            console.log(json);
            explanationsResult = json.data.questions;
        })
    }

    let questionsResult = [];
    let explanationsResult = [];
</script>

<main>
    <button on:click={generateQuestions}>Generate questions ✨</button>
    <button on:click={generateExplanations}>Generate explanations ✨</button>

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
    {/if}
</main>

<style>
    main {
        padding: 1rem;
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
</style>