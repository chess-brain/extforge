<script>
    export let title = 'Unknown';
    export let id;
    export let activeTab = 0;
    export let handleTabClick; 

    function handleClick() {
        handleTabClick(id)
    }
</script>

<button class:active={id === activeTab} on:click={handleClick}>{title}</button>

<style>
    button {
        padding: 10px 20px;
        margin-right: 4px;
        border: 1px solid #e0e0e0;
        border-bottom: none;
        background: #f8f9fa;
        cursor: pointer;
        font-family: 'Noto Sans', sans-serif;
        font-weight: 500;
        font-size: 0.875rem;
        color: #495057;
        border-radius: 8px 8px 0 0;
        height: 2.5em;
        box-sizing: border-box;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    button:hover {
        background: #e9ecef;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    button.active {
        background: white;
        border-color: #dee2e6;
        border-bottom: 3px solid #007bff;
        color: #007bff;
        font-weight: 600;
        box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
    }

    :global(.dark) button {
        background: #343a40;
        color: #e9ecef;
        border-color: #495057;
    }
    
    :global(.dark) button:hover {
        background: #495057;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    :global(.dark) button.active {
        background: #212529;
        border-color: #495057;
        border-bottom: 3px solid #007bff;
        color: #007bff;
        box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
    }
</style>