<script>
    let courseID, lectureNumber;
    let rawQuestions;

    let bankID, round;

    let isGenerating = false;
    let isInserting = false;

    const generate = async () => {
        if(
            !courseID ||
            !lectureNumber ||
            !rawQuestions ||
            !bankID ||
            !round
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
            const res = await fetch('/api/insert-questions', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseID,
                    lectureNumber,
                    rawQuestions,
                    bankID,
                    round
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

    const insert = async () => {
        if(!generatedQuestions?.length) {
            alert("No questions to insert");
            return;
        }

        try {
            isInserting = true;
            const res = await fetch('/api/insert-questions/insert', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ generatedQuestions })
            })
            
            const json = await res.json();
            console.log(json);

            if(!json?.status) {
                alert(json?.message || "Insertion failed");
                return;
            }

            alert("Insertion was successful");
        } catch (err) {
            alert(err.message || "Insertion failed");
        } finally {
            isInserting = false;
        }
    }
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

    <textarea bind:value={rawQuestions} cols="60" rows="17" placeholder="Write something ..."></textarea>

    <div>
        <p>Bank ID</p>
        <input bind:value={bankID} type="number" placeholder="Write something ...">
    </div>
    <div>
        <p>Round</p>
        <input bind:value={round} type="text" placeholder="Write something ...">
    </div>
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

    {#if generatedQuestions?.length && !isInserting}
    <div>
        <button on:click={insert}>Insert ⬇️</button>
    </div>
    {/if}

    {#if isInserting}
        <p class="loading">Inserting ...</p>
    {/if}
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