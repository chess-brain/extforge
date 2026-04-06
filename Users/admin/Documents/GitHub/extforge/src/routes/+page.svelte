<script lang="ts">
  
  function resetProject() {
    if (!workspace) return;
    if (!confirm("Reset the current project? This will clear all blocks and custom data.")) {
      return;
    }

    try {
      workspace.clear();
    } catch {}

    properties.name = "Extension";
    properties.id = "extensionID";
    properties.color = "#6FFF98";
    window.variables = {};
    window.blocks = {};
    blockSearchQuery = "";
    blockSearchMatches = [];
    blockSearchIndex = -1;
    loadError = "";
    updateGeneratedCode();
  }
  
  function deleteAllBlocks() {
    if (!workspace) return;
    if (!confirm("Delete all blocks? This action cannot be undone.")) {
      return;
    }
    
    try {
      workspace.clear();
      updateGeneratedCode();
    } catch (error) {
      console.error("Failed to delete blocks:", error);
    }
  }
  
  function expandAllBlocks() {
    if (!workspace) return;
    
    const blocks = workspace.getAllBlocks(false);
    blocks.forEach(block => {
      if (block.isCollapsed()) {
        block.expand();
      }
    });
    
    updateGeneratedCode();
  }
  
  // 新增：收起所有积木的功能
  function collapseAllBlocks() {
    if (!workspace) return;
    
    const blocks = workspace.getAllBlocks(false);
    blocks.forEach(block => {
      if (!block.isCollapsed()) {
        block.collapse();
      }
    });
    
    updateGeneratedCode();
  }
  
  // 新增：修复标签页布局问题的函数
  function fixTabLayout() {
    const tabManager = document.querySelector('.tab-manager');
    if (tabManager) {
      tabManager.style.display = 'flex';
      tabManager.style.flexDirection = 'column';
      tabManager.style.height = '100%';
    }
  }
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
  <NavigationButton icon={NavIconExit} on:click={resetProject}>
    Reset
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
  <NavigationButton on:click={deleteAllBlocks}>
    Delete All Blocks
  </NavigationButton>
  <NavigationButton on:click={expandAllBlocks}>
    Expand All Blocks
  </NavigationButton>
  <NavigationButton on:click={collapseAllBlocks}>
    Collapse All Blocks
  </NavigationButton>
</NavigationBar>

<div id="main">
  <TabManager let:activeTab let:tabs let:handleTabClick let:registerTab>
    <Tab name="Blocks" on:click={handleTabClick} {registerTab}>
      <div class="block-search">
        <input type="text" placeholder="Search blocks..." bind:value={blockSearchQuery} on:input={searchBlocks} />
      </div>
      <div class="block-list">
        {#each blockSearchMatches as block}
          <div class="block-item" on:click={() => insertBlock(block)}>
            <span>{block.name}</span>
          </div>
        {/each}
      </div>
    </Tab>
    <Tab name="Code" on:click={handleTabClick} {registerTab}>
      <div class="code">
        <pre>{generatedCode}</pre>
      </div>
    </Tab>
    <Tab name="Properties" on:click={handleTabClick} {registerTab}>
      <div class="properties">
        <label>
          Name:
          <input type="text" bind:value={properties.name} on:input={updateGeneratedCode} />
        </label>
        <label>
          ID:
          <input type="text" bind:value={properties.id} on:input={updateGeneratedCode} />
        </label>
        <label>
          Color:
          <input type="color" bind:value={properties.color} on:input={updateGeneratedCode} />
        </label>
      </div>
    </Tab>
  </TabManager>
</div>

<script>
  // 在页面加载完成后修复标签页布局
  onMount(() => {
    fixTabLayout();
  });
</script>

<style>
  #main {
    padding-top: 3rem;
    height: calc(100% - 3rem);
  }

  .tab-manager {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .tab-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow-x: auto;
    scroll-behavior: smooth;
  }

  .tab-header button {
    min-width: 120px;
    flex-shrink: 1;
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
  }
</style>