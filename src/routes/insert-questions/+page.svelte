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
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M2 على العضلة القلبية؟",
        "answers": [
            {
                "content": "زيادة دخول الكالسيوم إلى الخلية",
                "correct": false
            },
            {
                "content": "تثبيط Adenylate-Cyclase ونقص AMPc",
                "correct": true
            },
            {
                "content": "زيادة قوة تقلص العضلة القلبية",
                "correct": false
            },
            {
                "content": "زيادة إفراز الأدرينالين",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات الموسكارينية M2 على العضلة القلبية يؤدي إلى تثبيط Adenylate-Cyclase مما يقلل من مستويات AMPc، وهذا بدوره يؤدي إلى نقص دخول الكالسيوم وزيادة دخول البوتاسيوم إلى الخلية، مما يتسبب في تباطؤ القلب ونقص قوة تقلصه. هذه الآلية هي جزء من التأثيرات المثبطة للجهاز الكوليني على القلب."
    },
    {
        "body": "أي من الأدوية التالية يعتبر مقلدًا نظيرًا ودياً مباشرًا ولا يتأثر بأنزيم الأستيل كولينستيراز؟",
        "answers": [
            {
                "content": "Physostigmine",
                "correct": false
            },
            {
                "content": "Carbachol",
                "correct": true
            },
            {
                "content": "Neostigmine",
                "correct": false
            },
            {
                "content": "Edrophonium",
                "correct": false
            }
        ],
        "explanation": "Carbachol هو مقلد نظير ودى مباشر يفعل المستقبلات الموسكارينية والنيوكوتينية ولا يتأثر بأنزيم الأستيل كولينستيراز، مما يجعله ذو تأثير قوي وغير انتقائي. يستخدم بشكل محدود في علاج الزرق بسبب تأثيره المقبض للحدقة والخافض للضغط العيني."
    },
    {
        "body": "ما هي التأثيرات الموسكارينية التي يمكن توقعها من جرعة قليلة من الأستيل كولين؟",
        "answers": [
            {
                "content": "تسرع القلب وتقبض وعائي",
                "correct": false
            },
            {
                "content": "بطء القلب وتوسع أوعية",
                "correct": true
            },
            {
                "content": "تنبيه العضلات الهيكلية",
                "correct": false
            },
            {
                "content": "ارتفاع ضغط شرياني",
                "correct": false
            }
        ],
        "explanation": "التأثيرات الموسكارينية للأستيل كولين تشمل بطء القلب، توسع الأوعية مما يؤدي إلى هبوط الضغط الشرياني، وتقلص العضلات الملساء في الجهاز الهضمي والمثانة، وزيادة الإفرازات. هذه التأثيرات تظهر بالجرعات القليلة من الأستيل كولين."
    },
    {
        "body": "أي من المستقبلات التالية يعتبر مستقبلًا قنويًا شارديًا (صوديوم وكالسيوم)؟",
        "answers": [
            {
                "content": "المستقبلات الموسكارينية M1",
                "correct": false
            },
            {
                "content": "المستقبلات النيكوتينية العقدية",
                "correct": true
            },
            {
                "content": "المستقبلات الموسكارينية M2",
                "correct": false
            },
            {
                "content": "المستقبلات الموسكارينية M3",
                "correct": false
            }
        ],
        "explanation": "المستقبلات النيكوتينية هي مستقبلات قنوية شاردية (صوديوم وكالسيوم) توجد في العقد العصبية الذاتية ولب الكظر والجملة العصبية المركزية. تفعيلها يؤدي إلى زوال استقطاب يكون منشأ لسيالة عصبية في الألياف ما بعد العقد."
    },
    {
        "body": "ما هو الدواء الذي يستخدم كمضاد انسمام نوعي بالأتروبين وبالأدوية التي تملك تأثيرًا مضادًا للفعالية الكولينية؟",
        "answers": [
            {
                "content": "Neostigmine",
                "correct": false
            },
            {
                "content": "Physostigmine",
                "correct": true
            },
            {
                "content": "Edrophonium",
                "correct": false
            },
            {
                "content": "Pyridostigmine",
                "correct": false
            }
        ],
        "explanation": "Physostigmine هو مقلد نظير ودى غير مباشر يثبط الأستيل كولينستيراز ويزيد تركيز الأستيل كولين قرب مستقبلاته. يستخدم كمضاد انسمام نوعي بالأتروبين وبالأدوية التي تملك تأثيرًا مضادًا للفعالية الكولينية مثل مضادات الاكتئاب ثلاثية الحلقات ومضادات الذهان اللانموذجية."
    },
    {
        "body": "أي من التأثيرات التالية ليس من التأثيرات النيكوتينية للأستيل كولين؟",
        "answers": [
            {
                "content": "تسرع قلب",
                "correct": false
            },
            {
                "content": "تقلص العضلات الهيكلية",
                "correct": false
            },
            {
                "content": "توسع حدقة العين",
                "correct": true
            },
            {
                "content": "ارتفاع ضغط شرياني",
                "correct": false
            }
        ],
        "explanation": "التأثيرات النيكوتينية للأستيل كولين تشمل تسرع القلب، تقبض وعائي وارتفاع ضغط شرياني، تنبيه العضلات الهيكلية، وتنبيه الجملة العصبية المركزية. توسع حدقة العين هو من التأثيرات الموسكارينية وليس النيكوتينية."
    },
    {
        "body": "ما هو الدواء الذي يستخدم لعلاج الوهن العضلي الوبيل بسبب مدة تأثيره الأطول؟",
        "answers": [
            {
                "content": "Edrophonium",
                "correct": false
            },
            {
                "content": "Pyridostigmine",
                "correct": true
            },
            {
                "content": "Neostigmine",
                "correct": false
            },
            {
                "content": "Physostigmine",
                "correct": false
            }
        ],
        "explanation": "Pyridostigmine هو مثبط للأستيل كولينستيراز يستخدم في العلاج المزمن للوهن العضلي الوبيل بسبب مدة تأثيره الأطول مقارنة بغيره من الأدوية مثل Edrophonium الذي يستخدم للتشخيص بسبب تأثيره السريع والقصر."
    },
    {
        "body": "أي من الأدوية التالية يمكن أن يسبب الساد (إعتام عدسة العين) مع الاستخدام المطول؟",
        "answers": [
            {
                "content": "Carbachol",
                "correct": false
            },
            {
                "content": "Pilocarpine",
                "correct": false
            },
            {
                "content": "Isoflurophate",
                "correct": true
            },
            {
                "content": "Physostigmine",
                "correct": false
            }
        ],
        "explanation": "Isoflurophate هو مثبط غير عكوس للأستيل كولينستيراز يستخدم كمرهم عيني لعلاج الزرق المزمن. ومع ذلك، فإن استخدامه نادر لأنه يمكن أن يسبب الساد (إعتام عدسة العين) مع الاستخدام المطول."
    },
    {
        "body": "ما هو العلاج الأول للانسمام بالمبيدات الحشرية التي تثبط الأستيل كولينستيراز؟",
        "answers": [
            {
                "content": "Atropine",
                "correct": true
            },
            {
                "content": "Pralidoxime (PAM)",
                "correct": false
            },
            {
                "content": "Physostigmine",
                "correct": false
            },
            {
                "content": "Neostigmine",
                "correct": false
            }
        ],
        "explanation": "العلاج الأول للانسمام بالمبيدات الحشرية التي تثبط الأستيل كولينستيراز هو Atropine، الذي يعاكس التأثيرات الموسكارينية. يمكن أيضًا استخدام Pralidoxime (PAM) لإعادة تفعيل الأستيل كولينستيراز المثبط، لكنه لا يعتبر العلاج الأول."
    },
    {
        "body": "أي من المستقبلات التالية يوجد بشكل نوعي على الخلايا الجدارية المعدية؟",
        "answers": [
            {
                "content": "M1",
                "correct": true
            },
            {
                "content": "M2",
                "correct": false
            },
            {
                "content": "M3",
                "correct": false
            },
            {
                "content": "Nn",
                "correct": false
            }
        ],
        "explanation": "المستقبلات الموسكارينية M1 توجد بشكل نوعي على الخلايا الجدارية المعدية، حيث تلعب دورًا في تنظيم إفراز حمض المعدة. تفعيل هذه المستقبلات يؤدي إلى زيادة إفراز الحمض."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات الموسكارينية M3 على المثانة؟",
        "answers": [
            {
                "content": "تثبيط إفراغ المثانة",
                "correct": false
            },
            {
                "content": "تقلص العضلة الدافعة للبول",
                "correct": true
            },
            {
                "content": "زيادة سعة المثانة",
                "correct": false
            },
            {
                "content": "تثبيط العضلة الملساء",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات الموسكارينية M3 على المثانة يؤدي إلى تقلص العضلة الدافعة للبول، مما يساهم في عملية إفراغ المثانة. هذا التأثير هو جزء من الاستجابة الكولينية التي تزيد من نشاط العضلات الملساء في الجهاز البولي."
    },
    {
        "body": "أي من الأدوية التالية يستخدم لعلاج جفاف الفم في متلازمة جوغرن؟",
        "answers": [
            {
                "content": "Bethanechol",
                "correct": false
            },
            {
                "content": "Pilocarpine",
                "correct": true
            },
            {
                "content": "Carbachol",
                "correct": false
            },
            {
                "content": "Neostigmine",
                "correct": false
            }
        ],
        "explanation": "Pilocarpine هو مقلد نظير ودى مباشر يستخدم لعلاج جفاف الفم في متلازمة جوغرن بسبب قدرته على زيادة إفراز اللعاب. يعطى عادة على شكل أقراص فموية."
    },
    {
        "body": "ما هو الدواء الذي يستخدم لتشخيص الوهن العضلي الوبيل بسبب تأثيره السريع والقصر؟",
        "answers": [
            {
                "content": "Pyridostigmine",
                "correct": false
            },
            {
                "content": "Edrophonium",
                "correct": true
            },
            {
                "content": "Neostigmine",
                "correct": false
            },
            {
                "content": "Physostigmine",
                "correct": false
            }
        ],
        "explanation": "Edrophonium هو مثبط سريع وقصير المفعول للأستيل كولينستيراز يستخدم في تشخيص الوهن العضلي الوبيل بسبب تأثيره السريع الذي يظهر خلال دقائق ويستمر لفترة قصيرة (10-20 دقيقة)."
    },
    {
        "body": "أي من التأثيرات التالية ليس من تأثيرات Pilocarpine؟",
        "answers": [
            {
                "content": "تقلص الحدقة",
                "correct": false
            },
            {
                "content": "زيادة إفراز اللعاب",
                "correct": false
            },
            {
                "content": "ارتفاع الضغط العيني",
                "correct": true
            },
            {
                "content": "زيادة إفراز العرق",
                "correct": false
            }
        ],
        "explanation": "Pilocarpine هو مقلد نظير ودى مباشر يفعل المستقبلات الموسكارينية ويسبب تقلص الحدقة، زيادة إفراز اللعاب، العرق، والدمع، وخفض الضغط العيني. ارتفاع الضغط العيني ليس من تأثيراته بل العكس هو الصحيح."
    },
    {
        "body": "ما هو الدواء الذي يستخدم لعلاج الزرق الحاد كحالة إسعافية؟",
        "answers": [
            {
                "content": "Carbachol",
                "correct": false
            },
            {
                "content": "Pilocarpine",
                "correct": true
            },
            {
                "content": "Physostigmine",
                "correct": false
            },
            {
                "content": "Neostigmine",
                "correct": false
            }
        ],
        "explanation": "Pilocarpine يستخدم تطبيقًا موضعيًا في علاج نوبة الزرق الحادة كحالة إسعافية بسبب تأثيره السريع في تقلص الحدقة وخفض الضغط العيني."
    },
    {
        "body": "أي من الأدوية التالية لا ينفذ إلى الجملة العصبية المركزية؟",
        "answers": [
            {
                "content": "Physostigmine",
                "correct": false
            },
            {
                "content": "Neostigmine",
                "correct": true
            },
            {
                "content": "Tacrine",
                "correct": false
            },
            {
                "content": "Pilocarpine",
                "correct": false
            }
        ],
        "explanation": "Neostigmine هو مثبط للأستيل كولينستيراز لا ينفذ إلى الجملة العصبية المركزية، لذا فإن آثاره الجانبية تقتصر على التأثيرات المحيطية مثل التأثيرات الموسكارينية."
    },
    {
        "body": "ما هو الدواء الذي يستخدم لعلاج داء الزهايمر بسبب قدرته على النفاذ إلى الجملة العصبية المركزية؟",
        "answers": [
            {
                "content": "Neostigmine",
                "correct": false
            },
            {
                "content": "Tacrine",
                "correct": true
            },
            {
                "content": "Edrophonium",
                "correct": false
            },
            {
                "content": "Pyridostigmine",
                "correct": false
            }
        ],
        "explanation": "Tacrine هو مثبط للأستيل كولينستيراز ينفذ إلى الجملة العصبية المركزية ويستخدم في علاج داء الزهايمر بسبب قدرته على زيادة مستويات الأستيل كولين في الدماغ، مما قد يحسن الوظيفة الإدراكية لدى بعض المرضى."
    },
    {
        "body": "أي من المركبات التالية يعتبر مبيدًا حشريًا زراعيًا ومثبطًا غير عكوس للأستيل كولينستيراز؟",
        "answers": [
            {
                "content": "Malathion",
                "correct": false
            },
            {
                "content": "Sarin",
                "correct": false
            },
            {
                "content": "Paraxon",
                "correct": true
            },
            {
                "content": "Isoflurophate",
                "correct": false
            }
        ],
        "explanation": "Paraxon هو مبيد حشري زراعي ومثبط غير عكوس للأستيل كولينستيراز يشكل معقدًا دائمًا مع الأنزيم مما يؤدي إلى تثبيط دائم لفاعليته. يستخدم في الزراعة ولكن يمكن أن يكون سامًا للإنسان إذا تعرض له بكميات كبيرة."
    },
    {
        "body": "ما هو التأثير الرئيسي لتفعيل المستقبلات النيكوتينية العضلية؟",
        "answers": [
            {
                "content": "تثبيط العضلة الهيكلية",
                "correct": false
            },
            {
                "content": "زوال استقطاب يؤدي إلى تقلص عضلي",
                "correct": true
            },
            {
                "content": "زيادة إفراز الأدرينالين",
                "correct": false
            },
            {
                "content": "توسع الأوعية الدموية",
                "correct": false
            }
        ],
        "explanation": "تفعيل المستقبلات النيكوتينية العضلية الموجودة في اللوحة المحركة يؤدي إلى زوال استقطاب الغشاء الخلوي، مما يسبب تقلص العضلة الهيكلية. هذا التأثير هو أساس انتقال الإشارة العصبية إلى العضلات وإحداث الحركة."
    },
    {
        "body": "أي من الأدوية التالية يستخدم كمضاد انسمام لحاصرات اللوحة النهائية المحركة المانعة لزوال الاستقطاب؟",
        "answers": [
            {
                "content": "Physostigmine",
                "correct": false
            },
            {
                "content": "Neostigmine",
                "correct": true
            },
            {
                "content": "Edrophonium",
                "correct": false
            },
            {
                "content": "Pyridostigmine",
                "correct": false
            }
        ],
        "explanation": "Neostigmine يستخدم كمضاد انسمام نوعي لحاصرات اللوحة النهائية المحركة المانعة لزوال الاستقطاب مثل D-tubocurarine، حيث يعاكس التأثير الشلل للعضلات الهيكلية عن طريق زيادة تركيز الأستيل كولين في المشبك العصبي العضلي."
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