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

    // let questionsResult = [];
    let explanationsResult = [
    {
        "body": "يؤثر التركيب الكيميائي للهرمون في كل ما يلي عدا",
        "answers": {
            "a": {
                "content": "موضع المستقبل",
                "correct": false
            },
            "b": {
                "content": "شكل جوالنه في الدم (حر أو مرتبط)",
                "correct": false
            },
            "c": {
                "content": "ارتباطه بالمستقبل عكوس او غير عكوس.",
                "correct": false
            },
            "d": {
                "content": "مدة نصف عمره بالدم",
                "correct": true
            }
        },
        "explanation": "التركيب الكيميائي للهرمون يؤثر في موضع المستقبل، وشكله في الدم، وطبيعة ارتباطه بالمستقبل، لكنه لا يؤثر مباشرة في مدة نصف عمره بالدم، والتي تتحدد بعوامل أخرى مثل معدل التصفية الكلوية والاستقلاب الكبدي. مدة نصف العمر تعتمد على عوامل خارجية مثل الارتباط بالبروتينات الناقلة ومعدل التخلص من الهرمون، وليس على التركيب الكيميائي الداخلي للهرمون نفسه."
    },
    {
        "body": "أي من الهرمونات التالية يعتبر هرمونًا عصبيًا غديًا؟",
        "answers": {
            "a": {
                "content": "الأنسولين",
                "correct": false
            },
            "b": {
                "content": "الثيروكسين",
                "correct": false
            },
            "c": {
                "content": "ADH",
                "correct": true
            },
            "d": {
                "content": "الكورتيزول",
                "correct": false
            }
        },
        "explanation": "ADH (الهرمون المضاد لإدرار البول) يعتبر هرمونًا عصبيًا غديًا لأنه يفرز من الخلايا العصبية في الوطاء وينتقل إلى النخامى الخلفية حيث يتم إفرازه في الدم. الأنسولين والثيروكسين والكورتيزول تفرز من غدد صماء وليس لها علاقة مباشرة بالخلايا العصبية."
    },
    {
        "body": "أي من المستقبلات الهرمونية يتوضع داخل النواة؟",
        "answers": {
            "a": {
                "content": "مستقبلات الهرمونات الببتيدية",
                "correct": false
            },
            "b": {
                "content": "مستقبلات الكاتيكولامينات",
                "correct": false
            },
            "c": {
                "content": "مستقبلات الهرمونات الدرقية",
                "correct": true
            },
            "d": {
                "content": "مستقبلات البروستاغلاندينات",
                "correct": false
            }
        },
        "explanation": "مستقبلات الهرمونات الدرقية تتوضع داخل النواة لأن هذه الهرمونات قادرة على عبور الغشاء الخلوي والارتباط بمستقبلاتها النووية مباشرة. في المقابل، مستقبلات الهرمونات الببتيدية والكاتيكولامينات والبروستاغلاندينات تتوضع على سطح الخلية لأنها لا تستطيع عبور الغشاء الخلوي بسهولة."
    },
    {
        "body": "أي من الهرمونات التالية يفرز من النخامى الأمامية؟",
        "answers": {
            "a": {
                "content": "ADH",
                "correct": false
            },
            "b": {
                "content": "الأوكسيتوسين",
                "correct": false
            },
            "c": {
                "content": "FSH",
                "correct": true
            },
            "d": {
                "content": "الكورتيزول",
                "correct": false
            }
        },
        "explanation": "FSH (الهرمون المنبه للجريب) يفرز من النخامى الأمامية، بينما ADH والأوكسيتوسين يفرزان من النخامى الخلفية. الكورتيزول يفرز من قشرة الكظر وليس من النخامى."
    },
    {
        "body": "أي من العوامل التالية يحرض إفراز البرولاكتين؟",
        "answers": {
            "a": {
                "content": "الدوبامين",
                "correct": false
            },
            "b": {
                "content": "TRH",
                "correct": true
            },
            "c": {
                "content": "السوماتوستاتين",
                "correct": false
            },
            "d": {
                "content": "GHIH",
                "correct": false
            }
        },
        "explanation": "TRH (هرمون إفراز الثيروتروبين) يحرض إفراز البرولاكتين من النخامى الأمامية. الدوبامين يثبط إفراز البرولاكتين، بينما السوماتوستاتين وGHIH (هرمون تثبيط هرمون النمو) ليس لهما تأثير مباشر على إفراز البرولاكتين."
    },
    {
        "body": "أي من الأورام النخامية التالية هو الأكثر شيوعًا؟",
        "answers": {
            "a": {
                "content": "الورم المفرز لـ ACTH",
                "correct": false
            },
            "b": {
                "content": "الورم المفرز لـ GH",
                "correct": false
            },
            "c": {
                "content": "الورم المفرز للبرولاكتين",
                "correct": true
            },
            "d": {
                "content": "الورم المفرز لـ TSH",
                "correct": false
            }
        },
        "explanation": "الورم المفرز للبرولاكتين هو الأكثر شيوعًا بين الأورام النخامية، حيث يشكل حوالي 45% من الحالات. الأورام المفرزة لـ ACTH وGH وTSH أقل شيوعًا."
    },
    {
        "body": "أي من الأعراض التالية هو الأكثر شيوعًا في فرط برولاكتين الدم لدى الذكور؟",
        "answers": {
            "a": {
                "content": "ثر الحليب",
                "correct": false
            },
            "b": {
                "content": "انقطاع الطمث",
                "correct": false
            },
            "c": {
                "content": "ضعف الانتصاب",
                "correct": true
            },
            "d": {
                "content": "زيادة الوزن",
                "correct": false
            }
        },
        "explanation": "ضعف الانتصاب هو العرض الأكثر شيوعًا في فرط برولاكتين الدم لدى الذكور، بسبب تثبيط إفراز الهرمونات الجنسية. ثر الحليب وانقطاع الطمث هي أعراض أكثر شيوعًا لدى الإناث، بينما زيادة الوزن ليس عرضًا مباشرًا لفرط برولاكتين الدم."
    },
    {
        "body": "أي من الأدوية التالية يستخدم في علاج فرط برولاكتين الدم؟",
        "answers": {
            "a": {
                "content": "الليفوثيروكسين",
                "correct": false
            },
            "b": {
                "content": "الميتفورمين",
                "correct": false
            },
            "c": {
                "content": "البروموكريبتين",
                "correct": true
            },
            "d": {
                "content": "الهيدروكورتيزون",
                "correct": false
            }
        },
        "explanation": "البروموكريبتين، وهو منبه لمستقبلات الدوبامين، يستخدم في علاج فرط برولاكتين الدم لأنه يثبط إفراز البرولاكتين من النخامى الأمامية. ليفوثيروكسين والميتفورمين والهيدروكورتيزون ليس لهم دور في علاج هذه الحالة."
    },
    {
        "body": "أي من الهرمونات التالية له دور في تحفيز إفراز الحليب من الثدي؟",
        "answers": {
            "a": {
                "content": "الأوكسيتوسين",
                "correct": true
            },
            "b": {
                "content": "الكورتيزول",
                "correct": false
            },
            "c": {
                "content": "الأنسولين",
                "correct": false
            },
            "d": {
                "content": "الثيروكسين",
                "correct": false
            }
        },
        "explanation": "الأوكسيتوسين له دور في تحفيز إفراز الحليب من الثدي عن طريق تحفيز تقلص الخلايا العضلية حول الحويصلات اللبنية. الكورتيزول والأنسولين والثيروكسين ليس لهم دور مباشر في هذه العملية."
    },
    {
        "body": "أي من الأورام التالية يمكن أن يسبب ضخامة الأطراف (أكروميجالي)؟",
        "answers": {
            "a": {
                "content": "الورم المفرز لـ ACTH",
                "correct": false
            },
            "b": {
                "content": "الورم المفرز لـ GH",
                "correct": true
            },
            "c": {
                "content": "الورم المفرز للبرولاكتين",
                "correct": false
            },
            "d": {
                "content": "الورم المفرز لـ TSH",
                "correct": false
            }
        },
        "explanation": "الورم المفرز لـ GH (هرمون النمو) يمكن أن يسبب ضخامة الأطراف (أكروميجالي) بسبب الإفراز الزائد لهرمون النمو. الأورام المفرزة لـ ACTH والبرولاكتين وTSH لا تسبب هذه الحالة."
    },
    {
        "body": "أي من الاختبارات التالية هو الأكثر نوعية لتشخيص ضخامة الأطراف (أكروميجالي)؟",
        "answers": {
            "a": {
                "content": "معايرة هرمون النمو القاعدي",
                "correct": false
            },
            "b": {
                "content": "اختبار تحمل الجلوكوز مع معايرة هرمون النمو",
                "correct": true
            },
            "c": {
                "content": "معايرة البرولاكتين",
                "correct": false
            },
            "d": {
                "content": "معايرة الكورتيزول",
                "correct": false
            }
        },
        "explanation": "اختبار تحمل الجلوكوز مع معايرة هرمون النمو هو الأكثر نوعية لتشخيص ضخامة الأطراف (أكروميجالي) لأنه يظهر عدم تثبيط هرمون النمو بعد تناول الجلوكوز، وهو علامة مميزة لهذه الحالة. معايرة هرمون النمو القاعدي والبرولاكتين والكورتيزول أقل نوعية في التشخيص."
    }
];
</script>

<main>
    <button on:click={generateQuestions}>Generate questions ✨</button>
    <button on:click={generateExplanations}>Generate explanations ✨</button>

    {#if explanationsResult?.length}
        <div class="questions-explained fs-400" dir="rtl">
            {#each explanationsResult as question}
            <p class="bold">{question.body}</p>
            <p class:correct={question.answers.a.correct}>a: {question.answers.a.content}</p>
            <p class:correct={question.answers.b.correct}>b: {question.answers.b.content}</p>
            <p class:correct={question.answers.c.correct}>c: {question.answers.c.content}</p>
            <p class:correct={question.answers.d.correct}>d: {question.answers.d.content}</p>
            <p class="bold">الشرح</p>
            <p>{question.explanation}</p>
            {/each}
        </div>
    {/if}
</main>

<style>
    main {
        padding: 1rem;
    }

    .questions-explained {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 700px;
        margin-inline: auto;
    }

    p.correct {
        color: green;
    }
</style>