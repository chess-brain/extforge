import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'events_';
const categoryColor = '#fc6';

// Ensure translations exist before registering blocks
function ensureTranslationsExist() {
    if (!Blockly.Msg.BKY_EVENTS_LOADED) {
        console.warn('[WARN] BKY_EVENTS_LOADED not found in Blockly.Msg, using fallback');
        Blockly.Msg.BKY_EVENTS_LOADED = 'when extension loaded %1';
    }
    if (!Blockly.Msg.BKY_EVENTS_THREAD) {
        console.warn('[WARN] BKY_EVENTS_THREAD not found in Blockly.Msg, using fallback');
        Blockly.Msg.BKY_EVENTS_THREAD = 'new thread %1';
    }
    if (!Blockly.Msg.BKY_EVENTS_REGBROADCAST) {
        console.warn('[WARN] BKY_EVENTS_REGBROADCAST not found in Blockly.Msg, using fallback');
        Blockly.Msg.BKY_EVENTS_REGBROADCAST = 'when %1 broadcasted %2';
    }
    if (!Blockly.Msg.BKY_EVENTS_BROADCAST) {
        console.warn('[WARN] BKY_EVENTS_BROADCAST not found in Blockly.Msg, using fallback');
        Blockly.Msg.BKY_EVENTS_BROADCAST = 'broadcast %1';
    }
    if (!Blockly.Msg.BKY_EVENTS_BROADCASTW) {
        console.warn('[WARN] BKY_EVENTS_BROADCASTW not found in Blockly.Msg, using fallback');
        Blockly.Msg.BKY_EVENTS_BROADCASTW = 'broadcast %1 and wait';
    }
}

function register() {
    ensureTranslationsExist();
    
    console.log('[DEBUG] Registering events_loaded, Blockly.Msg.BKY_EVENTS_LOADED =', Blockly.Msg.BKY_EVENTS_LOADED);
    
    registerBlock(`${categoryPrefix}loaded`, {
        message0: '%{BKY_EVENTS_LOADED}',
        args0: [
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `(async () => { ${BLOCKS} })();`;
        return `${code}\n`;
    })

    console.log('[DEBUG] Registering events_thread, Blockly.Msg.BKY_EVENTS_THREAD =', Blockly.Msg.BKY_EVENTS_THREAD);
    registerBlock(`${categoryPrefix}thread`, {
        message0: '%{BKY_EVENTS_THREAD}',
        args0: [
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `(async () => { ${BLOCKS} })();`;
        return `${code}\n`;
    })

    //broadcasts
    registerBlock(`${categoryPrefix}regbroadcast`, {
        message0: '%{BKY_EVENTS_REGBROADCAST}',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 2,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `ExtForge.Broadcasts.register(${NAME}, (async () => { ${BLOCKS} })());`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}broadcast`, {
        message0: '%{BKY_EVENTS_BROADCAST}',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `ExtForge.Broadcasts.execute(${NAME});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}broadcastw`, {
        message0: '%{BKY_EVENTS_BROADCASTW}',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `await ExtForge.Broadcasts.execute(${NAME});`;
        return `${code}\n`;
    })
}

export default register;