import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = '';
const categoryColor = '#5C81A6';

function register() {
    registerBlock('return', {
        message0: '%{BKY_GENERIC_RETURN}',
        args0: [
            {
                "type": "field_input",
                "name": "X",
                "check": null,
                "text": "0",
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        let X = javascriptGenerator.valueToCode(block, 'X')
        return `return (${X})`
    })
}

export default register
