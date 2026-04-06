import javascriptGenerator from '../javascriptGenerator';
import util from '../util';

const start = `
if (!Scratch.extensions.unsandboxed) {
    alert("This extension needs to be unsandboxed to run!")
    return
}

const ExtForge = {
    Broadcasts: new function() {
        this.raw_ = {};
        this.register = (name, blocks) => {
            this.raw_[name] = blocks;
        };
        this.execute = async (name) => {
            if (this.raw_[name]) {
                await this.raw_[name]();
            };
        };
    },

    Variables: new function() {
        this.raw_ = {};
        this.set = (name, value) => {
            this.raw_[name] = value;
        };
        this.get = (name) => {
            return this.raw_[name] ?? null;
        }
    },

    Vector: class {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        static from(v) {
            if (v instanceof ExtForge.Vector) return v
            if (v instanceof Array) return new ExtForge.Vector(Number(v[0]), Number(v[1]))
            if (v instanceof Object) return new ExtForge.Vector(Number(v.x), Number(v.y))
            return new ExtForge.Vector()
        }

        add(v) {
            return new Vector(this.x + v.x, this.y + v.y);
        }

        set(x, y) {
            return new Vector(x ?? this.x, y ?? this.y)
        }
    },

    Utils: {
        setList: (list, index, value) => {
            [...list][index] = value;
            return list;
        },
        uniqueList: (list) => {
            return [...new Set(list ?? [])];
        },
        sortList: (list, mode) => {
            const source = [...(list ?? [])];
            if (mode === "num_asc") return source.sort((a, b) => Number(a) - Number(b));
            if (mode === "num_desc") return source.sort((a, b) => Number(b) - Number(a));
            if (mode === "text_desc") return source.sort((a, b) => String(b).localeCompare(String(a)));
            return source.sort((a, b) => String(a).localeCompare(String(b)));
        },
        filterContains: (list, text) => {
            const query = String(text ?? "").toLowerCase();
            return (list ?? []).filter(v => String(v).toLowerCase().includes(query));
        },
        lists_foreach: {
            index: [0],
            value: [null],
            depth: 0
        },
        countString: (x, y) => {
            return y.length == 0 ? 0 : x.split(y).length - 1
        }
    },

    Music: new function() {
        this.context = null;
        this.masterGain = null;
        this.activeNodes = new Set();
        this.volume = 0.5;
        this.bpm = 120;

        this.ensureContext = () => {
            if (!this.context) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) {
                    throw new Error("Web Audio API is not supported in this environment.");
                }
                this.context = new AudioContextClass();
                this.masterGain = this.context.createGain();
                this.masterGain.gain.value = this.volume;
                this.masterGain.connect(this.context.destination);
            }
            if (this.context.state === "suspended") {
                this.context.resume();
            }
        };

        this.setVolume = (value) => {
            this.ensureContext();
            const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
            this.volume = safeValue / 100;
            this.masterGain.gain.value = this.volume;
        };

        this.getVolume = () => {
            return Math.round(this.volume * 100);
        };

        this.playTone = async (frequency, durationMs) => {
            this.ensureContext();
            const safeFrequency = Math.max(20, Number(frequency) || 440);
            const safeDuration = Math.max(0, Number(durationMs) || 200);

            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = safeFrequency;

            gain.gain.setValueAtTime(0, this.context.currentTime);
            gain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, this.context.currentTime + safeDuration / 1000);

            oscillator.connect(gain);
            gain.connect(this.masterGain);
            oscillator.start();
            oscillator.stop(this.context.currentTime + safeDuration / 1000 + 0.02);
            this.activeNodes.add(oscillator);

            await new Promise(resolve => setTimeout(resolve, safeDuration));
            this.activeNodes.delete(oscillator);
        };

        this.stopAll = () => {
            for (const oscillator of this.activeNodes) {
                try {
                    oscillator.stop();
                } catch {}
            }
            this.activeNodes.clear();
        };

        this.noteToFrequency = (note) => {
            const match = String(note ?? "A4").trim().toUpperCase().match(/^([A-G])([#B]?)(-?\d)$/);
            if (!match) return 440;
            const [, pitch, accidental, octaveRaw] = match;
            const octave = Number(octaveRaw);
            const table = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
            let semitone = table[pitch] ?? 0;
            if (accidental === "#") semitone += 1;
            if (accidental === "B") semitone -= 1;
            semitone += (octave - 4) * 12;
            return 440 * (2 ** (semitone / 12));
        };

        this.setTempo = (bpm) => {
            this.bpm = Math.max(20, Math.min(320, Number(bpm) || 120));
        };
        this.getTempo = () => this.bpm;

        this.playNote = async (note, beats) => {
            const durationMs = (60000 / this.bpm) * Math.max(0, Number(beats) || 1);
            const frequency = this.noteToFrequency(note);
            await this.playTone(frequency, durationMs);
        };

        this.rest = async (beats) => {
            const durationMs = (60000 / this.bpm) * Math.max(0, Number(beats) || 1);
            await new Promise(resolve => setTimeout(resolve, durationMs));
        };
    }
}
`

