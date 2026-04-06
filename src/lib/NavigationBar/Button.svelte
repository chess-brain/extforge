<script>
    import { createEventDispatcher } from "svelte";
    /** @type {string?} */
    export let icon = null

    const dispatch = createEventDispatcher();

    function event() {
        dispatch("click");
    }
</script>

<button on:click={event}>
    {#if icon}
        <img src={icon} alt="Icon" />
    {/if}
    <b><slot /></b>
</button>

<style>
    img {
        height: 1.5rem;
        margin-right: 0.5rem;
        opacity: 0.9;
        transition: opacity 0.3s ease;
    }

    b {
        opacity: 0.9;
        transition: opacity 0.3s ease;
    }
    b:empty {
        margin-left: 0;
    }

    button {
        position: relative;

        height: 2.5rem;
        padding: 0 1rem;
        margin: 0 4px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        font-family: 'Noto Sans', sans-serif;
        font-weight: 500;
        font-size: 0.875rem;
        color: white;
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
        border: 0;
        border-radius: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    button:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    }
    
    button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>