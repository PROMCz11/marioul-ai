<script>
    let system = "", user = "";

    const generate = () => {
        fetch("../../api/free-form", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                prompt: { system, user }
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
    }
</script>

<main>
    <textarea bind:value={system} cols="60" rows="17" placeholder="System prompt"></textarea>
    <textarea bind:value={user} cols="60" rows="17" placeholder="User prompt"></textarea>
    <div>
        <button on:click={generate}>Generate ✨</button>
    </div>
</main>

<style>
    main {
        padding: 1rem;
        max-width: 700px;
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>