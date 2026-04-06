<script>
    import Modal from "./Modal.svelte";
    import util from "../../resources/util";
    import * as i18n from "../../i18n";
    
    // 使用函数包装t，确保每次都获取最新的语言
    function t(key) {
        return i18n.t(key);
    }

    let id = "editblock";

    import Blockly from "blockly/core";

    import En from "blockly/msg/en";
    import "blockly/blocks";
    import "blockly/javascript";

    import BlocklyComponent from "$lib/svelte-blockly";
    import { onMount } from "svelte";
    /** @type {Blockly.WorkspaceSvg} */
    let workspace;

    const en = {
        rtl: false,
        msg: {
            ...En,
        },
    };

    const config = {
        scrollbars: false,
        readOnly: true,
        renderer: "custom_renderer",
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.8,
            maxScale: 2,
            minScale: 0.5,
            scaleSpeed: 1.1,
        },
    };

    function updateBlocks(data) {
        previewBlock.blockId_ = data.blockId
        previewBlock.updateShape_()
        previewBlock.initSvg();
        previewBlock.render();
        requestAnimationFrame(() => {
            workspace.centerOnBlock(previewBlock.id)
        })

        //refresh workspace
        try {
            let workspaceG = window.workspace
            let xml = Blockly.Xml.workspaceToDom(workspaceG);
            workspaceG.clear();
            Blockly.Xml.domToWorkspace(xml, workspaceG);
            this.refreshToolboxSelection();
        } catch {}
    }

    function saveBlock(data) {
        data.toggle()
        window.blocks[data.blockId] = data.tempBlock
        updateBlocks(data)
    }

    let previewBlock

    onMount(() => {
        previewBlock = workspace.newBlock("blocks_execute");

        const old = window.modals[id].update
        window.modals[id].update = function() {
            old.call(this)
            updateBlocks(window.modals[id])
        }

        addEventListener("resize", ev => {
            workspace.centerOnBlock(previewBlock.id)
        })
    });
</script>

<Modal {id} title={t('blocks.editBlock')} let:data>
    <div class="main">
        <div class="preview">
            <BlocklyComponent {config} locale={en} bind:workspace />
        </div>
        <div class="fields">
            <table class="fields">
                <tr>
                    <th>{t('blocks.type')}</th>
                    <th>{t('blocks.text')}</th>
                    <th><!-- options --></th>
                    <th><!-- buttons --></th>
                </tr>
                {#each Object.keys(data.tempBlock ? data.tempBlock.fields : {}) as i}
                    <tr>
                        <td>
                            <select value={data.tempBlock.fields[i].type} on:change={(e) => {
                                data.tempBlock.fields[i].type = e.target.value
                                data.update()
                                updateBlocks(data)
                            }}>
                                <option value="label">{t('blocks.label')}</option>
                                <option value="string">{t('blocks.string')}</option>
                                <option value="number">{t('blocks.number')}</option>
                                <option value="boolean">{t('blocks.boolean')}</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" value={data.tempBlock.fields[i].text} on:change={(e) => {
                                data.tempBlock.fields[i].text = e.target.value
                                data.update()
                                updateBlocks(data)
                            }} />
                        </td>
                        <td>
                            {#if data.tempBlock.fields[i].type == "string"}
                                <input type="text" value={data.tempBlock.fields[i].default ?? ""} placeholder={t('blocks.defaultValue')} on:change={(e) => {
                                    data.tempBlock.fields[i].default = e.target.value
                                    data.update()
                                    updateBlocks(data)
                                }} />
                            {:else if data.tempBlock.fields[i].type == "number"}
                                <input type="number" value={data.tempBlock.fields[i].default ?? ""} placeholder={t('blocks.defaultValue')} on:change={(e) => {
                                    data.tempBlock.fields[i].default = e.target.value
                                    data.update()
                                    updateBlocks(data)
                                }} />
                            {/if}
                        </td>
                        <td>
                            <button on:click={() => {
                                data.tempBlock.fields.splice(i, 1)
                                data.update()
                                updateBlocks(data)
                            }}>{t('blocks.delete')}</button>
                        </td>
                    </tr>
                {/each}
            </table>
        </div>
        <div class="bottom">
            <!--<button on:click={() => saveBlock(data)}>Save</button>-->
            <button on:click={() => {
                data.tempBlock.fields.push({
                    type: "label",
                    text: "text",
                    id: util.randomHex(16)
                })
                data.update()
                updateBlocks(data)
            }}>{t('blocks.addField')}</button>
            <select value={(data.tempBlock ?? {}).type} on:change={(e) => {
                data.tempBlock.type = e.target.value
                data.update()
                updateBlocks(data)
            }}>
                <option value="command">{t('blocks.command')}</option>
                <option value="reporter">{t('blocks.reporter')}</option>
                <option value="Boolean">{t('blocks.boolean')}</option>
            </select>
        </div>
    </div>
</Modal>

<style>
    .main {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 8px;
    }

    .preview {
        flex: 1;
    }

    .fields {
        flex: 2;
        overflow-y: scroll
    }

    .fields table {
        width: 100%;
    }

    .fields tr > *:nth-child(1) {
        width: 20%;
    }
    .fields tr > *:nth-child(2) {
        width: 30%;
    }
    .fields tr > *:nth-child(4) {
        float: right;
    }

    :is(input, select):only-child {
        width: 100%;
        box-sizing: border-box;
    }
</style>
