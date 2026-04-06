<script>
    import Blockly from "blockly/core"
    import Modal from "./Modal.svelte";
    import * as i18n from "../../i18n";
    
    // 使用函数包装t，确保每次都获取最新的语言
    function t(key) {
        return i18n.t(key);
    }

    let varName = "my variable"
    let varType = "null"

    function register(data) {
        window.variables[varName] = {
            type: varType === "null" ? null : varType
        }

        data.toggle()

        varName = "my variable"
        varType = "null"
        window.workspace.refreshToolboxSelection()
    }

    let id = "createVariable"
</script>

<Modal id={id} title={t('variables.registerVariable')} let:data>
    <div class="main">
        <input type="text" placeholder={t('variables.variableName')} bind:value={varName}>
        <select bind:value={varType}>
            <option value="null">{t('variables.unknown')}</option>
            <option value="String">{t('blocks.string')}</option>
            <option value="Number">{t('blocks.number')}</option>
            <option value="Boolean">{t('blocks.boolean')}</option>
            <option value="List">{t('variables.list')}</option>
            <option value="Vector">{t('variables.vector')}</option>
        </select>
        <button class="btn" on:click={() => {register(data)}}>{t('variables.register')}</button>
    </div>
</Modal>

<style>
    .main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        min-height: 100%;
    }

    .btn {
        display: block;
        background: linear-gradient(177.5deg, #fa7, #f87);
        box-sizing: border-box;
        font-size: 1.5rem;
        border: #0004 solid 0.2rem;
        border-radius: 0.5rem;
        font-family: "Noto Sans";
        font-weight: bold;
        padding: 0.2rem 0.5rem;
        margin: 0.5rem;
    }
</style>