import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'advanced_';
const categoryColor = '#5C81A6';

// Ensure translations exist before registering blocks
function ensureTranslationsExist() {
    const translations = {
        BKY_ADVANCED_RANDOM: 'random number from %1 to %2',
        BKY_ADVANCED_POWER: '%1 to the power of %2',
        BKY_ADVANCED_LENGTH: 'length of %1',
        BKY_ADVANCED_CONCAT: 'join %1 and %2',
        BKY_ADVANCED_ARRAYLENGTH: 'length of %1',
        BKY_ADVANCED_ARRAYPUSH: 'add %1 to %2',
        BKY_ADVANCED_DATETIME: 'current date and time',
        BKY_ADVANCED_YEAR: 'year of %1'
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
    registerBlock(`${categoryPrefix}math_random`, {
        message0: '%{BKY_ADVANCED_RANDOM}',
        args0: [
            {
                "type": "input_value",
                "name": "MIN"
            },
            {
                "type": "input_value",
                "name": "MAX"
            }
        ],
        output: "Number",
        colour: categoryColor
    }, (block) => {
        const MIN = javascriptGenerator.valueToCode(block, 'MIN', 0);
        const MAX = javascriptGenerator.valueToCode(block, 'MAX', 0);
        const code = `Math.floor(Math.random() * (${MAX} - ${MIN} + 1)) + ${MIN}`;
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}math_pow`, {
        message0: '%{BKY_ADVANCED_POWER}',
        args0: [
            {
                "type": "input_value",
                "name": "BASE"
            },
            {
                "type": "input_value",
                "name": "EXPONENT"
            }
        ],
        output: "Number",
        colour: categoryColor
    }, (block) => {
        const BASE = javascriptGenerator.valueToCode(block, 'BASE', 0);
        const EXPONENT = javascriptGenerator.valueToCode(block, 'EXPONENT', 0);
        const code = `Math.pow(${BASE}, ${EXPONENT})`;
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}string_length`, {
        message0: '%{BKY_ADVANCED_LENGTH}',
        args0: [
            {
                "type": "input_value",
                "name": "STRING"
            }
        ],
        output: "Number",
        colour: categoryColor
    }, (block) => {
        const STRING = javascriptGenerator.valueToCode(block, 'STRING', 0);
        const code = `${STRING}.length`;
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}string_concat`, {
        message0: '%{BKY_ADVANCED_CONCAT}',
        args0: [
            {
                "type": "input_value",
                "name": "STRING1"
            },
            {
                "type": "input_value",
                "name": "STRING2"
            }
        ],
        output: "String",
        colour: categoryColor
    }, (block) => {
        const STRING1 = javascriptGenerator.valueToCode(block, 'STRING1', 0);
        const STRING2 = javascriptGenerator.valueToCode(block, 'STRING2', 0);
        const code = `${STRING1} + ${STRING2}`;
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}array_length`, {
        message0: '%{BKY_ADVANCED_ARRAYLENGTH}',
        args0: [
            {
                "type": "input_value",
                "name": "ARRAY"
            }
        ],
        output: "Number",
        colour: categoryColor
    }, (block) => {
        const ARRAY = javascriptGenerator.valueToCode(block, 'ARRAY', 0);
        const code = `${ARRAY}.length`;
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}array_push`, {
        message0: '%{BKY_ADVANCED_ARRAYPUSH}',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE"
            },
            {
                "type": "input_value",
                "name": "ARRAY"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', 0);
        const ARRAY = javascriptGenerator.valueToCode(block, 'ARRAY', 0);
        const code = `${ARRAY}.push(${VALUE});`;
        return code;
    })
    
    registerBlock(`${categoryPrefix}date_now`, {
        message0: '%{BKY_ADVANCED_DATETIME}',
        output: "Date",
        colour: categoryColor
    }, (block) => {
        const code = 'new Date()';
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}date_get_year`, {
        message0: '%{BKY_ADVANCED_YEAR}',
        args0: [
            {
                "type": "input_value",
                "name": "DATE"
            }
        ],
        output: "Number",
        colour: categoryColor
    }, (block) => {
        const DATE = javascriptGenerator.valueToCode(block, 'DATE', 0);
        const code = `${DATE}.getFullYear()`;
        return [code, 0];
    })
}

export default register;