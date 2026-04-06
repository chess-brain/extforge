<script lang="ts">
  import Blockly from "blockly/core";

  import En from "blockly/msg/en";
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
  import NavIconExperiments from "$lib/images/nav/experiments.svg";
  import NavIconDark from "$lib/images/nav/dark.svg";
  import NavIconLang from "$lib/images/nav/language.svg";

  import TabManager from "$lib/TabManager/TabManager.svelte";
  import Tab from "$lib/TabManager/Tab.svelte";

  import ExperimentsModal from "$lib/Modal/ExperimentsModal.svelte";
  import CreateVariableModal from "$lib/Modal/CreateVariableModal.svelte";
  import EditBlockModal from "$lib/Modal/EditBlockModal.svelte";

  import CodePreview from "$lib/CodePreview/CodePreview.svelte";

  import PropertiesPicker from "$lib/PropertiesPicker/PropertiesPicker.svelte";
  import ExportMenu from "$lib/ExportMenu/ExportMenu.svelte";
  import BlocksMenu from "$lib/BlocksMenu/BlocksMenu.svelte";

  const en = {
    rtl: false,
    msg: {
      ...En,
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
  
  import registerBlocks from "../resources/blocks"
  import registerButtons from "../resources/buttons"
  registerBlocks()

  /** @type {import('blockly').Workspace} */
  let workspace;
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

  function updateGeneratedCode() {
    code = compiler.compile(workspace, properties);
    debuggerExtensionUri = getExtensionUri();
    saveDraft(true);
    if (blockSearchQuery.trim()) {
      searchBlocks(true);
    }
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

  onMount(() => {
    code = "";

    window.Blockly = Blockly;
    window.workspace = workspace;
    window.variables = {};
    window.blocks = {};

    registerCategories(workspace);
    registerButtons(workspace);

    readRecentFiles();
    restoreDraft(true);
    updateGeneratedCode();

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
  });
</script>

<NavigationBar>
  <NavigationButton icon={NavIconDark} on:click={() => {
    localConfig.dark = !localConfig.dark;
    updateTheme()
  }}></NavigationButton>
  <NavigationDivider />
  <NavigationButton icon={NavIconSave} on:click={downloadProject}>
    Save
  </NavigationButton>
  <NavigationButton icon={NavIconLoad} on:click={loadProject}>
    Load
  </NavigationButton>
  <NavigationButton on:click={() => saveDraft(false)}>
    Save Draft
  </NavigationButton>
  <NavigationButton on:click={() => restoreDraft(false)}>
    Restore Draft
  </NavigationButton>
  <NavigationDivider />
  <NavigationButton icon={NavIconExperiments} on:click={() => openModal("experiments") }>
    Experiments
  </NavigationButton>
  <NavigationButton icon={NavIconLang} on:click={() => alert("Testing this feature!")}>
    Language
  </NavigationButton>
  <NavigationDivider />
  <NavigationButton on:click={() => window.open("https://discord.gg/5EZ2Ngreys", '_blank')}>
    Discord 
  </NavigationButton>
  <NavigationButton on:click={() => window.open("https://qm.qq.com/q/xWWYbY59Ys", '_blank')}>
    QQ 
  </NavigationButton>
</NavigationBar>
<div id="main">
  <TabManager let:activeTab let:tabs let:handleTabClick let:registerTab>
    <Tab title="Editor" {activeTab} {tabs} {handleTabClick} {registerTab}>
      <div id="editor">
        <div class="blockly-container">
          <div class="block-search">
            <input
              type="text"
              placeholder="Search blocks by text or type..."
              bind:value={blockSearchQuery}
              on:keydown={(event) => {
                if (event.key === "Enter") {
                  searchBlocks();
                }
              }}
            />
            <button on:click={() => searchBlocks()}>Search</button>
            <button on:click={() => gotoSearchMatch(-1)} disabled={blockSearchMatches.length === 0}>Prev</button>
            <button on:click={() => gotoSearchMatch(1)} disabled={blockSearchMatches.length === 0}>Next</button>
            <span>
              {#if blockSearchMatches.length > 0}
                {blockSearchIndex + 1}/{blockSearchMatches.length}
              {:else}
                0/0
              {/if}
            </span>
          </div>
          <BlocklyComponent {config} locale={en} bind:workspace />
        </div>
        <div class="code">
          <CodePreview {code} />
        </div>
      </div>
    </Tab>
    <Tab title="Display" {activeTab} {tabs} {handleTabClick} {registerTab}>
      <div class="display">
        <div class="properties-panel">
          <PropertiesPicker {properties} on:update={updateGeneratedCode} />
        </div>
        <div class="blocks-panel">
          <BlocksMenu />
        </div>
      </div>
    </Tab>
    <Tab title="Debugger(Testing)" {activeTab} {tabs} {handleTabClick} {registerTab}>
      <div class="debugger">
        <div class="debugger-toolbar">
          <label>
            Source
            <input value={DEBUGGER_EDITOR_BASE_URL} readonly />
          </label>
          <button on:click={copyExtensionUrl}>{copiedExtensionUrl ? "Copied" : "Copy Extension URL"}</button>
          <button on:click={openDebuggerInNewTab}>Open 02Engine Debugger</button>
        </div>
        {#if loadError}
          <p class="debugger-error">{loadError}</p>
        {/if}
        <p class="debugger-status">
          Imported Extension: <b>{properties.name}</b> (`{properties.id}`)
        </p>
        <label class="debugger-extension-uri">
          Extension URL
          <input value={debuggerExtensionUri} readonly />
        </label>
        <p class="debugger-note">
          Debugger now opens directly in a new window for stable testing.
        </p>
        <p class="debugger-note">Last draft auto-save: {lastAutoSaveAt || "Not yet"}</p>
        {#if recentFiles.length > 0}
          <div class="recent-files">
            <span>Recent Files:</span>
            <ul>
              {#each recentFiles as file}
                <li>{file.name} - {file.time}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </Tab>
    <Tab title="Export" {activeTab} {tabs} {handleTabClick} {registerTab}>
      <ExportMenu {code} />
    </Tab>
  </TabManager>
</div>
<ExperimentsModal />
<CreateVariableModal />
<EditBlockModal />

<style>
  #main {
    padding-top: 3rem;
    height: calc(100% - 3rem);
  }

  #editor {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .blockly-container {
    width: calc(100vw - 480px);
    height: 100%;
    position: relative;
  }

  .block-search {
    position: absolute;
    top: 0.6rem;
    left: calc(170px + 1rem);
    z-index: 6;
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

  @media (max-width: 1280px) {
    .blockly-container {
      width: 100vw;
    }

    .block-search {
      left: 0.75rem;
      right: 0.75rem;
      width: auto;
    }

    .block-search input {
      width: min(52vw, 280px);
    }

    .code {
      display: none;
    }

  }
</style>
