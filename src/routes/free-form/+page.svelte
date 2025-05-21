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
    <div>
        <textarea bind:value={system} cols="60" rows="10" placeholder="System prompt"></textarea>
        <textarea bind:value={user} cols="60" rows="10" placeholder="User prompt"></textarea>
    </div>
    <button on:click={generate}>Generate ✨</button>
</main>

<style>
    main {
        padding: 1rem;
    }
</style>