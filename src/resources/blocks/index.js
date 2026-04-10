import registerGeneric from "./generic";
import registerEvents from "./events";
import registerControl from "./control";
import registerMath from "./math";
import registerStrings from "./strings";
import registerVectors from "./vectors";
import registerInputs from "./inputs";
import registerVariables from "./variables";
import registerLists from "./lists";
import registerBlocks from "./blocks";
import registerExtra from "./extra";
import registerAdvanced from "./advanced";

import registerRuntime from "./runtime";
import registerScript from "./script";
import registerMusic from "./music";

import Blockly from 'blockly/core';

// Custom block translations fallback (in case Blockly.Msg is cleared during HMR)
const customBlockTranslations = {
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
};

// Ensure custom translations exist in Blockly.Msg (HMR protection)
function ensureCustomTranslations() {
    console.log('[BLOCKS INDEX] Blockly.Msg identity:', Blockly.Msg);
    console.log('[BLOCKS INDEX] Blockly object keys:', Object.keys(Blockly).slice(0, 5));
    
    Object.entries(customBlockTranslations).forEach(([key, value]) => {
        if (!Blockly.Msg[key] || typeof Blockly.Msg[key] !== 'string') {
            console.warn(`[HMR Protection] Restoring missing translation: ${key} = "${value}"`);
            Blockly.Msg[key] = value;
        } else {
            console.log(`[HMR Protection] ${key} exists: "${Blockly.Msg[key]}"`);
        }
    });
}

export default () => {
    // CRITICAL: Ensure translations exist before registering any blocks
    // This protects against HMR clearing Blockly.Msg
    console.log('[BLOCKS INDEX] ensureCustomTranslations called');
    ensureCustomTranslations();
    
    console.log('[BLOCKS INDEX] Before registerGeneric, BKY_EVENTS_LOADED =', Blockly.Msg.BKY_EVENTS_LOADED);
    registerGeneric();
    console.log('[BLOCKS INDEX] After registerGeneric');
    
    console.log('[BLOCKS INDEX] Before registerEvents, BKY_EVENTS_LOADED =', Blockly.Msg.BKY_EVENTS_LOADED);
    registerEvents();
    console.log('[BLOCKS INDEX] After registerEvents');
    
    registerControl();
    registerMath();
    registerStrings();
    registerVectors();
    registerInputs();
    registerVariables();
    registerLists();
    registerBlocks();
    registerExtra();
    registerAdvanced();

    registerRuntime();
    registerScript();
    registerMusic();
    
    console.log('[BLOCKS INDEX] All blocks registered');
}