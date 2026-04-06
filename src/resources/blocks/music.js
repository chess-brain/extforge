import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = 'music_';
const categoryColor = '#c4c';

function register() {
    registerBlock(`${categoryPrefix}tone`, {
        message0: 'play tone %1 Hz for %2 ms',
        args0: [
            {
                type: 'input_value',
                name: 'FREQUENCY',
                check: 'Number'
            },
            {
                type: 'input_value',
                name: 'DURATION',
                check: 'Number'
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const FREQUENCY = javascriptGenerator.valueToCode(block, 'FREQUENCY') || '440';
        const DURATION = javascriptGenerator.valueToCode(block, 'DURATION') || '200';
        return `await ExtForge.Music.playTone(${FREQUENCY}, ${DURATION});\n`;
    });

    registerBlock(`${categoryPrefix}stop`, {
        message0: 'stop all sounds',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, () => {
        return `ExtForge.Music.stopAll();\n`;
    });

    registerBlock(`${categoryPrefix}setvolume`, {
        message0: 'set music volume to %1 %',
        args0: [
            {
                type: 'input_value',
                name: 'VOLUME',
                check: 'Number'
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VOLUME = javascriptGenerator.valueToCode(block, 'VOLUME') || '50';
        return `ExtForge.Music.setVolume(${VOLUME});\n`;
    });

    registerBlock(`${categoryPrefix}volume`, {
        message0: 'music volume',
        args0: [],
        output: 'Number',
        inputsInline: true,
        colour: categoryColor
    }, () => {
        return ['ExtForge.Music.getVolume()', 0];
    });
}

export default register;
