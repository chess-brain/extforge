import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'runtime_';
const categoryColor = '#6FFF98';

// Ensure translations exist before registering blocks
function ensureTranslationsExist() {
    const translations = {
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
        BKY_RUNTIME_BROADCAST: 'broadcast project %1'
    };
    
    Object.entries(translations).forEach(([key, value]) => {
        if (!Blockly.Msg[key]) {
            console.warn(`[WARN] ${key} not found in Blockly.Msg, using fallback`);
            Blockly.Msg[key] = value;
        }
    });
}

function register() {
    ensureTranslationsExist();
    registerBlock(`${categoryPrefix}start`, {
        message0: '%{BKY_RUNTIME_START}',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.greenFlag();`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}stop`, {
        message0: '%{BKY_RUNTIME_STOP}',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.stopAll();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}running`, {
        message0: '%{BKY_RUNTIME_RUNNING}',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(Scratch.vm.runtime.threads.length > 0)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}onstart`, {
        message0: '%{BKY_RUNTIME_ONSTART}',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `Scratch.vm.on('PROJECT_RUN_START', (async () => { ${BLOCKS} }));`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}onstop`, {
        message0: '%{BKY_RUNTIME_ONSTOP}',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `Scratch.vm.on('PROJECT_RUN_STOP', (async () => { ${BLOCKS} }));`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}beforetick`, {
        message0: '%{BKY_RUNTIME_BEFORETICK}',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `Scratch.vm.on('BEFORE_EXECUTE', (async () => { ${BLOCKS} }));`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}aftertick`, {
        message0: '%{BKY_RUNTIME_AFTERTICK}',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `Scratch.vm.on('AFTER_EXECUTE', (async () => { ${BLOCKS} }));`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}turboget`, {
        message0: '%{BKY_RUNTIME_TURBOGET}',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.turboMode`;
        return [`${code}`, 0];
    })
    registerBlock(`${categoryPrefix}turboset`, {
        message0: '%{BKY_RUNTIME_TURBOSET}',
        args0: [
            {
                "type": "input_value",
                "name": "INPUT",
                "check": "Boolean"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT')
        const code = `Scratch.vm.runtime.turboMode = ${INPUT};`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}frameget`, {
        message0: '%{BKY_RUNTIME_FRAMEGET}',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.frameLoop.framerate`;
        return [`${code}`, 0];
    })
    registerBlock(`${categoryPrefix}frameset`, {
        message0: '%{BKY_RUNTIME_FRAMESET}',
        args0: [
            {
                "type": "field_number",
                "name": "INPUT",
                "check": "Number",
                "value": 30,
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT')
        const code = `Scratch.vm.runtime.frameLoop.setFramerate(${INPUT});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}timer`, {
        message0: '%{BKY_RUNTIME_TIMER}',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.clock.projectTimer()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}broadcast`, {
        message0: '%{BKY_RUNTIME_BROADCAST}',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        let NAME = javascriptGenerator.valueToCode(block, 'NAME');

        return `Scratch.vm.runtime.startHats("event_whenbroadcastreceived", {BROADCAST_OPTION: ${NAME}})`;
    })
}

export default register;