class Compiler {
    /**
     * Generates JavaScript code from the provided workspace & info.
     * @param {import('blockly').Workspace} workspace 
     * @param {object} properties
     * @returns {string} Generated code.
     */
    compile(workspace, properties) {
        const code = javascriptGenerator.workspaceToCode(workspace);

        const headerCode = [
            `/*`,
            `   Created with CB-ExtGallary`,
            `   https://chessbrain.qzz.io/CB-ExtGallary`,
            `   QQ Group: https://qm.qq.com/q/xWWYbY59Ys`,
            `   Discord: https://discord.gg/5EZ2Ngreys`,
            `   Bilibili: https://space.bilibili.com/3546720759712433`,
            `*/`,
            `(async function (Scratch) {`,
            `const variables = {};`,
            ``,
            start
        ];
        const classRegistry = {
            top: [
                `class Extension {`
            ],
            extensionInfo: {},
            bottom: [
                `}`,
                ``,
                `let extension = new Extension();`,
                `// code compiled from CB-ExtGallary`
            ]
        }
        const footerCode = [
            `Scratch.extensions.register(extension);`,
            `})(Scratch);`
        ];

        /** turbobuilder stuff need to port over
        if (imageStates) {
            if (imageStates.icon.image) {
                // add icon uri
                const url = imageStates.icon.image;
                classRegistry.extensionInfo.blockIconURI = url;
            }
            if (imageStates.menuicon.image) {
                // add icon uri
                const url = imageStates.menuicon.image;
                classRegistry.extensionInfo.menuIconURI = url;
            }
        }**/
        classRegistry.extensionInfo.id = properties.id;
        classRegistry.extensionInfo.name = properties.name;
        classRegistry.extensionInfo.color1 = properties.color;
        classRegistry.extensionInfo.blocks = Object.entries(window.blocks ?? {}).map(([id, block]) => {
            return {
                opcode: `block_${id}`,
                text: util.blockToExtensionText(block.fields),
                blockType: block.type,
                arguments: Object.fromEntries(block.fields.filter(v => v.type !== 'label').map(v => {
                    switch (v.type) {
                        case 'string': {
                            return [v.id, {
                                type: "string",
                                defaultValue: v.default
                            }]
                        }
                        case 'number': {
                            return [v.id, {
                                type: "number",
                                defaultValue: Number(v.default) || 0
                            }]
                        }
                        case 'boolean': {
                            return [v.id, {
                                type: "Boolean"
                            }]
                        }
                    }
                }))
            }
        })

        return [].concat(headerCode, classRegistry.top, [
            `getInfo() {`,
            `   return ${JSON.stringify(classRegistry.extensionInfo).substring(0, JSON.stringify(classRegistry.extensionInfo).length - 1)}}`,
            `}`,
        ], Object.entries(window.blocks ?? {}).map(([id, block]) => {
            let blockCode = javascriptGenerator.statementToCode(
                workspace.getTopBlocks().find(v => v.type == "blocks_define" && v.blockId_ == id),
                "BLOCKS"
            )
            return `async block_${id}(args) { ${blockCode} }`
        }), classRegistry.bottom, code, footerCode).join('\n');
    }
}

export default Compiler;
