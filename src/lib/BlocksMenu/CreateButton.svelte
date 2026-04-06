<script>
    import { assets } from '$app/paths';
</script>

<button on:click>
    <img src={`${assets}/icon.svg`} alt="" />
</button>

<style>
    button {
        appearance: none;
        border: none;
        background: linear-gradient(#2bf, #49f);
        width: 100%;
        font-size: 4em;
        padding: 0;
        border-radius: 0.2em;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
    }
    button:active {
        filter: brightness(0.8);
    }
    button:focus-visible {
        outline: none;
    }

    img {
        opacity: 0.8;
        width: 0.7em;
        padding: 0.1em;
    }
</style>