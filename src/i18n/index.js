// 语言管理文件
import enUS from './en-US.js';
import enUK from './en-UK.js';
import enCA from './en-CA.js';
import enAU from './en-AU.js';
import zhCN from './zh-CN.js';
import zhTW from './zh-TW.js';
import fr from './fr.js';
import es from './es.js';
import de from './de.js';
import ja from './ja.js';
import ar from './ar.js';
import pt from './pt.js';
import ru from './ru.js';

const languages = {
  'en-US': enUS,
  'en-UK': enUK,
  'en-CA': enCA,
  'en-AU': enAU,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'fr': fr,
  'es': es,
  'de': de,
  'ja': ja,
  'ar': ar,
  'pt': pt,
  'ru': ru
};

let currentLanguage = 'zh-CN';
let listeners = [];

// 添加语言变化监听器
export function addLanguageChangeListener(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

// 通知所有监听器语言变化
function notifyLanguageChange() {
  listeners.forEach(listener => listener(currentLanguage));
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  if (languages[lang]) {
    currentLanguage = lang;
    localStorage.setItem('extforge_language', lang);
    notifyLanguageChange();
    return true;
  }
  return false;
}

export function t(key) {
  const lang = languages[currentLanguage];
  const enLang = languages['en-US'];
  
  // 处理嵌套的键结构，如 nav.export
  const keys = key.split('.');
  let value = lang;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }
  
  // 如果当前语言中没有找到，尝试在英文中查找
  if (value === undefined) {
    value = enLang;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
  }
  
  return value !== undefined ? value : key;
}

export function initLanguage() {
  const savedLang = localStorage.getItem('extforge_language');
  if (savedLang && languages[savedLang]) {
    currentLanguage = savedLang;
    notifyLanguageChange();
  } else {
    // Default to Chinese if no language is saved
    currentLanguage = 'zh-CN';
    localStorage.setItem('extforge_language', 'zh-CN');
    notifyLanguageChange();
  }
}

export function getAvailableLanguages() {
  return Object.keys(languages).map(code => ({
    code,
    name: languages[code].languageName || code
  }));
}
