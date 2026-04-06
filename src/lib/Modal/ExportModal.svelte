<script>
    import Modal from "./Modal.svelte";
    import * as i18n from "../../i18n";
    
    // 使用函数包装t，确保每次都获取最新的语言
    function t(key) {
        return i18n.t(key);
    }

    function exportAsJS() {
        if (typeof window !== 'undefined' && window.exportAsJS) {
            window.exportAsJS();
        }
    }

    function exportAsEXF() {
        if (typeof window !== 'undefined' && window.exportAsEXF) {
            window.exportAsEXF();
        }
    }

    function copyCode() {
        if (typeof window !== 'undefined' && window.code) {
            navigator.clipboard.writeText(window.code)
                .then(() => {
                    alert(t('export.codeCopied'));
                })
                .catch(err => {
                    console.error('Failed to copy code:', err);
                    alert(t('export.copyFailed'));
                });
        }
    }
</script>

<Modal id="export" title={t('export.exportProject')}>
    <div class="export-modal">
        <div class="export-options">
            <h3>{t('export.exportOptions')}</h3>
            <div class="export-buttons">
                <button class="export-button js" on:click={exportAsJS}>
                    <span class="button-icon">📄</span>
                    <span class="button-text">{t('export.exportAsJS')}</span>
                    <span class="button-desc">{t('export.exportAsJSDesc')}</span>
                </button>
                <button class="export-button exf" on:click={exportAsEXF}>
                    <span class="button-icon">📁</span>
                    <span class="button-text">{t('export.exportAsEXF')}</span>
                    <span class="button-desc">{t('export.exportAsEXFDesc')}</span>
                </button>
                <button class="export-button copy" on:click={copyCode}>
                    <span class="button-icon">📋</span>
                    <span class="button-text">{t('export.copyCode')}</span>
                    <span class="button-desc">{t('export.copyCodeDesc')}</span>
                </button>
            </div>
        </div>
        <div class="export-info">
            <h3>{t('export.exportInformation')}</h3>
            <p>{t('export.exportInfoText')}</p>
        </div>
    </div>
</Modal>

<style>
    .export-modal {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .export-options h3,
    .export-info h3 {
        margin-top: 0;
        color: #ff9800;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
    }

    .export-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .export-button {
        display: flex;
        align-items: center;
        padding: 1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }

    .export-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .export-button.js {
        background: linear-gradient(135deg, #4bf, #38d);
        color: white;
    }

    .export-button.exf {
        background: linear-gradient(135deg, #4fbf9f, #38b888);
        color: white;
    }

    .export-button.copy {
        background: linear-gradient(135deg, #ff9800, #f57c00);
        color: white;
    }

    .button-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
        width: 2rem;
        text-align: center;
    }

    .button-text {
        font-weight: bold;
        font-size: 1.1rem;
        flex: 1;
    }

    .button-desc {
        font-size: 0.9rem;
        opacity: 0.9;
        margin-left: 1rem;
    }

    .export-info {
        flex: 1;
    }

    .export-info p {
        line-height: 1.6;
        color: #555;
    }

    :global(.dark) .export-options h3,
    :global(.dark) .export-info h3 {
        border-bottom-color: #444;
    }

    :global(.dark) .export-info p {
        color: #ddd;
    }
</style>