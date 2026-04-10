import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = 'events_';
const categoryColor = '#fc6';

function register() {
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