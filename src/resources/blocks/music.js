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

    registerBlock(`${categoryPrefix}settempo`, {
        message0: 'set tempo to %1 bpm',
        args0: [
            {
                type: 'input_value',
                name: 'BPM',
                check: 'Number'
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BPM = javascriptGenerator.valueToCode(block, 'BPM') || '120';
        return `ExtForge.Music.setTempo(${BPM});\n`;
    });

    registerBlock(`${categoryPrefix}tempo`, {
        message0: 'tempo (bpm)',
        args0: [],
        output: 'Number',
        inputsInline: true,
        colour: categoryColor
    }, () => {
        return ['ExtForge.Music.getTempo()', 0];
    });

    registerBlock(`${categoryPrefix}note`, {
        message0: 'play note %1 for %2 beats',
        args0: [
            {
                type: 'field_input',
                name: 'NOTE',
                text: 'C4'
            },
            {
                type: 'input_value',
                name: 'BEATS',
                check: 'Number'
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NOTE = JSON.stringify(block.getFieldValue('NOTE') || "C4");
        const BEATS = javascriptGenerator.valueToCode(block, 'BEATS') || '1';
        return `await ExtForge.Music.playNote(${NOTE}, ${BEATS});\n`;
    });

    registerBlock(`${categoryPrefix}rest`, {
        message0: 'rest for %1 beats',
        args0: [
            {
                type: 'input_value',
                name: 'BEATS',
                check: 'Number'
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BEATS = javascriptGenerator.valueToCode(block, 'BEATS') || '1';
        return `await ExtForge.Music.rest(${BEATS});\n`;
    });
}

export default register;
