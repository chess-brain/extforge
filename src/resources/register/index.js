import Blockly from 'blockly/core';
import javascriptGenerator from '../javascriptGenerator';
import convertArgToBlock from '../argBlocks'

/**
 * @param {(block: Blockly.Block) => string} compileFunction 
 */
export function registerBlock(blockName, jsonData, compileFunction) {
    jsonData.type = blockName

    // Unregister existing block if it exists (for HMR support)
    if (Blockly.Blocks[blockName]) {
        delete Blockly.Blocks[blockName];
    }

    const blockObject = {
        init: function () {
            this.jsonInit(jsonData);
        },
        order: jsonData.order || 0, //custom block ordering system
        isDual: function () {
            return this.outputConnection && (this.previousConnection || this.nextConnection)
        }
    };

    // idk why i did it this way olo
    for (let message = 0; jsonData[`message${message}`]; message++) {
        if (jsonData[`args${message}`]) {
            const args = jsonData[`args${message}`]
            for (let idx = 0, arg; arg = args[idx]; idx++)
                args[idx] = convertArgToBlock(arg, jsonData.colour, blockName, blockObject)
        }
    }

    // register visual block
    Blockly.Blocks[blockName] = blockObject

    // register block compile function
    javascriptGenerator[blockName] = compileFunction;
}

export function registerMutator(mutatorName, ...args) {
    if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered(mutatorName)) {
        Blockly.Extensions.unregister(mutatorName)
    }
    Blockly.Extensions.registerMutator(mutatorName, ...args);
}

export function registerExtension(extensionName, callback) {
    if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.unregister(extensionName);
    }
    Blockly.Extensions.register(extensionName, callback);
}
