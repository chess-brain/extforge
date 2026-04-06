<script>
    import { onMount } from 'svelte';
    
    export let activeTab = 0;
    let tabs = [];

    function handleTabClick(id) {
        activeTab = id
        // Expose activeTab to window for top bar access
        if (typeof window !== 'undefined') {
            window.activeTab = activeTab;
            window.setActiveTab = handleTabClick;
        }
    }

    function registerTab() {
        const id = tabs.length;
        tabs.push(id);
        return id;
    }
    
    onMount(() => {
        // Expose functions to window for top bar access
        if (typeof window !== 'undefined') {
            window.activeTab = activeTab;
            window.setActiveTab = handleTabClick;
        }
    });
    
    // Update window when activeTab changes
    $: if (typeof window !== 'undefined') {
        window.activeTab = activeTab;
    }
</script>

<div class="tab-manager">
    <div class="tab-buttons">
        <slot {activeTab} {tabs} {handleTabClick} {registerTab} />
    </div>
    <div class="tab-content">
        <slot name="content" {activeTab} />
    </div>
</div>

<style>
    .tab-manager {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .tab-buttons {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        border-bottom: 1px solid #dee2e6;
        padding: 0 8px;
        background: #f8f9fa;
    }

    .tab-content {
        flex: 1;
        overflow: hidden;
        background: white;
        border: 1px solid #dee2e6;
        border-top: none;
        border-radius: 0 0 8px 8px;
        box-sizing: border-box;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    :global(.dark) .tab-manager {
        background: #111;
        color: #fff;
    }
    
    :global(.dark) .tab-buttons {
        background: #212529;
        border-bottom-color: #495057;
    }
    
    :global(.dark) .tab-content {
        background: #212529;
        border-color: #495057;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
</style>