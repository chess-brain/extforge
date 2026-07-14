<script>
    import util from "../../resources/util";
    import CreateButton from "./CreateButton.svelte";
    import Blockly from "blockly/core";
    import * as i18n from "../../i18n";
    import { locale } from "../../i18n";
    import {
        ensureCustomDefineBlocks,
        refreshBlocksToolbox,
    } from "../../resources/customBlocksWorkspace";
    
    // 使用函数包装t，确保每次都获取最新的语言
    function t(key) {
        $locale;
        return i18n.t(key);
    }

    function updateBlocks() {
        if (typeof window === 'undefined') return
        
        blocks = window.blocks
        window.blocks = blocks

        //refresh workspace
        try {
            let workspace = window.workspace
            // Headless Workspace cannot initSvg/render; skip DOM reload.
            if (workspace && workspace.rendered === false) return
            if (workspace && window.Blockly) {
                let xml = window.Blockly.Xml.workspaceToDom(workspace);
                workspace.clear();
                window.Blockly.Xml.domToWorkspace(xml, workspace);
                ensureCustomDefineBlocks(workspace);
                if (workspace.refreshToolboxSelection) {
                    workspace.refreshToolboxSelection();
                }
                refreshBlocksToolbox(workspace);
            }
        } catch (e) {
            console.warn("Error updating workspace:", e)
        }
    }

    function createBlock() {
        if (typeof window === 'undefined') return
        
        if (!confirm(t('blocksUi.confirmCreate'))) return

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
        blocks = window.blocks

        let workspace = window.workspace
        if (workspace && workspace.rendered !== false) {
            /** @type {Blockly.BlockSvg} */
            let defineBlock = workspace.newBlock("blocks_define")
            defineBlock.setDeletable(false)
            defineBlock.blockId_ = id
            defineBlock.updateShape_()
            
            // Only call initSvg and render if workspace is not headless
            if (typeof document !== 'undefined') {
                try {
                    defineBlock.initSvg()
                    defineBlock.render()
                } catch (e) {
                    console.warn("Error initializing block SVG:", e)
                }
            }

            updateBlocks()
        }
    }

    function editBlock(id) {
        if (typeof window === 'undefined' || !window.modals) return
        window.modals["editblock"].blockId = id
        window.modals["editblock"].tempBlock = window.blocks[id]
        window.modals["editblock"].toggle()
    }

    function deleteBlock(id) {
        if (typeof window === 'undefined') return
        
        if (!confirm(t('blocksUi.confirmDelete'))) return

        delete window.blocks[id]
        blocks = window.blocks
        
        // Remove the block from workspace
        try {
            let workspace = window.workspace
            if (workspace) {
                for (const b of workspace.getAllBlocks(false)) {
                    if (
                        (b.type === 'blocks_define' || b.type === 'blocks_execute') &&
                        b.blockId_ === id
                    ) {
                        b.dispose(false)
                    }
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
        let color = window.prompt ? window.prompt(t('blocksUi.blockColorPrompt'), window.blocks[id].colour || "#4bf") : "#4bf"
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
                <button class="edit" on:click={() => editBlock(id)}>{t('blocksUi.edit')}</button>
                <button class="color" on:click={() => changeBlockColor(id)}>{t('blocksUi.color')}</button>
                <button class="delete" on:click={() => deleteBlock(id)}>{t('blocksUi.delete')}</button>
            </div>
        </div>
    {:else}
        <p>{t('blocksUi.noBlocks')}</p>
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