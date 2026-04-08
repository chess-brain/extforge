// English (US) translations
export default {
  languageName: 'English (US)',
  // Navigation
  nav: {
    export: 'Export',
    load: 'Load',
    reset: 'Reset',
    saveDraft: 'Save Draft',
    restoreDraft: 'Restore Draft',
    experiments: 'Experiments',
    language: 'Language',
    discord: 'Discord',
    qq: 'QQ',
    settings: 'Settings'
  },
  // Tabs
  tabs: {
    editor: 'Editor',
    display: 'Display',
    settings: 'Settings',
    debugger: 'Debugger'
  },
  // Editor
  editor: {
    searchBlocks: 'Search blocks by text or type...',
    search: 'Search',
    prev: 'Prev',
    next: 'Next'
  },
  // Properties
  properties: {
    projectName: 'Project Name',
    projectId: 'Project ID',
    projectColor: 'Project Color',
    id: 'ID',
    color: 'Color'
  },
  // Settings
  settings: {
    general: 'General',
    editor: 'Editor',
    export: 'Export',
    darkMode: 'Dark Mode',
    minifyCode: 'Minify Code',
    includeComments: 'Include Comments'
  },
  // Export
  export: {
    exportAsJS: 'Export as JS',
    exportAsEXF: 'Export as EXF',
    copyCode: 'Copy Code',
    exportModalTitle: 'Export Options'
  },
  // Debugger
  debugger: {
    source: 'Source',
    openInNewTab: 'Open in New Tab',
    copyUrl: 'Copy URL',
    urlCopied: 'URL copied!',
    extensionUrl: 'Extension URL',
    debuggerNote: 'The debugger now opens directly in a new window for stable testing.',
    lastDraftAutoSave: 'Last draft auto-saved',
    notYet: 'Not yet',
    recentFiles: 'Recent Files'
  },
  // Messages
  messages: {
    draftSaved: 'Draft saved.',
    noDraftFound: 'No draft found.',
    draftRestoreFailed: 'Draft restore failed.',
    errorExportingEXF: 'Error exporting EXF:',
    failedToExportEXF: 'Failed to export EXF file.',
    resetConfirm: 'Reset the current project? This will clear all blocks and custom data.',
    deleteBlockConfirm: 'Are you sure you want to delete this block?',
    testingFeature: 'Testing this feature!'
  },
  // Blockly Block Translations
  blocks: {
    // Events
    EVENTS_LOADED: 'when extension loaded %1',
    EVENTS_THREAD: 'new thread %1',
    EVENTS_REGBROADCAST: 'when %1 broadcasted %2',
    EVENTS_BROADCAST: 'broadcast %1',
    EVENTS_BROADCASTW: 'broadcast %1 and wait',
    // Runtime
    RUNTIME_START: 'start project',
    RUNTIME_STOP: 'stop project',
    RUNTIME_RUNNING: 'project running?',
    RUNTIME_ONSTART: 'when project started %1',
    RUNTIME_ONSTOP: 'when project stopped %1',
    RUNTIME_BEFORETICK: 'before project tick %1',
    RUNTIME_AFTERTICK: 'after project tick %1',
    RUNTIME_TURBOGET: 'turbo mode enabled?',
    RUNTIME_TURBOSET: 'set turbo mode to %1',
    RUNTIME_FRAMEGET: 'frame rate',
    RUNTIME_FRAMESET: 'set frame rate to %1',
    RUNTIME_TIMER: 'project timer',
    RUNTIME_BROADCAST: 'broadcast project %1',
    // Control
    CONTROL_IF: 'if %1 then %2',
    CONTROL_ELSEIF: 'else if',
    CONTROL_ELSE: 'else',
    CONTROL_WAIT: 'wait %1 seconds',
    CONTROL_WAITFRAME: 'wait until next frame',
    CONTROL_WAITUNTIL: 'wait until %1',
    CONTROL_WHILE: 'while %1 do',
    CONTROL_REPEAT: 'repeat %1',
    CONTROL_RETURN: 'return %1',
    CONTROL_INLINE: 'inline',
    // Advanced
    ADVANCED_RANDOM: 'random number between %1 and %2',
    ADVANCED_POWER: '%1 to the power of %2',
    ADVANCED_LENGTH: 'length of %1',
    ADVANCED_CONCAT: 'concatenate %1 and %2',
    ADVANCED_ARRAYLENGTH: 'length of array %1',
    ADVANCED_ARRAYPUSH: 'push %1 to array %2',
    ADVANCED_DATETIME: 'current date and time',
    ADVANCED_YEAR: 'year of %1',
    // Generic
    GENERIC_RETURN: 'return %1'
  }
};
