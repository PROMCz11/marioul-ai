<script>
    let questions = [];

    let questionsInput = "";

    import explainedBank from "$lib/dental/dental-bank-explained.json";
    questions = explainedBank;
</script>

<main class="fs-300" dir="rtl">
    {#if !questions.length}
    <textarea bind:value={questionsInput} cols="50" rows="10" placeholder="أدخل الأسئلة هنا..."></textarea>
    <div>
        <button on:click={() => {
            if(!questionsInput) {
                alert("الرجاء إدخال أسئلة");
                return;
            }

            try {
                questions = JSON.parse(questionsInput);
            } catch (err) {
                console.log(err);
                alert("الرجاء التأكد من أن الأسئلة مدخلة بصيغة JSON");
            }
        }}>عرض</button>
    </div>
    {:else}
    <button class="clear" on:click={() => {
        questionsInput = null;
        questions = [];
    }}>Clear</button>
    {#each questions as question, index}
    <div class="question">
        <h3>{index + 1}. {question.body}</h3>
        <p class:correct={question.answers.a.correct}>A. {question.answers.a.content}</p>
        <p class:correct={question.answers.b.correct}>B. {question.answers.b.content}</p>
        <p class:correct={question.answers.c.correct}>C. {question.answers.c.content}</p>
        <p class:correct={question.answers.d.correct}>D. {question.answers.d.content}</p>
        {#if question.explanation}
        <p class="fs-xs">الشرح: {question.explanation}</p>
        {/if}
    </div>
    {/each}
    {/if}
</main>

<style>
    main {
        padding: 1rem;
        max-width: 800px;
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        gap: 5rem;
        padding-block: 5rem;
    }

    .question {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .question .correct {
        color: green;
    }

    .clear {
        position: fixed;
        top: 1rem;
        left: 1rem;
    }
</style>