<script>
    import { onMount } from 'svelte';

    // Form inputs
    let courseID, lectureNumber;
    let rawQuestions;
    let professorName;
    let bankID, round;
    let systemPassword;

    // Batch management
    let batches = $state([]);
    let nextBatchId = 1;

    // Batch timer tracking
    let timers = new Map();

    onMount(() => {
        // Start timer updates
        const interval = setInterval(() => {
            for (const [batchId, startTime] of timers) {
                const batch = batches.find(b => b.id === batchId);
                if (batch && batch.status === 'generating') {
                    batch.elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    // Cleanup timers when component unmounts
    $effect(() => {
        for (const batch of batches) {
            if (batch.status !== 'generating' && timers.has(batch.id)) {
                timers.delete(batch.id);
            }
        }
    });

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

        if(!systemPassword) {
            alert("Enter a valid system password");
            return;
        }

        // Create new batch
        const batchId = nextBatchId++;
        const batch = {
            id: batchId,
            courseID,
            lectureNumber,
            rawQuestions,
            professorName,
            bankID,
            round,
            status: 'generating',
            elapsedTime: 0,
            generatedQuestions: [],
            timestamp: Date.now()
        };

        batches = [...batches, batch];
        timers.set(batchId, Date.now());

        try {
            const res = await fetch('/api/insert-questions', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseID,
                    lectureNumber,
                    rawQuestions,
                    bankID,
                    round,
                    systemPassword,
                    professorName
                })
            });
            
            const json = await res.json();
            console.log(json);

            // Update batch status
            const batchIndex = batches.findIndex(b => b.id === batchId);
            if (batchIndex !== -1) {
                if (json?.success) {
                    batches[batchIndex] = {
                        ...batches[batchIndex],
                        status: 'generated',
                        generatedQuestions: json.generatedQuestions
                    };
                } else {
                    batches[batchIndex] = {
                        ...batches[batchIndex],
                        status: 'failed'
                    };
                }
            }
        } catch (err) {
            console.log(err.message);
            // Update batch status to failed
            const batchIndex = batches.findIndex(b => b.id === batchId);
            if (batchIndex !== -1) {
                batches[batchIndex] = {
                    ...batches[batchIndex],
                    status: 'failed'
                };
            }
        }
    };

    const insertBatch = async (batchId) => {
        const batch = batches.find(b => b.id === batchId);
        if (!batch || batch.status !== 'generated' || !batch.generatedQuestions?.length) {
            alert("No questions to insert");
            return;
        }

        if(!systemPassword) {
            alert("Enter a valid system password");
            return;
        }

        try {
            batch.isInserting = true;
            const res = await fetch('/api/insert-questions/insert', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ generatedQuestions: batch.generatedQuestions, systemPassword })
            });
            
            const json = await res.json();
            console.log(json);

            if(!json?.status) {
                alert(json?.message || "Insertion failed");
                return;
            }

            alert("Insertion was successful");
            batch.isInserting = false;
            
            // Update batch status to inserted
            const batchIndex = batches.findIndex(b => b.id === batchId);
            if (batchIndex !== -1) {
                batches[batchIndex] = {
                    ...batches[batchIndex],
                    status: 'inserted',
                    expanded: false
                };
            }
        } catch (err) {
            alert(err.message || "Insertion failed");
            batch.isInserting = false;
        }
    };

    // Function to add a new question to a batch
    const addQuestionToBatch = (batchId, index) => {
        const batch = batches.find(b => b.id === batchId);
        if (batch) {
            const newQuestion = {
                body: "",
                answers: [
                    { content: "", correct: false },
                    { content: "", correct: false },
                    { content: "", correct: false },
                    { content: "", correct: false }
                ],
                explanation: ""
            };

            const newQuestions = [...batch.generatedQuestions];
            newQuestions.splice(index + 1, 0, newQuestion);
            batch.generatedQuestions = newQuestions;
        }
    };

    // Function to remove a question from a batch
    const removeQuestionFromBatch = (batchId, index) => {
        const batch = batches.find(b => b.id === batchId);
        if (batch) {
            const newQuestions = [...batch.generatedQuestions];
            newQuestions.splice(index, 1);
            batch.generatedQuestions = newQuestions;
        }
    };

    // Function to add an answer to a question
    const addAnswerToQuestion = (batchId, questionIndex) => {
        const batch = batches.find(b => b.id === batchId);
        if (batch) {
            const question = batch.generatedQuestions[questionIndex];
            if (question) {
                question.answers = [...question.answers, { content: "", correct: false }];
            }
        }
    };

    // Function to remove an answer from a question
    const removeAnswerFromQuestion = (batchId, questionIndex, answerIndex) => {
        const batch = batches.find(b => b.id === batchId);
        if (batch) {
            const question = batch.generatedQuestions[questionIndex];
            if (question && question.answers.length > 1) { // Prevent removing all answers
                const newAnswers = [...question.answers];
                newAnswers.splice(answerIndex, 1);
                question.answers = newAnswers;
            }
        }
    };

    // Function to retry generating a failed batch
    const retryBatch = async (batchId) => {
        const batch = batches.find(b => b.id === batchId);
        if (!batch || batch.status !== 'failed') return;

        batch.status = 'generating';
        batch.elapsedTime = 0;
        timers.set(batchId, Date.now());

        try {
            const res = await fetch('/api/insert-questions', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseID: batch.courseID,
                    lectureNumber: batch.lectureNumber,
                    rawQuestions: batch.rawQuestions,
                    bankID: batch.bankID,
                    round: batch.round,
                    systemPassword,
                    professorName: batch.professorName
                })
            });
            
            const json = await res.json();
            console.log(json);

            const batchIndex = batches.findIndex(b => b.id === batchId);
            if (batchIndex !== -1) {
                if (json?.success) {
                    batches[batchIndex] = {
                        ...batches[batchIndex],
                        status: 'generated',
                        generatedQuestions: json.generatedQuestions
                    };
                } else {
                    batches[batchIndex] = {
                        ...batches[batchIndex],
                        status: 'failed'
                    };
                }
            }
        } catch (err) {
            console.log(err.message);
            const batchIndex = batches.findIndex(b => b.id === batchId);
            if (batchIndex !== -1) {
                batches[batchIndex] = {
                    ...batches[batchIndex],
                    status: 'failed'
                };
            }
        }
    };
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
    <div>
        <p>Professor name *Optional but has to be exact</p>
        <p>Follow this format:</p>
        <p>الدكتور الفلان الفلاني</p>
        <p>الدكتورة الفلانة الفلانية</p>
        <input bind:value={professorName} type="text" placeholder="Write something ...">
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
    <div>
        <p>System Password</p>
        <input bind:value={systemPassword} type="text" placeholder="Enter a valid password ...">
    </div>
    
    <div>
        <button on:click={generate}>Generate New Batch ✨</button>
    </div>

    <!-- Batches list -->
    <div class="batches-list">
        {#each batches.slice().sort((a, b) => a.timestamp - b.timestamp) as batch (batch.id)}
            <div class="batch-item">
                <div class="batch-header" on:click={() => batch.expanded = !batch.expanded}>
                    <span class="batch-id">Batch {batch.id}</span>
                    <span class={`status ${batch.status}`} 
                          title={batch.status === 'generating' ? new Date(batch.timestamp).toLocaleString() : ''}>
                        {#if batch.status === 'generating'}
                            {batch.elapsedTime}s
                        {:else if batch.status === 'generated'}
                            GENERATED
                        {:else if batch.status === 'failed'}
                            FAILED
                        {:else if batch.status === 'inserted'}
                            INSERTED
                        {/if}
                    </span>
                    <span class="expand-toggle">{batch.expanded ? '▼' : '▶'}</span>
                </div>
                
                {#if batch.expanded}
                    <div class="batch-content">
                        <!-- Batch details -->
                        <div class="batch-details">
                            <p>Course ID: {batch.courseID}</p>
                            <p>Lecture Number: {batch.lectureNumber}</p>
                            <p>Bank ID: {batch.bankID}</p>
                            <p>Round: {batch.round}</p>
                            {#if batch.professorName}
                                <p>Professor: {batch.professorName}</p>
                            {/if}
                        </div>
                        
                        <!-- Raw questions button -->
                        <div class="raw-questions-section">
                            <button on:click={() => {
                                batch.showRaw = !batch.showRaw;
                                if (batch.showRaw) {
                                    batch.showGenerated = false;
                                }
                            }}>
                                {batch.showRaw ? 'Hide Raw Questions' : 'Show Raw Questions'}
                            </button>
                            
                            {#if batch.showRaw}
                                <div class="raw-questions-display">
                                    <textarea 
                                        readonly 
                                        rows="10" 
                                        cols="60"
                                        value={batch.rawQuestions}
                                    ></textarea>
                                </div>
                            {/if}
                        </div>
                        
                        <!-- Generated questions (if available) -->
                        {#if (batch.status === 'generated' || batch.status === 'failed' || batch.status === 'inserted') && !batch.showRaw}
                            <div class="generated-questions" dir="rtl">
                                {#each batch.generatedQuestions as question, index}
                                    <div class="question-item">
                                        <div class="question-header">
                                            <p class="body bold">{index + 1}.</p>
                                            <button on:click={() => removeQuestionFromBatch(batch.id, index)} class="remove-btn">Remove</button>
                                        </div>
                                        <input bind:value={question.body} type="text" placeholder="Question text...">
                                        
                                        {#each question.answers as answer, ansIndex}
                                            <div class="answer-row">
                                                <span class="answer-label">
                                                    {#if ansIndex === 0}A
                                                    {:else if ansIndex === 1}B
                                                    {:else if ansIndex === 2}C
                                                    {:else if ansIndex === 3}D
                                                    {:else if ansIndex === 4}E
                                                    {:else}X{/if}
                                                </span>
                                                <input bind:value={answer.content} type="text" placeholder="Answer...">
                                                <button 
                                                    class:correct={answer.correct} 
                                                    on:click={() => {
                                                        question.answers.forEach(a => a.correct = false);
                                                        answer.correct = true;
                                                    }}
                                                >
                                                    {answer.correct ? "صحيح" : "خطأ"}
                                                </button>
                                                <button 
                                                    on:click={() => removeAnswerFromQuestion(batch.id, index, ansIndex)}
                                                    class="remove-answer-btn"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        {/each}
                                        
                                        <button 
                                            on:click={() => addAnswerToQuestion(batch.id, index)}
                                            class="add-answer-btn"
                                        >
                                            Add Answer
                                        </button>
                                        
                                        <div class="explanation-section">
                                            <p>الشرح</p>
                                            <textarea rows="3" bind:value={question.explanation} placeholder="Explanation..."></textarea>
                                        </div>
                                    </div>
                                    
                                    <!-- Add question button after each question -->
                                    <button 
                                        class="add-question-btn" 
                                        on:click={() => addQuestionToBatch(batch.id, index)}
                                    >
                                        Add Question After This
                                    </button>
                                {/each}
                            </div>
                            
                            <!-- Batch actions -->
                            <div class="batch-actions">
                                {#if batch.status === 'generated'}
                                    {#if batch.isInserting}
                                        <p class="loading">Inserting...</p>
                                    {:else}
                                        <button on:click={() => insertBatch(batch.id)}>Insert Batch ⬇️</button>
                                    {/if}
                                {:else if batch.status === 'failed'}
                                    <button on:click={() => retryBatch(batch.id)}>Retry Generation</button>
                                {/if}
                            </div>
                        {/if}
                    </div>
                {/if}
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

    .batches-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .batch-item {
        border: 1px solid #a1a1a166;
        padding: 0.5rem;
    }

    .batch-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem;
        background-color: #1a1a1a;
    }

    .batch-id {
        font-weight: bold;
    }

    .status {
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
    }

    .status.generating {
        background-color: #ffaa0033;
        color: #ffaa00;
    }

    .status.generated {
        background-color: #00aa0033;
        color: #00aa00;
    }

    .status.failed {
        background-color: #aa000033;
        color: #aa0000;
    }
    
    .status.inserted {
        background-color: #00aaff33;
        color: #00aaff;
    }

    .expand-toggle {
        font-size: 0.8rem;
    }

    .batch-content {
        padding: 1rem 0.5rem;
    }

    .batch-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .raw-questions-section {
        margin-bottom: 1rem;
    }

    .raw-questions-display {
        margin-top: 0.5rem;
    }

    .raw-questions-display textarea {
        width: 100%;
        font-family: monospace;
        resize: vertical;
    }

    .generated-questions {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-top: 1rem;
    }

    .question-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid #a1a1a133;
        background-color: #0a0a0a;
    }

    .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .question-header .body {
        margin: 0;
    }

    .remove-btn {
        padding: 0.1rem 0.3rem;
        font-size: 0.8rem;
        background-color: #aa000033;
        color: #aa0000;
    }

    .remove-btn:hover {
        background-color: #aa0000;
        color: white;
    }

    .answer-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .answer-label {
        min-width: 2rem;
        font-weight: bold;
    }

    .remove-answer-btn {
        padding: 0.1rem 0.3rem;
        font-size: 0.8rem;
        background-color: #aa000033;
        color: #aa0000;
    }

    .remove-answer-btn:hover {
        background-color: #aa0000;
        color: white;
    }

    .add-answer-btn {
        margin-top: 0.5rem;
        background-color: #0055aa33;
        color: #0088ff;
        padding: 0.2rem 0.4rem;
        font-size: 0.8rem;
        align-self: flex-start;
    }

    .add-answer-btn:hover {
        background-color: #0088ff;
        color: black;
    }

    .explanation-section {
        margin-top: 0.5rem;
    }

    .explanation-section p {
        margin: 0.5rem 0 0.2rem 0;
    }

    .add-question-btn {
        margin-top: 1rem;
        background-color: #0055aa33;
        color: #0088ff;
        padding: 0.3rem 0.6rem;
        font-size: 0.9rem;
    }

    .add-question-btn:hover {
        background-color: #0088ff;
        color: black;
    }

    .batch-actions {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-end;
    }

    .correct {
        color: green;
    }

    .loading {
        animation: loading 500ms linear alternate infinite;
        padding: 0.5rem;
        text-align: center;
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