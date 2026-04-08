// 中文（简体）翻译
export default {
  languageName: '中文（简体）',
  // 导航
  nav: {
    export: '导出',
    load: '加载',
    reset: '重置',
    saveDraft: '保存草稿',
    restoreDraft: '恢复草稿',
    experiments: '实验',
    language: '语言',
    discord: 'Discord',
    qq: 'QQ',
    settings: '设置'
  },
  // 标签页
  tabs: {
    editor: '编辑器',
    display: '显示',
    settings: '设置',
    debugger: '调试器'
  },
  // 编辑器
  editor: {
    searchBlocks: '按文本或类型搜索积木...',
    search: '搜索',
    prev: '上一个',
    next: '下一个'
  },
  // 属性
  properties: {
    projectName: '项目名称',
    projectId: '项目ID',
    projectColor: '项目颜色',
    id: 'ID',
    color: '颜色'
  },
  // 设置
  settings: {
    general: '常规',
    editor: '编辑器',
    export: '导出',
    darkMode: '深色模式',
    minifyCode: '压缩代码',
    includeComments: '包含注释'
  },
  // 导出
  export: {
    exportAsJS: '导出为JS',
    exportAsEXF: '导出为EXF',
    copyCode: '复制代码',
    exportModalTitle: '导出选项'
  },
  // 调试器
  debugger: {
    source: '源代码',
    openInNewTab: '在新标签页中打开',
    copyUrl: '复制URL',
    urlCopied: 'URL已复制!',
    extensionUrl: '扩展URL',
    debuggerNote: '调试器现在直接在新窗口中打开，以进行稳定测试。',
    lastDraftAutoSave: '上次草稿自动保存',
    notYet: '尚未',
    recentFiles: '最近文件'
  },
  // 消息
  messages: {
    draftSaved: '草稿已保存。',
    noDraftFound: '未找到草稿。',
    draftRestoreFailed: '草稿恢复失败。',
    errorExportingEXF: '导出EXF时出错:',
    failedToExportEXF: '导出EXF文件失败。',
    resetConfirm: '重置当前项目？这将清除所有积木和自定义数据。',
    deleteBlockConfirm: '确定要删除这个积木吗？',
    testingFeature: '测试此功能！'
  },
  // Blockly积木翻译
  blocks: {
    // 事件
    EVENTS_LOADED: '当扩展加载 %1',
    EVENTS_THREAD: '新线程 %1',
    EVENTS_REGBROADCAST: '当 %1 广播 %2',
    EVENTS_BROADCAST: '广播 %1',
    EVENTS_BROADCASTW: '广播 %1 并等待',
    // 运行时
    RUNTIME_START: '启动项目',
    RUNTIME_STOP: '停止项目',
    RUNTIME_RUNNING: '项目运行中？',
    RUNTIME_ONSTART: '当项目启动时 %1',
    RUNTIME_ONSTOP: '当项目停止时 %1',
    RUNTIME_BEFORETICK: '在项目刻之前 %1',
    RUNTIME_AFTERTICK: '在项目刻之后 %1',
    RUNTIME_TURBOGET: '加速模式已启用？',
    RUNTIME_TURBOSET: '将加速模式设置为 %1',
    RUNTIME_FRAMEGET: '帧率',
    RUNTIME_FRAMESET: '将帧率设置为 %1',
    RUNTIME_TIMER: '项目计时器',
    RUNTIME_BROADCAST: '广播项目 %1',
    // 控制
    CONTROL_IF: '如果 %1 那么 %2',
    CONTROL_ELSEIF: '否则如果',
    CONTROL_ELSE: '否则',
    CONTROL_WAIT: '等待 %1 秒',
    CONTROL_WAITFRAME: '等待直到下一帧',
    CONTROL_WAITUNTIL: '等待直到 %1',
    CONTROL_WHILE: '当 %1 时重复执行',
    CONTROL_REPEAT: '重复 %1 次',
    CONTROL_RETURN: '返回 %1',
    CONTROL_INLINE: '内联',
    // 高级
    ADVANCED_RANDOM: '随机数从 %1 到 %2',
    ADVANCED_POWER: '%1 的 %2 次方',
    ADVANCED_LENGTH: '%1 的长度',
    ADVANCED_CONCAT: '连接 %1 和 %2',
    ADVANCED_ARRAYLENGTH: '数组 %1 的长度',
    ADVANCED_ARRAYPUSH: '将 %1 添加到数组 %2',
    ADVANCED_DATETIME: '当前日期和时间',
    ADVANCED_YEAR: '%1 的年份',
    // 通用
    GENERIC_RETURN: '返回 %1'
  }
};
