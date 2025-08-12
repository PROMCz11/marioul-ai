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
        "body": "أي من الأدوية التالية يعتبر مقلدًا مباشرًا لنشاط نظير الودي ويستخدم لعلاج الزرق؟",
        "answers": [
            {
                "content": "Atropine",
                "correct": false
            },
            {
                "content": "Pilocarpine",
                "correct": true
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
        "explanation": "Pilocarpine هو مقلد مباشر لنشاط نظير الودي، يعمل على تنشيط المستقبلات الموسكارينية، مما يؤدي إلى تقلص العضلة المقبضة للحدقة وتوسع قناة شليم، مما يسهل تصريف الخلط المائي ويخفض الضغط العيني. يستخدم في علاج الزرق."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M2 على القلب؟",
        "answers": [
            {
                "content": "زيادة معدل ضربات القلب",
                "correct": false
            },
            {
                "content": "تباطؤ القلب ونقص قوة تقلصه",
                "correct": true
            },
            {
                "content": "توسع الأوعية الدموية",
                "correct": false
            },
            {
                "content": "زيادة إفراز اللعاب",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات الموسكارينية M2 على العضلة القلبية يؤدي إلى تثبيط أنزيم adenylate cyclase، مما يقلل من تركيز cAMP، ويؤدي إلى تباطؤ القلب ونقص قوة تقلصه."
    },
    {
        "body": "أي من الأدوية التالية يعتبر مثبطًا عكوسًا لأنزيم الأستيل كولينستيراز ويستخدم في علاج الوهن العضلي الوبيل؟",
        "answers": [
            {
                "content": "Neostigmine",
                "correct": true
            },
            {
                "content": "Atropine",
                "correct": false
            },
            {
                "content": "Pilocarpine",
                "correct": false
            },
            {
                "content": "Propranolol",
                "correct": false
            }
        ],
        "explanation": "Neostigmine هو مثبط عكوس لأنزيم الأستيل كولينستيراز، مما يزيد من تركيز الأستيل كولين في المشبك العصبي العضلي، ويستخدم في علاج الوهن العضلي الوبيل لتحسين قوة العضلات."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات النيكوتينية العقدية؟",
        "answers": [
            {
                "content": "توسع الحدقات",
                "correct": false
            },
            {
                "content": "زوال استقطاب العقدة العصبية",
                "correct": true
            },
            {
                "content": "تباطؤ القلب",
                "correct": false
            },
            {
                "content": "تقلص العضلات الملساء",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات النيكوتينية العقدية يؤدي إلى زوال استقطاب العقدة العصبية، مما يولد سيالة عصبية في الألياف ما بعد العقدة."
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
                "content": "Pilocarpine",
                "correct": false
            }
        ],
        "explanation": "Physostigmine هو مثبط لأنزيم الأستيل كولينستيراز، مما يزيد من تركيز الأستيل كولين في المشبك العصبي، ويعاكس التأثيرات المضادة للكولين للأتروبين."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M3 على العضلات الملساء؟",
        "answers": [
            {
                "content": "ارتخاء العضلات الملساء",
                "correct": false
            },
            {
                "content": "تقلص العضلات الملساء",
                "correct": true
            },
            {
                "content": "زيادة معدل ضربات القلب",
                "correct": false
            },
            {
                "content": "توسع الأوعية الدموية",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات الموسكارينية M3 على العضلات الملساء يؤدي إلى تقلصها، وذلك عبر تفعيل phospholipase C وزيادة تركيز الكالسيوم داخل الخلية."
    },
    {
        "body": "أي من الأدوية التالية يعتبر مقلدًا غير مباشر لنشاط نظير الودي ويستخدم في علاج الزرق المزمن؟",
        "answers": [
            {
                "content": "Pilocarpine",
                "correct": false
            },
            {
                "content": "Physostigmine",
                "correct": true
            },
            {
                "content": "Atropine",
                "correct": false
            },
            {
                "content": "Propranolol",
                "correct": false
            }
        ],
        "explanation": "Physostigmine هو مثبط لأنزيم الأستيل كولينستيراز، مما يزيد من تركيز الأستيل كولين في المشبك العصبي، ويستخدم في علاج الزرق المزمن لخفض الضغط العيني."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات النيكوتينية العضلية؟",
        "answers": [
            {
                "content": "تباطؤ القلب",
                "correct": false
            },
            {
                "content": "تقلص العضلات الهيكلية",
                "correct": true
            },
            {
                "content": "توسع الأوعية الدموية",
                "correct": false
            },
            {
                "content": "زيادة إفراز اللعاب",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات النيكوتينية العضلية في اللوحة المحركة يؤدي إلى زوال استقطاب العضلة الهيكلية، مما يسبب تقلصها."
    },
    {
        "body": "أي من الأدوية التالية يستخدم لعلاج احتباس البول الناجم عن وهن المثانة؟",
        "answers": [
            {
                "content": "Bethanechol",
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
        "explanation": "Bethanechol هو مقلد مباشر لنشاط نظير الودي، يعمل على تنشيط المستقبلات الموسكارينية في المثانة، مما يؤدي إلى تقلص العضلة الدافعة للبول وارتخاء المصرة المثانية، ويستخدم في علاج احتباس البول الناجم عن وهن المثانة."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M1 على الخلايا الجدارية المعدية؟",
        "answers": [
            {
                "content": "زيادة الإفراز الحمضي للمعدة",
                "correct": true
            },
            {
                "content": "تباطؤ القلب",
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
        "explanation": "تفعيل المستقبلات الموسكارينية M1 على الخلايا الجدارية المعدية يؤدي إلى زيادة الإفراز الحمضي للمعدة، وذلك عبر تفعيل phospholipase C وزيادة تركيز الكالسيوم داخل الخلية."
    },
    {
        "body": "أي من الأدوية التالية يعتبر مثبطًا غير عكوس لأنزيم الأستيل كولينستيراز ويستخدم كمبيد حشري؟",
        "answers": [
            {
                "content": "Physostigmine",
                "correct": false
            },
            {
                "content": "Neostigmine",
                "correct": false
            },
            {
                "content": "Malathion",
                "correct": true
            },
            {
                "content": "Pilocarpine",
                "correct": false
            }
        ],
        "explanation": "Malathion هو مثبط غير عكوس لأنزيم الأستيل كولينستيراز، يشكل معقدًا دائمًا مع الأنزيم، ويستخدم كمبيد حشري."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M3 على الغدد الخارجية الإفراز؟",
        "answers": [
            {
                "content": "تقليل الإفرازات",
                "correct": false
            },
            {
                "content": "زيادة الإفرازات",
                "correct": true
            },
            {
                "content": "تباطؤ القلب",
                "correct": false
            },
            {
                "content": "توسع الأوعية الدموية",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات الموسكارينية M3 على الغدد الخارجية الإفراز يؤدي إلى زيادة الإفرازات، مثل اللعاب والعرق والدموع."
    },
    {
        "body": "أي من الأدوية التالية يستخدم لعلاج جفاف الفم في متلازمة جوغرن؟",
        "answers": [
            {
                "content": "Pilocarpine",
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
        "explanation": "Pilocarpine هو مقلد مباشر لنشاط نظير الودي، يعمل على تنشيط المستقبلات الموسكارينية في الغدد اللعابية، مما يؤدي إلى زيادة إفراز اللعاب، ويستخدم في علاج جفاف الفم في متلازمة جوغرن."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات النيكوتينية في لب الكظر؟",
        "answers": [
            {
                "content": "تحرير الأدرينالين",
                "correct": true
            },
            {
                "content": "تباطؤ القلب",
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
        "explanation": "تفعيل المستقبلات النيكوتينية في لب الكظر يؤدي إلى تحرير الأدرينالين، مما يزيد من معدل ضربات القلب ويرفع التوتر الشرياني."
    },
    {
        "body": "أي من الأدوية التالية يستخدم لتشخيص الوهن العضلي الوبيل؟",
        "answers": [
            {
                "content": "Edrophonium",
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
                "content": "Pilocarpine",
                "correct": false
            }
        ],
        "explanation": "Edrophonium هو مثبط سريع وقصير المفعول لأنزيم الأستيل كولينستيراز، يستخدم في تشخيص الوهن العضلي الوبيل بسبب تأثيره السريع في تحسين قوة العضلات."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M1 في الدماغ؟",
        "answers": [
            {
                "content": "زيادة اليقظة",
                "correct": true
            },
            {
                "content": "تباطؤ القلب",
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
        "explanation": "تفعيل المستقبلات الموسكارينية M1 في الدماغ يؤدي إلى زيادة اليقظة والانتباه، وذلك عبر تفعيل مسارات الإشارات داخل الخلايا العصبية."
    },
    {
        "body": "أي من الأدوية التالية يستخدم لعلاج داء الزهايمر؟",
        "answers": [
            {
                "content": "Tacrine",
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
        "explanation": "Tacrine هو مثبط لأنزيم الأستيل كولينستيراز، يزيد من تركيز الأستيل كولين في الدماغ، ويستخدم في علاج داء الزهايمر لتحسين الوظائف المعرفية."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M3 على العين؟",
        "answers": [
            {
                "content": "توسع الحدقة",
                "correct": false
            },
            {
                "content": "تقلص الحدقة",
                "correct": true
            },
            {
                "content": "زيادة ضغط العين",
                "correct": false
            },
            {
                "content": "ارتخاء العضلة الهدبية",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات الموسكارينية M3 على العين يؤدي إلى تقلص العضلة المقبضة للحدقة، مما يسبب تقلص الحدقة وتوسع قناة شليم، مما يخفض الضغط العيني."
    },
    {
        "body": "أي من الأدوية التالية يستخدم كمضاد للانسمام بالمبيدات الحشرية؟",
        "answers": [
            {
                "content": "Atropine",
                "correct": true
            },
            {
                "content": "Neostigmine",
                "correct": false
            },
            {
                "content": "Pilocarpine",
                "correct": false
            },
            {
                "content": "Propranolol",
                "correct": false
            }
        ],
        "explanation": "Atropine هو مضاد للكولين، يعمل على منع تأثير الأستيل كولين على المستقبلات الموسكارينية، ويستخدم كمضاد للانسمام بالمبيدات الحشرية التي تثبط أنزيم الأستيل كولينستيراز."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M3 على القصبات الهوائية؟",
        "answers": [
            {
                "content": "توسع القصبات",
                "correct": false
            },
            {
                "content": "تقلص القصبات",
                "correct": true
            },
            {
                "content": "زيادة إفراز المخاط",
                "correct": false
            },
            {
                "content": "تباطؤ القلب",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات الموسكارينية M3 على القصبات الهوائية يؤدي إلى تقلص العضلات الملساء فيها، مما يسبب تضيق القصبات."
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