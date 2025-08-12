<script>
    let courseID, lectureNumber;
    let rawQuestions;

    let professorName;

    let bankID, round;

    let isGenerating = false;
    let isInserting = false;

    let systemPassword;

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
                    round,
                    systemPassword,
                    professorName
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

        if(!systemPassword) {
            alert("Enter a valid system password");
            return;
        }

        try {
            isInserting = true;
            const res = await fetch('/api/insert-questions/insert', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ generatedQuestions, systemPassword })
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

    generatedQuestions = [
    {
        "body": "ما هو التأثير الرئيسي لتفعيل الجملة العصبية الودية على القلب؟",
        "answers": [
            {
                "content": "زيادة معدل ضربات القلب",
                "correct": true
            },
            {
                "content": "تقليل معدل ضربات القلب",
                "correct": false
            },
            {
                "content": "عدم تأثير على معدل ضربات القلب",
                "correct": false
            },
            {
                "content": "تقلص عضلة القلب فقط",
                "correct": false
            }
        ],
        "explanation": "تفعيل الجملة العصبية الودية يؤدي إلى زيادة معدل ضربات القلب بسبب إفراز النورأدرينالين من الألياف بعد العقدية، مما يحفز مستقبلات بيتا الأدرينالية في القلب. هذا يزيد من سرعة التوصيل الأذيني البطيني وقوة تقلص العضلة القلبية، مما يؤدي إلى زيادة معدل ضربات القلب."
    },
    {
        "body": "أي من الأدوية التالية يعتبر مقلدًا مباشرًا للأستيل كولين ويستخدم لعلاج الزرق؟",
        "answers": [
            {
                "content": "Carbachol",
                "correct": true
            },
            {
                "content": "Atropine",
                "correct": false
            },
            {
                "content": "Propranolol",
                "correct": false
            },
            {
                "content": "Epinephrine",
                "correct": false
            }
        ],
        "explanation": "Carbachol هو مقلد مباشر للأستيل كولين يعمل على تفعيل المستقبلات الموسكارينية والنيوكوتينية. يستخدم بشكل رئيسي في علاج الزرق بسبب قدرته على تقليص الحدقة وتقليل الضغط داخل العين، مما يسهل تصريف الخلط المائي."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M2 على القلب؟",
        "answers": [
            {
                "content": "تباطؤ القلب ونقص قوة تقلصه",
                "correct": true
            },
            {
                "content": "تسارع القلب وزيادة قوة تقلصه",
                "correct": false
            },
            {
                "content": "توسع الأوعية الدموية",
                "correct": false
            },
            {
                "content": "تقلص العضلات الملساء",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات الموسكارينية M2 على العضلة القلبية يؤدي إلى تثبيط إنزيم adenylate cyclase، مما يقلل من مستويات cAMP ويؤدي إلى تباطؤ القلب ونقص قوة تقلصه. هذا التأثير هو جزء من استجابة الجسم 'للراحة والهضم' التي تنظمها الجملة العصبية نظيرة الودية."
    },
    {
        "body": "أي من الأدوية التالية يستخدم كمضاد للانسمام بالأتروبين؟",
        "answers": [
            {
                "content": "Physostigmine",
                "correct": true
            },
            {
                "content": "Neostigmine",
                "correct": false
            },
            {
                "content": "Atropine",
                "correct": false
            },
            {
                "content": "Pralidoxime",
                "correct": false
            }
        ],
        "explanation": "Physostigmine هو مثبط عكوس لأنزيم الأستيل كولين استيراز، مما يزيد من تركيز الأستيل كولين في المشابك العصبية. يستخدم كمضاد للانسمام بالأتروبين لأنه يعاكس التأثيرات المضادة للكولين للأتروبين عن طريق زيادة النشاط الكوليني."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات النيكوتينية العقدية؟",
        "answers": [
            {
                "content": "زوال استقطاب العقد العصبية الذاتية",
                "correct": true
            },
            {
                "content": "تقلص العضلات الهيكلية",
                "correct": false
            },
            {
                "content": "تباطؤ القلب",
                "correct": false
            },
            {
                "content": "توسع القصبات الهوائية",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات النيكوتينية العقدية يؤدي إلى زوال استقطاب العقد العصبية الذاتية، مما يولد سيالة عصبية في الألياف ما بعد العقدية. هذا يسمح بنقل الإشارات العصبية في الجملة العصبية الذاتية، سواء الودية أو نظيرة الودية."
    }
]
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
                <p class="body bold">{index + 1}.</p>
                <input bind:value={question.body} type="text">
                {#each question.answers as answer, index}
                <div>
                    {#if index === 0}
                        A
                    {:else if index === 1}
                        B
                    {:else if index === 2}
                        C
                    {:else if index === 3}
                        D
                    {:else if index === 4}
                        E
                    {:else}
                        X
                    {/if}
                    <input bind:value={answer.content} type="text">
                    <button class:correct={answer.correct} on:click={() => {
                        question.answers.forEach(a => a.correct = false);
                        answer.correct = true;
                        generatedQuestions = generatedQuestions;
                    }}>{answer.correct ? "صحيح" : "خطأ"}</button>
                </div>
                {/each}
                الشرح
                <textarea rows="3" bind:value={question.explanation}></textarea>
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

    .generated-questions input,
    .generated-questions textarea {
        width: 100%;
    }

    .generated-questions > div > input:first-of-type {
        font-size: 1rem;
    }

    .generated-questions > div {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .generated-questions > div p:last-of-type {
        margin-top: .5rem;
    }

    .correct {
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