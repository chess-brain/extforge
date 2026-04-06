<script>
    import { createEventDispatcher } from "svelte";
    import * as i18n from "../../i18n";
    const dispatch = createEventDispatcher()
    
    // 使用函数包装t，确保每次都获取最新的语言
    function t(key) {
        return i18n.t(key);
    }

    export let properties = {
        name: "Extension",
        id: "extensionID",
        color: "#6FFF98"
    }

    function update() {
        dispatch("update")
    }

    function validateName() {
        if (properties.name == "") properties.name = "Extension"
        if (properties.name.length > 20) properties.name = properties.name.substring(0, 20)
        properties.name = properties.name.replace("\n", " ")
        update()
    }
</script>

<div class="root vert">
    <div class="inner horiz">
        <div class="vert equal">
            <div class="bubble" style:background={properties.color} />
            <span class="name" contenteditable="plaintext-only" bind:innerText={properties.name} on:blur={validateName}></span>
        </div>
        <div class="vert equal">
            <span>{t('properties.id')}: <input type="text" placeholder="extensionID" maxlength="20" bind:value={properties.id} on:blur={update}></span>
            <span>{t('properties.color')}: <input type="color" bind:value={properties.color} on:blur={update}></span>
        </div>
    </div>
    <slot {properties} />
</div>

<style>
    .vert {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .horiz {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .equal {
        flex: 1;
        overflow: hidden;
    }

    .root {
        width: 100%;
        height: 100%;
        justify-content: center;
    }
    .inner {
        width: 30em;
    }

    .bubble {
        width: 8em;
        aspect-ratio: 1;
        box-sizing: border-box;
        border: .5em solid #0004;
        border-radius: 100%;
    }

    .name {
        font-size: 1.2em;
        font-weight: 500;
        background-color: #0002;
        padding: 0.1em 0.3em;
        border-radius: 0.2em;
        margin-top: 0.5em;
        max-width: 100%;
        box-sizing: border-box;
        outline: none;
    }
    :global(.dark) .name {
        background-color: #fff2;
    }
</style>