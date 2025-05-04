<script>
    import "../global.css";
    const generateQuestions = () => {
        fetch("./api/questions")
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
    }
    const generateExplanations = () => {
        fetch("./api/explanations")
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
    }
</script>

<main>
    <button on:click={generateQuestions}>Generate questions ✨</button>
    <button on:click={generateExplanations}>Generate explanations ✨</button>
</main>

<style>
    main {
        padding: 1rem;
    }
</style>