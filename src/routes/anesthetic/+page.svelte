<script>
    let isSaving = false;

    const generateAnswer = () => {
        isSaving = true;

        if(!question) {
            alert("Invalid data");
            return;
        }


        generatedAnswer = null;

        fetch("../api/anesthetic", {
            method: "POST",
            body: JSON.stringify({ question })
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            if(json?.data?.error) {
                console.log("ERROR");
                return;
            }
            generatedAnswer = json.data;
        })
    }

    let generatedAnswer = null;

    let question = "";
</script>

<main>
    <div class="settings">
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
</style>