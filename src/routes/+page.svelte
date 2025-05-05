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
            explanationsResult = json.completion;
        })
    }

    let questionsResult = [];
    let explanationsResult = [];

    // console.log(questions.map(q => {
    //     return {
    //         body: q.body,
    //         answers: {
    //             a: {
    //                 content: q.answers.a,
    //                 correct: q.correctAnswer == 'a'
    //             },
    //             b: {
    //                 content: q.answers.b,
    //                 correct: q.correctAnswer == 'b'
    //             },
    //             c: {
    //                 content: q.answers.c,
    //                 correct: q.correctAnswer == 'c'
    //             },
    //             d: {
    //                 content: q.answers.d,
    //                 correct: q.correctAnswer == 'd'
    //             },
    //         },
    //         explanation: ""
    //     }
    // }).slice(0, 11));
</script>

<main>
    <button on:click={generateQuestions}>Generate questions ✨</button>
    <button on:click={generateExplanations}>Generate explanations ✨</button>

    <!-- {#if questionsResult}
        <h2>Questions</h2>
        <div class="questions">
            {#each questionsResult as question}
            
            {/each}
        </div>
    {/if} -->
</main>

<style>
    main {
        padding: 1rem;
    }
</style>