<script>
    import Modal from "./Modal.svelte";
    import * as i18n from "../../i18n";
    
    // 使用函数包装t，确保每次都获取最新的语言
    function t(key) {
        return i18n.t(key);
    }

    let id = "experiments"
</script>

<Modal id={id} title={t('experiments.title')} let:data>
    {t('experiments.debuggerAdded')}<br>
    {t('experiments.debuggerDesc')}<br>
    {t('experiments.moreLanguages')}
</Modal>