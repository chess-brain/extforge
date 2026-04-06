<script>
    export let title = 'Unknown';

    export let activeTab = 0;
    export let tabs;
    export let handleTabClick; 
    export let registerTab;

    let id = registerTab();

    function handleClick() {
        handleTabClick(id)
    }
</script>

<div class:active={id === activeTab} class="tab-header">
    <button class:active={id === activeTab} on:click={handleClick}>{title}</button>
    <div class="contents" style:left={`calc(-${id}*100vw)`}><slot /></div>
</div>

<style>
    div.tab-header {
        position: relative;
        height: 100%;
        flex: 1;
    }
    
    div.active {
        z-index: 2;
    }

    button {
        position: relative;
        display: inline-block;
        padding: 8px 16px;
        margin-right: -1px;
        border: 1px solid #ccc;
        border-bottom: none;
        background: #eee;
        cursor: pointer;
        font-family: 'Noto Sans', sans-serif;
        font-weight: bold;
        font-size: 0.75rem;
        color: #000;
        border-radius: 4px 4px 0 0;
        height: 2.2em;
        box-sizing: border-box;
        transition: all 0.2s ease;
    }
    
    button:hover {
        background: #ddd;
    }
    
    button.active {
        background: white;
        border-bottom: 1px solid white;
        margin-bottom: -1px;
        color: #333;
        font-weight: bold;
    }

    :global(.dark) button {
        background: #333;
        color: #fff;
        border-color: #555;
    }
    
    :global(.dark) button:hover {
        background: #444;
    }
    
    :global(.dark) button.active {
        background: #222;
        color: #fff;
        border-bottom: 1px solid #222;
    }

    .contents {
        width: 100%;
        height: calc(100% - 2.2em);
        position: absolute;
        top: 2.2em;
        display: block;
        overflow: auto;
        background: white;
        border: 1px solid #ccc;
        border-top: none;
        box-sizing: border-box;
    }
    
    :global(.dark) .contents {
        background: #222;
        border-color: #555;
        color: #fff;
    }
    
    div:not(.active) .contents {
        display: none;
    }
</style>