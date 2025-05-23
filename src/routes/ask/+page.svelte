<script>
    let isSaving = false;

    const generateAnswer = () => {
        isSaving = true;

        if(!lectureList.find(l => l.checked || !question)) {
            alert("Invalid data");
            return;
        }

        const lectureNumbers = lectureList.filter(l => l.checked).map(l => l.lec);

        generatedAnswer = null;

        fetch("../api/ask", {
            method: "POST",
            body: JSON.stringify({
                question, lectureNumbers
            })
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            lectureList.forEach(l => l.checked = false);
            lectureList = lectureList;
            if(json?.data?.error) {
                console.log("ERROR");
                return;
            }
            generatedAnswer = json.data;
        })
    }

    let generatedAnswer = null;

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

    let question = "";
</script>

<main>
    <div class="settings">
        <div>
            <p class="bold">Select lectures you would like to include in the context</p>
            {#each lectureList as { lec, checked }}
                <button class:checked on:click={() => checked = !checked}>Lecture {lec}</button>
            {/each}
        </div>
        <div>
            <p class="bold">Ask your question</p>
            <textarea dir="rtl" bind:value={question} cols="60" rows="10" placeholder="Enter a question"></textarea>
        </div>
        <div>
            {#if isSaving}
            <p>Loading ... (this will take a few seconds)</p>
            {:else}
            <button on:click={generateAnswer}>Generate explanations ✨</button>
            {/if}
        </div>
    </div>

    

    {#if generatedAnswer}
        <div class="questions-explained fs-400" dir="rtl">
            <div>
                <p class="bold">الجواب:</p>
                <p>{generatedAnswer.answer || "لا يوجد جواب"}</p>
            </div>
            <div>
                <p class="bold">المصدر من المحاضرة:</p>
                <p>{generatedAnswer.source || "لا يوجد مصدر"}</p>
            </div>
        </div>
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
        margin-inline: auto;
    }

    .questions-explained {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 700px;
        margin-inline: auto;
    }

    button.checked {
        background-color: #a1a1a1;
        color: black;
    }
</style>