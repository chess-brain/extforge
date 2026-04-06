<script>
    import util from "../../resources/util";
    import CreateButton from "./CreateButton.svelte";
    import Blockly from "blockly/core";
    import * as i18n from "../../i18n";
    
    // 使用函数包装t，确保每次都获取最新的语言
    function t(key) {
        return i18n.t(key);
    }

    function updateBlocks() {
        if (typeof window === 'undefined') return
        
        blocks = window.blocks
        window.blocks = blocks

        //refresh workspace
        try {
            let workspace = window.workspace
            if (workspace && window.Blockly) {
                let xml = window.Blockly.Xml.workspaceToDom(workspace);
                workspace.clear();
                window.Blockly.Xml.domToWorkspace(xml, workspace);
                if (workspace.refreshToolboxSelection) {
                    workspace.refreshToolboxSelection();
                }
            }
        } catch (e) {
            console.warn("Error updating workspace:", e)
        }
    }

    function createBlock() {
        if (typeof window === 'undefined' || !window.workspace) return
        
        if (!confirm(t('blocks.confirmCreate'))) return

        let id = util.randomHex(16)
        let block = {
            type: "command",
            fields: [
                {
                    type: "label",
                    text: "block",
                    id: util.randomHex(16)
                }
            ],
            colour: "#4bf"
        }
        window.blocks[id] = block

        let workspace = window.workspace
        /** @type {Blockly.BlockSvg} */
        let defineBlock = workspace.newBlock("blocks_define")
        defineBlock.setDeletable(false)
        defineBlock.blockId_ = id
        defineBlock.updateShape_()
        
        // Only call initSvg and render if workspace is not headless
        if (typeof window !== 'undefined' && document) {
            try {
                defineBlock.initSvg()
                defineBlock.render()
            } catch (e) {
                console.warn("Error initializing block SVG:", e)
            }
        }

        updateBlocks()
    }

    function editBlock(id) {
        if (typeof window === 'undefined' || !window.modals) return
        window.modals["editblock"].blockId = id
        window.modals["editblock"].tempBlock = window.blocks[id]
        window.modals["editblock"].toggle()
    }

    function deleteBlock(id) {
        if (typeof window === 'undefined') return
        
        if (!confirm(t('blocks.confirmDelete'))) return

        delete window.blocks[id]
        
        // Remove the block from workspace
        try {
            let workspace = window.workspace
            if (workspace) {
                let block = workspace.getBlockById(id)
                if (block) {
                    block.dispose()
                }
            }
        } catch (e) {
            console.warn("Error deleting block:", e)
        }

        updateBlocks()
    }

    function changeBlockColor(id) {
        if (typeof window === 'undefined') return
        
        // Use a simple input instead of prompt() for better compatibility
        let color = window.prompt ? window.prompt("Enter a color for this block (hex code):", window.blocks[id].colour || "#4bf") : "#4bf"
        if (color) {
            window.blocks[id].colour = color
            updateBlocks()
        }
    }

    setInterval(() => {
        if (!globalThis.window) return
        blocks = window.blocks
        window.blocks = blocks
    }, 1000)

    let blocks = {}
</script>

<div class="main">
    <CreateButton on:click={createBlock} />
    {#each Object.entries(blocks) as [id, block]}
        <div class="block" style="border-left: 4px solid {block.colour || '#4bf'}">
            <span class="name">{util.blockToName(block.fields)}</span>
            <div class="block-actions">
                <button class="edit" on:click={() => editBlock(id)}>{t('blocks.edit')}</button>
                <button class="color" on:click={() => changeBlockColor(id)}>{t('blocks.color')}</button>
                <button class="delete" on:click={() => deleteBlock(id)}>{t('blocks.delete')}</button>
            </div>
        </div>
    {:else}
        <p>{t('blocks.noBlocks')}</p>
    {/each}    
</div>

<style>
    .main {
        padding: 16px;
        display: flex;
        width: min(calc(100vw - 32px), 1024px);
        flex-direction: column;
        align-items: center;
        margin: auto;
        gap: 0.5em;
    }

    .block {
        background: #8884;
        width: 100%;
        height: 4em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 0.8em;
        box-sizing: border-box;
        padding: 8px;
    }

    .block-actions {
        display: flex;
        gap: 8px;
    }

    .block button {
        appearance: none;
        border: none;
        font-size: 1rem;
        padding: 0.4rem 1rem;
        border-radius: 0.2em;
        cursor: pointer;
        font-weight: bold;
    }

    .block .edit {
        background: #4bf;
    }

    .block .color {
        background: #f4b400;
    }

    .block .delete {
        background: #f44336;
        color: white;
    }
</style>