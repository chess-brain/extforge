<script>
    import { createEventDispatcher } from "svelte";
    import plusIcon from "$lib/images/nav/plus.svg";
    import * as i18n from "../../i18n";
    import { locale } from "../../i18n";

    const dispatch = createEventDispatcher();

    function t(key) {
        $locale;
        return i18n.t(key);
    }
</script>

<button
    type="button"
    aria-label={t('blocksUi.createBlockAria')}
    on:click={() => dispatch('click')}
>
    <img src={plusIcon} alt="" />
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
