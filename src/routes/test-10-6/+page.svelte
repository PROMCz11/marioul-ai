<script>
    import { json } from "@sveltejs/kit";

    let isSaving = false;

    const generateAnswer = () => {
        isSaving = true;

        if(!question) {
            alert("Invalid data");
            return;
        }

        messages = [...messages, {
            role: 'user',
            content: question
        }]
        
        question = "";

        fetch("../api/test-10-6", {
            method: "POST",
            body: JSON.stringify({ messages })
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            if(json?.data?.error) {
                console.log("ERROR");
                return;
            }

            if(!json.status) {
                return;
            }

            messages = [...messages, json.message];
        })
    }

    let question = "";

    let messages = [];
</script>

<main class="fs-300" dir="rtl">
    <p class="bold fs-400">محادثة في مادة الصدرية</p>

    {#if messages.length}
    <div class="messages">
        {#each messages as message}
            {#if message.role === 'assistant'}
                {#if !message.parsed}
                <div class="assistant">
                    <div>
                        <p class="bold">الجواب:</p>
                        <p>{JSON.parse(message.content).answer || "لا يوجد جواب"}</p>
                    </div>
                    <div>
                        <p class="bold">المصدر من المحاضرة:</p>
                        <p>{JSON.parse(message.content).source || "لا يوجد مصدر"}</p>
                    </div>
                </div>
                {/if}
            {:else if message.role === 'user'}
            <div class="user">
                <p class="bold">{message.content}</p>
            </div>
            {/if}
        {/each}
    </div>
    {/if}

    <div class="message-input">
        {#if isSaving}
        <p class="thinking">جار التفكير بجواب ...</p>
        {:else} 
        <input bind:value={question} type="text" placeholder="اكتب سؤالك ..." />
        <button on:click={generateAnswer}>إرسال</button>
        {/if}
    </div>
</main>

<style>
    main {
        padding: 1rem;
        max-width: 700px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-inline: auto;
    }

    .assistant {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .message-input {
        display: flex;
        gap: .5rem;
    }

    .message-input > input {
        flex: 1;
    }

    .thinking {
        animation: thinking 500ms linear alternate infinite;
    }

    @keyframes thinking {
        0% {
            opacity: 1;
        }

        100% {
            opacity: .5;
        }
    }

    .messages > div {
        border: 1px solid #a1a1a166;
        padding: 1rem;
    }

    .messages .user {
        background-color: #1a1a1a;
    }
</style>