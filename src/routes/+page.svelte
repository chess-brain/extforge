<script lang="ts">
  import { browser } from '$app/environment';
  import Blockly from "blockly/core";

  // Import official Blockly language packs
  import EnOfficial from "blockly/msg/en";
  import ZhHansOfficial from "blockly/msg/zh-hans";
  
  import En from "blockly/msg/en";
  import ZhCN from "blockly/msg/zh-hans";
  import "blockly/blocks";
  import "blockly/javascript";

  import JSZip from "jszip";
  import * as FileSaver from "file-saver";
  import fileDialog from "../resources/fileDialog";

  import * as ContinuousToolboxPlugin from "@blockly/continuous-toolbox";

  import Patches from "../patches";
  import registerCategories from "../resources/categories";

  import Toolbox from "$lib/Toolbox/Toolbox.xml?raw";

  import BlocklyComponent from "$lib/svelte-blockly";
  import { onMount } from "svelte";

  import Compiler from "../resources/compiler";

  import NavigationBar from "$lib/NavigationBar/NavigationBar.svelte";
  import NavigationButton from "$lib/NavigationBar/Button.svelte";
  import NavigationDivider from "$lib/NavigationBar/Divider.svelte";

  import NavIconSave from "$lib/images/nav/save.svg";
  import NavIconLoad from "$lib/images/nav/load.svg";
  import NavIconExit from "$lib/images/nav/exit.svg";
  import NavIconExperiments from "$lib/images/nav/experiments.svg";
  import NavIconDark from "$lib/images/nav/dark.svg";
  import NavIconLang from "$lib/images/nav/language.svg";

  import TabManager from "$lib/TabManager/TabManager.svelte";
  import Tab from "$lib/TabManager/Tab.svelte";

  import ExperimentsModal from "$lib/Modal/ExperimentsModal.svelte";
  import CreateVariableModal from "$lib/Modal/CreateVariableModal.svelte";
  import EditBlockModal from "$lib/Modal/EditBlockModal.svelte";
  import ExportModal from "$lib/Modal/ExportModal.svelte";

  import CodePreview from "$lib/CodePreview/CodePreview.svelte";

  import PropertiesPicker from "$lib/PropertiesPicker/PropertiesPicker.svelte";

  import BlocksMenu from "$lib/BlocksMenu/BlocksMenu.svelte";
  import "$lib/styles/form-styles.css";
  import { setLanguage, getLanguage, initLanguage, getAvailableLanguages, addLanguageChangeListener } from "../i18n";
  import * as i18n from "../i18n";
  
  // 使用函数包装t，确保每次都获取最新的语言
  function t(key) {
    return i18n.t(key);
  }

  // Blockly language mappings
  const blocklyLanguages = {
    'en-US': En,
    'zh-CN': ZhCN
  };

  // Custom block translations for each language
  const customBlockTranslations = {
    'en-US': {
      BKY_EVENTS_LOADED: 'when extension loaded %1',
      BKY_EVENTS_THREAD: 'new thread %1',
      BKY_EVENTS_REGBROADCAST: 'when %1 broadcasted %2',
      BKY_EVENTS_BROADCAST: 'broadcast %1',
      BKY_EVENTS_BROADCASTW: 'broadcast %1 and wait',
      BKY_RUNTIME_START: 'start project',
      BKY_RUNTIME_STOP: 'stop project',
      BKY_RUNTIME_RUNNING: 'project running?',
      BKY_RUNTIME_ONSTART: 'when project started %1 %2',
      BKY_RUNTIME_ONSTOP: 'when project stopped %1 %2',
      BKY_RUNTIME_BEFORETICK: 'before project tick %1 %2',
      BKY_RUNTIME_AFTERTICK: 'after project tick %1 %2',
      BKY_RUNTIME_TURBOGET: 'turbo mode enabled?',
      BKY_RUNTIME_TURBOSET: 'set turbo mode to %1',
      BKY_RUNTIME_FRAMEGET: 'frame rate',
      BKY_RUNTIME_FRAMESET: 'set frame rate to %1',
      BKY_RUNTIME_TIMER: 'project timer',
      BKY_RUNTIME_BROADCAST: 'broadcast project %1',
      BKY_CONTROL_IF: 'if %1 then %2 %3',
      BKY_CONTROL_ELSEIF: 'else if',
      BKY_CONTROL_ELSE: 'else',
      BKY_CONTROL_WAIT: 'wait %1 seconds',
      BKY_CONTROL_WAITFRAME: 'wait until next frame',
      BKY_CONTROL_WAITUNTIL: 'wait until %1',
      BKY_CONTROL_WHILE: 'while %1 do %2 %3',
      BKY_CONTROL_REPEAT: 'repeat %1 times %2 %3',
      BKY_CONTROL_RETURN: 'return %1',
      BKY_CONTROL_INLINE: 'inline %1 %2',
      BKY_ADVANCED_RANDOM: 'random number from %1 to %2',
      BKY_ADVANCED_POWER: '%1 to the power of %2',
      BKY_ADVANCED_LENGTH: 'length of %1',
      BKY_ADVANCED_CONCAT: 'join %1 and %2',
      BKY_ADVANCED_ARRAYLENGTH: 'length of %1',
      BKY_ADVANCED_ARRAYPUSH: 'add %1 to %2',
      BKY_ADVANCED_DATETIME: 'current date and time',
      BKY_ADVANCED_YEAR: 'year of %1',
      BKY_GENERIC_RETURN: 'return %1'
    },
    'zh-CN': {
      BKY_EVENTS_LOADED: '当扩展加载 %1',
      BKY_EVENTS_THREAD: '新线程 %1',
      BKY_EVENTS_REGBROADCAST: '当 %1 广播 %2',
      BKY_EVENTS_BROADCAST: '广播 %1',
      BKY_EVENTS_BROADCASTW: '广播 %1 并等待',
      BKY_RUNTIME_START: '启动项目',
      BKY_RUNTIME_STOP: '停止项目',
      BKY_RUNTIME_RUNNING: '项目运行中？',
      BKY_RUNTIME_ONSTART: '当项目启动时 %1 %2',
      BKY_RUNTIME_ONSTOP: '当项目停止时 %1 %2',
      BKY_RUNTIME_BEFORETICK: '在项目刻之前 %1 %2',
      BKY_RUNTIME_AFTERTICK: '在项目刻之后 %1 %2',
      BKY_RUNTIME_TURBOGET: '加速模式已启用？',
      BKY_RUNTIME_TURBOSET: '将加速模式设置为 %1',
      BKY_RUNTIME_FRAMEGET: '帧率',
      BKY_RUNTIME_FRAMESET: '将帧率设置为 %1',
      BKY_RUNTIME_TIMER: '项目计时器',
      BKY_RUNTIME_BROADCAST: '广播项目 %1',
      BKY_CONTROL_IF: '如果 %1 那么 %2 %3',
      BKY_CONTROL_ELSEIF: '否则如果',
      BKY_CONTROL_ELSE: '否则',
      BKY_CONTROL_WAIT: '等待 %1 秒',
      BKY_CONTROL_WAITFRAME: '等待直到下一帧',
      BKY_CONTROL_WAITUNTIL: '等待直到 %1',
      BKY_CONTROL_WHILE: '当 %1 时重复执行 %2 %3',
      BKY_CONTROL_REPEAT: '重复 %1 次 %2 %3',
      BKY_CONTROL_RETURN: '返回 %1',
      BKY_CONTROL_INLINE: '内联 %1 %2',
      BKY_ADVANCED_RANDOM: '随机数从 %1 到 %2',
      BKY_ADVANCED_POWER: '%1 的 %2 次方',
      BKY_ADVANCED_LENGTH: '%1 的长度',
      BKY_ADVANCED_CONCAT: '连接 %1 和 %2',
      BKY_ADVANCED_ARRAYLENGTH: '%1 的长度',
      BKY_ADVANCED_ARRAYPUSH: '将 %1 添加到 %2',
      BKY_ADVANCED_DATETIME: '当前日期和时间',
      BKY_ADVANCED_YEAR: '%1 的年份',
      BKY_GENERIC_RETURN: '返回 %1'
    }
  };

  let currentBlocklyLocale = {
    rtl: false,
    msg: {
      ...En,
      ...customBlockTranslations['en-US']
    },
  };

  const config = {
    toolbox: Toolbox,
    collapse: true,
    comments: true,
    scrollbars: true,
    renderer: "custom_renderer",
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.8,
      maxScale: 2,
      minScale: 0.5,
      scaleSpeed: 1.1,
    },
    sounds: false, // Disable sounds to prevent loading from blockly-demo.appspot.com
    plugins: {
      toolbox: ContinuousToolboxPlugin.ContinuousToolbox,
      flyoutsVerticalToolbox: ContinuousToolboxPlugin.ContinuousFlyout,
      metricsManager: ContinuousToolboxPlugin.ContinuousMetrics,
    },
  };

  let localConfig = {
    dark: false,
  };

  function updateTheme() {
    if (localConfig.dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }

  Patches.Blockly.ToolboxFlyout(Blockly, config);
  Patches.Blockly.Renderer(Blockly);
  Patches.Blockly.DuplicateDrag(Blockly);
  
  // Import and register blocks immediately in browser environment
  import registerBlocks from "../resources/blocks"
  import registerButtons from "../resources/buttons"
  
  // Register blocks and set default messages BEFORE any component mounts
  if (browser) {
    console.log('[PAGE] Blockly.Msg identity before merge:', Blockly.Msg);
    console.log('[PAGE] Before merging translations, BKY_EVENTS_LOADED =', Blockly.Msg.BKY_EVENTS_LOADED);
    
    // CRITICAL: Set default messages BEFORE importing/registering blocks
    // Blocks use %{BKY_XXX} translation keys that must be in Blockly.Msg during registration
    Object.assign(Blockly.Msg, En);
    Object.assign(Blockly.Msg, customBlockTranslations['en-US']);
    
    console.log('[PAGE] Blockly.Msg identity after merge:', Blockly.Msg);
    console.log('[PAGE] After merging translations, BKY_EVENTS_LOADED =', Blockly.Msg.BKY_EVENTS_LOADED);
    console.log('[PAGE] Calling registerBlocks()');
    
    // Register all blocks now (translations are already in Blockly.Msg)
    registerBlocks();
    
    console.log('[PAGE] After registerBlocks(), BKY_EVENTS_LOADED =', Blockly.Msg.BKY_EVENTS_LOADED);
  }
  
  /** @type {import('blockly').Workspace} */
  let activeTab = 0;
  let workspace;
  let availableLanguages = [];
  let showLanguageMenu = false;
  let currentLanguage = getLanguage();
  let compiler = new Compiler();
  let code;
  let blockSearchQuery = "";
  let blockSearchMatches = [];
  let blockSearchIndex = -1;
  const DEBUGGER_EDITOR_BASE_URL = "https://editor.02engine.org";
  let debuggerExtensionUri = "";
  let copiedExtensionUrl = false;
  let loadError = "";
  let lastAutoSaveAt = "";
  let recentFiles: Array<{ name: string; time: string }> = [];
  const DRAFT_STORAGE_KEY = "extforge_draft_v1";
  const RECENT_FILES_STORAGE_KEY = "extforge_recent_files_v1";
  let properties = {
    name: "Extension",
    id: "extensionID",
    color: "#6FFF98",
  };

  let exportConfig = {
    minify: false,
    includeComments: true,
  };

  function updateGeneratedCode() {
    code = compiler.compile(workspace, properties);
    // @ts-ignore - Adding custom property to window
    window.code = code;
    debuggerExtensionUri = getExtensionUri();
    saveDraft(true);
    if (blockSearchQuery.trim()) {
      searchBlocks(true);
    }
  }

  function exportAsJS() {
    if (!code) return;
    
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${properties.name || 'extension'}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportAsEXF() {
    if (!workspace) return;
    
    try {
      const projectData = {
        properties,
        blocks: window.blocks,
        xml: Blockly.Xml.workspaceToDom(workspace).outerHTML
      };
      
      const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${properties.name || 'project'}.exf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error exporting EXF:', e);
      alert('Failed to export EXF file.');
    }
  }

  function openExportModal() {
    if (typeof window !== 'undefined' && window.modals && window.modals['export']) {
      window.modals['export'].toggle();
    }
  }

  // Expose functions and variables to window for modal access
  if (typeof window !== 'undefined') {
    // @ts-ignore - Adding custom properties to window
    window.exportAsJS = exportAsJS;
    // @ts-ignore - Adding custom properties to window
    window.exportAsEXF = exportAsEXF;
    // @ts-ignore - Adding custom properties to window
    window.code = code;
  }

  function toBase64(value) {
    return btoa(unescape(encodeURIComponent(value)));
  }

  function getExtensionUri() {
    return "data:text/plain;base64," + toBase64(code || "");
  }

  async function copyExtensionUrl() {
    const value = debuggerExtensionUri || getExtensionUri();
    try {
      await navigator.clipboard.writeText(value);
      copiedExtensionUrl = true;
      setTimeout(() => {
        copiedExtensionUrl = false;
      }, 1200);
    } catch {}
  }

  function readRecentFiles() {
    try {
      recentFiles = JSON.parse(localStorage.getItem(RECENT_FILES_STORAGE_KEY) || "[]");
    } catch {
      recentFiles = [];
    }
  }

  function pushRecentFile(name) {
    const now = new Date().toLocaleString();
    const next = [{ name, time: now }, ...recentFiles.filter((v) => v.name !== name)].slice(0, 8);
    recentFiles = next;
    localStorage.setItem(RECENT_FILES_STORAGE_KEY, JSON.stringify(next));
  }

  function serializeProjectData() {
    return {
      blockly: Blockly.serialization.workspaces.save(workspace),
      properties: properties,
      variables: window.variables || {},
      blocks: window.blocks || {}
    };
  }

  function applyProjectData(projectJson) {
    properties.name = projectJson?.properties?.name ?? "Extension";
    properties.id = projectJson?.properties?.id ?? "extensionID";
    properties.color = projectJson?.properties?.color ?? "#6FFF98";

    window.variables = projectJson?.variables ?? {};
    window.blocks = projectJson?.blocks ?? {};

    Blockly.serialization.workspaces.load(projectJson?.blockly ?? {}, workspace);
    updateGeneratedCode();
  }

  function saveDraft(silent = false) {
    if (!workspace) return;
    try {
      const payload = {
        updatedAt: Date.now(),
        data: serializeProjectData()
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
      lastAutoSaveAt = new Date(payload.updatedAt).toLocaleString();
      if (!silent) {
        alert("Draft saved.");
      }
    } catch {}
  }

  function restoreDraft(silent = false) {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) {
        if (!silent) alert("No draft found.");
        return;
      }
      const payload = JSON.parse(raw);
      applyProjectData(payload.data || {});
      lastAutoSaveAt = payload.updatedAt ? new Date(payload.updatedAt).toLocaleString() : "";
    } catch {
      if (!silent) alert("Draft restore failed.");
    }
  }

  function openDebuggerInNewTab() {
    const extensionUri = getExtensionUri();
    const url = `${DEBUGGER_EDITOR_BASE_URL}/editor?extension=${encodeURIComponent(extensionUri)}`;
    window.open(url, "_blank")?.focus();
  }

  function openModal(id) {
    window.modals[id].toggle();
  }

  function downloadProject() {
    let filteredProjectName = properties.id.replace(/[^a-z0-9\-]+/gim, "_");
    let fileName = filteredProjectName + ".exf";

    let projectData = serializeProjectData();

    // zip
    const zip = new JSZip();
    zip.file(
      "README.txt",
      "This file is not meant to be opened!" +
        "\nBe careful as you can permanently break your extension!",
    );

    // data
    const data = zip.folder("data");
    data.file("project.json", JSON.stringify(projectData));

    // download
    zip.generateAsync({ type: "blob" }).then((blob) => {
      FileSaver.saveAs(blob, fileName);
      pushRecentFile(fileName);
    });
  }

  function blockMatchesQuery(block, query) {
    if (!query) return false;
    const target = query.toLowerCase();
    const type = String(block.type || "").toLowerCase();
    const text = String(block.toString ? block.toString() : "").toLowerCase();
    return type.includes(target) || text.includes(target);
  }

  function focusBlock(block) {
    if (!block || !workspace) return;
    try {
      block.select();
      if (workspace.centerOnBlock) {
        workspace.centerOnBlock(block.id);
      }
    } catch {}
  }

  function searchBlocks(silent = false) {
    if (!workspace) return;
    const query = blockSearchQuery.trim();
    if (!query) {
      blockSearchMatches = [];
      blockSearchIndex = -1;
      return;
    }

    const blocks = workspace.getAllBlocks(false).filter((block) => blockMatchesQuery(block, query));
    blockSearchMatches = blocks;
    blockSearchIndex = blocks.length > 0 ? 0 : -1;
    if (blocks.length > 0) {
      focusBlock(blocks[0]);
    } else if (!silent) {
      alert("No blocks matched this query.");
    }
  }

  function gotoSearchMatch(step = 1) {
    if (!blockSearchMatches.length) return;
    blockSearchIndex = (blockSearchIndex + step + blockSearchMatches.length) % blockSearchMatches.length;
    focusBlock(blockSearchMatches[blockSearchIndex]);
  }

  function loadProject() {
    loadError = "";
    fileDialog({ accept: ".exf" }).then((files) => {
      if (!files) return;
      const file = files[0];
      JSZip.loadAsync(file.arrayBuffer())
        .then(async (zip) => {
          const dataFolder = zip.folder("data");
          const projectFile = dataFolder?.file("project.json");
          if (!projectFile) {
            throw new Error("Missing data/project.json");
          }
          const projectJsonString = await projectFile.async("string");
          const projectJson = JSON.parse(projectJsonString);
          applyProjectData(projectJson);
          pushRecentFile(file.name);
        })
        .catch((error) => {
          loadError = `Import failed: ${error?.message || "Unknown error"}`;
          alert(loadError);
        });
    });
  }

  function resetProject() {
    if (!workspace) return;
    if (!confirm("Reset the current project? This will clear all blocks and custom data.")) {
      return;
    }

    try {
      workspace.clear();
    } catch (e) {
      console.error("Error clearing workspace:", e);
    }

    properties = {
      name: "Extension",
      id: "extensionID",
      color: "#6FFF98"
    };
    window.variables = {};
    window.blocks = {};
    blockSearchQuery = "";
    blockSearchMatches = [];
    blockSearchIndex = -1;
    loadError = "";
    updateGeneratedCode();
  }

  function toggleLanguageMenu() {
    showLanguageMenu = !showLanguageMenu;
  }

  function changeLanguage(langCode) {
    setLanguage(langCode);
    updateBlocklyLanguage(langCode);
    showLanguageMenu = false;
  }

  function updateBlocklyLanguage(langCode) {
    const lang = blocklyLanguages[langCode] || En;
    const customTranslations = customBlockTranslations[langCode] || customBlockTranslations['en-US'];
    
    // Clear existing custom translations to avoid conflicts
    Object.keys(customBlockTranslations['en-US']).forEach(key => {
      delete Blockly.Msg[key];
    });
    Object.keys(customBlockTranslations['zh-CN']).forEach(key => {
      delete Blockly.Msg[key];
    });
    
    // CRITICAL: Load official Blockly language pack FIRST
    // This ensures all built-in blocks have their tooltips and messages
    if (langCode === 'zh-CN') {
      Object.assign(Blockly.Msg, ZhHansOfficial);
      console.log('[PAGE] Official Blockly zh-Hans language pack loaded');
    } else {
      Object.assign(Blockly.Msg, EnOfficial);
      console.log('[PAGE] Official Blockly en language pack loaded');
    }
    
    // Then merge custom translations
    Object.assign(Blockly.Msg, customTranslations);
    
    currentBlocklyLocale = {
      rtl: langCode === 'ar', // Arabic is right-to-left
      msg: {
        ...Blockly.Msg
      },
    };
  }

  onMount(() => {
    code = "";

    window.Blockly = Blockly;
    window.workspace = workspace;
    window.variables = {};
    window.blocks = {};

    // Initialize language on client-side
    initLanguage();
    availableLanguages = getAvailableLanguages();
    
    // Set up Blockly messages for user's preferred language
    const userLang = getLanguage();
    const langPack = blocklyLanguages[userLang] || En;
    const customTranslations = customBlockTranslations[userLang] || customBlockTranslations['en-US'];
    
    // CRITICAL: Load official Blockly language pack FIRST
    if (userLang === 'zh-CN') {
      Object.assign(Blockly.Msg, ZhHansOfficial);
    } else {
      Object.assign(Blockly.Msg, EnOfficial);
    }
    
    // Then merge custom translations
    Object.assign(Blockly.Msg, langPack);
    Object.assign(Blockly.Msg, customTranslations);
    
    // Blocks already registered at module level, no need to register again

    // Add language change listener
    const unsubscribe = addLanguageChangeListener((newLang) => {
      currentLanguage = newLang;
      updateBlocklyLanguage(newLang);
    });

    registerCategories(workspace);
    registerButtons(workspace);

    readRecentFiles();
    restoreDraft(true);
    updateGeneratedCode();
    // @ts-ignore - Adding custom property to window
    window.code = code;

    updateTheme();

    workspace.addChangeListener(event => {
      //Blockly.Events.disableOrphans(event);
      updateGeneratedCode();
    });

    addEventListener('beforeunload', event => {
      try {
        if (workspace.getAllBlocks().length > 0) {
          event.preventDefault();
          event.returnValue = true;
        }
      } catch {}
    })

    let newconfig = localStorage.getItem('localConfig')
    if (newconfig) {
      localConfig.dark = JSON.parse(newconfig).dark ?? false
      updateTheme()
    }

    addEventListener('unload', event => {
      localStorage.setItem('localConfig', JSON.stringify(localConfig))
    })

    // Clean up listener on unmount
    return () => {
      unsubscribe();
    };
  });
</script>

<NavigationBar>
  <NavigationButton icon={NavIconDark} on:click={() => {
    localConfig.dark = !localConfig.dark;
    updateTheme()
  }}></NavigationButton>
  <NavigationDivider />
  <NavigationButton icon={NavIconSave} on:click={() => openExportModal()}>
    {t('nav.export')}
  </NavigationButton>
  <NavigationButton icon={NavIconLoad} on:click={loadProject}>
    {t('nav.load')}
  </NavigationButton>
  <NavigationButton icon={NavIconExit} on:click={resetProject}>
    {t('nav.reset')}
  </NavigationButton>
  <NavigationButton on:click={() => saveDraft(false)}>
    {t('nav.saveDraft')}
  </NavigationButton>
  <NavigationButton on:click={() => restoreDraft(false)}>
    {t('nav.restoreDraft')}
  </NavigationButton>
  <NavigationDivider />
  <NavigationButton icon={NavIconExperiments} on:click={() => openModal("experiments") }>
    {t('nav.experiments')}
  </NavigationButton>
  <div class="language-menu-container">
    <NavigationButton icon={NavIconLang} on:click={toggleLanguageMenu}>
      {t('nav.language')}
    </NavigationButton>
    {#if showLanguageMenu}
      <div class="language-menu">
        {#each availableLanguages as lang}
          <div 
            class="language-item" 
            on:click={() => changeLanguage(lang.code)}
            class:active={lang.code === getLanguage()}
          >
            {lang.name}
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <NavigationDivider />
  <NavigationButton on:click={() => window.open("https://discord.gg/5EZ2Ngreys", '_blank')}>
    Discord 
  </NavigationButton>
  <NavigationButton on:click={() => window.open("https://qm.qq.com/q/xWWYbY59Ys", '_blank')}>
    QQ 
  </NavigationButton>
  <NavigationDivider />
  <NavigationButton on:click={() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore - Using custom window property
      if (window.setActiveTab) {
        // @ts-ignore - Using custom window property
        window.setActiveTab(2);
      }
    }
  }}>
    Settings
  </NavigationButton>
</NavigationBar>
<div id="main">
  <TabManager let:activeTab let:tabs let:handleTabClick let:registerTab activeTab={activeTab}>
    <Tab title={t('tabs.editor')} id={0} {activeTab} {handleTabClick} />
    <Tab title={t('tabs.display')} id={1} {activeTab} {handleTabClick} />
    <Tab title={t('tabs.debugger')} id={3} {activeTab} {handleTabClick} />
    
    <svelte:fragment slot="content" let:activeTab>
      {#if activeTab === 0}
        <div id="editor">
          <div class="editor-search-row">
            <div class="block-search">
              <input
                type="text"
                placeholder={t('editor.searchBlocks')}
                bind:value={blockSearchQuery}
                on:keydown={(event) => {
                  if (event.key === "Enter") {
                    searchBlocks();
                  }
                }}
              />
              <button on:click={() => searchBlocks()}>{t('editor.search')}</button>
              <button on:click={() => gotoSearchMatch(-1)} disabled={blockSearchMatches.length === 0}>{t('editor.prev')}</button>
              <button on:click={() => gotoSearchMatch(1)} disabled={blockSearchMatches.length === 0}>{t('editor.next')}</button>
              <span>
                {#if blockSearchMatches.length > 0}
                  {blockSearchIndex + 1}/{blockSearchMatches.length}
                {:else}
                  0/0
                {/if}
              </span>
            </div>
          </div>
          <div class="editor-main">
            <div class="blockly-container">
              <BlocklyComponent {config} locale={currentBlocklyLocale} bind:workspace />
            </div>
            <div class="code">
              <CodePreview {code} />
            </div>
          </div>
        </div>
      {:else if activeTab === 1}
        <div class="display">
          <div class="properties-panel">
            <PropertiesPicker {properties} on:update={updateGeneratedCode} />
          </div>
          <div class="blocks-panel">
            <BlocksMenu />
          </div>
        </div>
      {:else if activeTab === 2}
        <div class="settings">
          <h2>{t('settings.general')} {t('tabs.settings')}</h2>
          <div class="settings-panel">
            <div class="setting-group">
              <h3>{t('settings.general')}</h3>
              <div class="setting-item">
                <label for="project-name">{t('properties.projectName')}</label>
                <input id="project-name" type="text" bind:value={properties.name} on:input={updateGeneratedCode} />
              </div>
              <div class="setting-item">
                <label for="project-id">{t('properties.projectId')}</label>
                <input id="project-id" type="text" bind:value={properties.id} on:input={updateGeneratedCode} />
              </div>
              <div class="setting-item">
                <label for="project-color">{t('properties.projectColor')}</label>
                <input id="project-color" type="color" bind:value={properties.color} on:input={updateGeneratedCode} />
              </div>
            </div>
            <div class="setting-group">
              <h3>{t('settings.editor')}</h3>
              <div class="setting-item">
                <label for="dark-mode">{t('settings.darkMode')}</label>
                <input id="dark-mode" type="checkbox" checked={localConfig.dark} on:change={() => {
                  localConfig.dark = !localConfig.dark;
                  updateTheme();
                }} />
              </div>
            </div>
            <div class="setting-group">
              <h3>{t('settings.export')}</h3>
              <div class="setting-item">
                <label for="minify-code">{t('settings.minifyCode')}</label>
                <input id="minify-code" type="checkbox" bind:checked={exportConfig.minify} />
              </div>
              <div class="setting-item">
                <label for="include-comments">{t('settings.includeComments')}</label>
                <input id="include-comments" type="checkbox" bind:checked={exportConfig.includeComments} />
              </div>
              <div class="export-buttons">
                <button on:click={() => exportAsJS()}>{t('export.exportAsJS')}</button>
                <button on:click={() => exportAsEXF()}>{t('export.exportAsEXF')}</button>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === 3}
        <div class="debugger">
          <div class="debugger-toolbar">
            <label>
              {t('debugger.source')}
              <input value={DEBUGGER_EDITOR_BASE_URL} readonly />
            </label>
            <button on:click={copyExtensionUrl}>{copiedExtensionUrl ? t('debugger.urlCopied') : t('debugger.copyUrl')}</button>
            <button on:click={openDebuggerInNewTab}>{t('debugger.openInNewTab')}</button>
          </div>
          {#if loadError}
            <p class="debugger-error">{loadError}</p>
          {/if}
          <p class="debugger-status">
            Imported Extension: <b>{properties.name}</b> (`{properties.id}`)
          </p>
          <label class="debugger-extension-uri">
            {t('debugger.extensionUrl')}
            <input value={debuggerExtensionUri} readonly />
          </label>
          <p class="debugger-note">
            {t('debugger.debuggerNote')}
          </p>
          <p class="debugger-note">{t('debugger.lastDraftAutoSave')}: {lastAutoSaveAt || t('debugger.notYet')}</p>
          {#if recentFiles.length > 0}
            <div class="recent-files">
              <span>{t('debugger.recentFiles')}:</span>
              <ul>
                {#each recentFiles as file}
                  <li>{file.name} - {file.time}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

      {/if}
    </svelte:fragment>
  </TabManager>
</div>
<ExperimentsModal />
<CreateVariableModal />
<EditBlockModal />
<ExportModal />

<style>
  #main {
    padding-top: 3rem;
    height: calc(100% - 3rem);
  }

  #editor {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .editor-search-row {
    display: flex;
    justify-content: center;
    padding: 0.45rem 0.6rem 0.35rem;
    border-bottom: 1px solid #0001;
    background: #ffffffcf;
  }

  .editor-main {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .blockly-container {
    width: calc(100vw - 480px);
    height: 100%;
  }

  .block-search {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: #ffffffdd;
    border: 1px solid #0002;
    border-radius: 0.55rem;
    padding: 0.35rem 0.45rem;
    backdrop-filter: blur(4px);
  }

  .block-search input {
    width: 300px;
    border: 1px solid #0002;
    border-radius: 0.4rem;
    padding: 0.25rem 0.4rem;
    background: #fff;
  }

  .block-search button {
    border: none;
    border-radius: 0.35rem;
    padding: 0.25rem 0.5rem;
    background: #6fff98;
    font-weight: 700;
    cursor: pointer;
  }

  .block-search button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: grayscale(0.2);
  }

  .block-search span {
    min-width: 2.8rem;
    text-align: center;
    font-size: 0.8rem;
    color: #000b;
  }

  .code {
    width: 480px;
    height: 100%;
  }

  .display {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
    box-sizing: border-box;
    padding: 0.75rem;
  }

  .properties-panel {
    min-height: 210px;
    border-radius: 8px;
    background: #00000008;
  }

  .blocks-panel {
    min-height: 0;
    flex: 1;
    border-radius: 8px;
    background: #00000008;
    overflow: auto;
  }

  .debugger {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-sizing: border-box;
    height: 100%;
  }

  .debugger-toolbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .debugger-toolbar label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
  }

  .debugger-toolbar label input {
    border: 1px solid #0002;
    border-radius: 0.35rem;
    padding: 0.25rem 0.45rem;
    background: #fff;
    color: inherit;
    min-width: 280px;
  }

  .debugger-toolbar button {
    border: none;
    border-radius: 0.4rem;
    padding: 0.35rem 0.7rem;
    cursor: pointer;
    background: #6fff98;
    font-weight: 700;
  }

  .debugger-status, .debugger-note {
    margin: 0;
    font-size: 0.875rem;
  }

  .debugger-error {
    margin: 0;
    padding: 0.45rem 0.6rem;
    border-radius: 0.45rem;
    background: #ff4f4f22;
    color: #9f1515;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .recent-files {
    font-size: 0.82rem;
    padding: 0.45rem 0.6rem;
    border-radius: 0.45rem;
    background: #00000008;
  }

  .recent-files ul {
    margin: 0.25rem 0 0;
    padding-left: 1rem;
  }

  .recent-files li {
    line-height: 1.35;
  }

  .debugger-extension-uri {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.875rem;
  }

  .debugger-extension-uri input {
    border: 1px solid #0002;
    border-radius: 0.4rem;
    padding: 0.35rem 0.5rem;
    background: #fff;
    color: inherit;
    width: 100%;
    box-sizing: border-box;
    font-family: monospace;
    font-size: 0.75rem;
  }

  :global(.dark) .properties-panel,
  :global(.dark) .blocks-panel {
    background: #ffffff08;
  }

  :global(.dark) .block-search {
    background: #111d;
    border-color: #fff2;
  }

  :global(.dark) .block-search input {
    background: #111;
    color: #fff;
    border-color: #fff2;
  }

  :global(.dark) .block-search span {
    color: #fffc;
  }

  :global(.dark) .editor-search-row {
    background: #111c;
    border-bottom-color: #fff2;
  }

  :global(.dark) .debugger-extension-uri input {
    background: #111;
    border-color: #fff2;
  }
  :global(.dark) .debugger-error {
    background: #ff4f4f2e;
    color: #ffc0c0;
  }
  :global(.dark) .recent-files {
    background: #ffffff08;
  }

  :global(.dark) .debugger-toolbar label input {
        background: #111;
        border-color: #fff2;
    }

    .settings {
        padding: 1rem;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
    }

    .settings h2 {
        margin-top: 0;
        color: #333;
    }

    .settings-panel {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .setting-group {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .setting-group h3 {
        margin-top: 0;
        color: #ff9800;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
    }

    .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
    }

    .setting-item label {
        font-weight: 600;
        color: #555;
    }

    .setting-item input {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #fff;
    }

    .setting-item input[type="checkbox"] {
        width: auto;
    }

    .export-buttons {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }

    .export-buttons button {
        background: #4bf;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .export-buttons button:hover {
        background: #38d;
    }

    :global(.dark) .export-buttons button {
        background: #3a9;
    }

    :global(.dark) .export-buttons button:hover {
        background: #287;
    }

    :global(.dark) .settings h2 {
        color: #fff;
    }

    :global(.dark) .setting-group {
        background: #333;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    :global(.dark) .setting-group h3 {
        color: #ffb74d;
        border-bottom-color: #555;
    }

    :global(.dark) .setting-item label {
        color: #ddd;
    }

    :global(.dark) .setting-item input {
        background: #111;
        border-color: #555;
        color: #fff;
    }

    @media (max-width: 1280px) {
        .blockly-container {
            width: 100vw;
        }

        .block-search input {
            width: min(52vw, 280px);
        }

        .code {
            display: none;
        }

        .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .setting-item input {
            width: 100%;
            box-sizing: border-box;
        }

    }

  /* Language menu styles */
  .language-menu-container {
    position: relative;
    display: inline-block;
  }

  .language-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 180px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
  }

  .language-item {
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 1px solid #f8f9fa;
  }

  .language-item:hover {
    background-color: #f8f9fa;
  }

  .language-item.active {
    background-color: #007bff;
    color: white;
  }

  .language-item:last-child {
    border-bottom: none;
  }

  :global(.dark) .language-menu {
    background: #343a40;
    border-color: #495057;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  :global(.dark) .language-item {
    border-bottom-color: #495057;
    color: #e9ecef;
  }

  :global(.dark) .language-item:hover {
    background-color: #495057;
  }

  :global(.dark) .language-item.active {
    background-color: #007bff;
    color: white;
  }
</style>
