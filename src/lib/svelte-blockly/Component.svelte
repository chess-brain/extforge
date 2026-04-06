<!-- Modified version of svelte-blockly -->
<!-- https://www.npmjs.com/package/svelte-blockly -->

<script context="module"></script>

<script>
    import { createEventDispatcher } from "svelte";
    import Blockly from "blockly/core.js";
    import registerDynamicCategories from "../../resources/categories";
    import iconBlocks from "$lib/images/blockicon/blocks.svg";
    import iconBrowser from "$lib/images/blockicon/browser.svg";
    import iconControl from "$lib/images/blockicon/control.svg";
    import iconEvents from "$lib/images/blockicon/events.svg";
    import iconInput from "$lib/images/blockicon/input.svg";
    import iconLambda from "$lib/images/blockicon/lambda.svg";
    import iconList from "$lib/images/blockicon/list.svg";
    import iconMaths from "$lib/images/blockicon/maths.svg";
    import iconMusic from "$lib/images/blockicon/music.svg";
    import iconRuntime from "$lib/images/blockicon/runtime.svg";
    import iconString from "$lib/images/blockicon/string.svg";
    import iconTargets from "$lib/images/blockicon/targets.svg";
    import iconVariable from "$lib/images/blockicon/variable.svg";
    import iconVector from "$lib/images/blockicon/vector.svg";

    export let config = {};
    export let locale;
    export let workspace = undefined;
    export let transform = undefined;

    const categoryIcons = {
        events: iconEvents,
        control: iconControl,
        math: iconMaths,
        strings: iconString,
        vectors: iconVector,
        inputs: iconInput,
        variables: iconVariable,
        lists: iconList,
        lambdas: iconLambda,
        blocks: iconBlocks,
        runtime: iconRuntime,
        targets: iconTargets,
        browser: iconBrowser,
        music: iconMusic,
        search: iconBrowser,
        favorites: iconBlocks,
    };

    function normalizeCategoryName(name) {
        return (name || "").toLowerCase().replace(/\s+/g, "");
    }

    function applyCategoryIcons(root) {
        const categories = root.querySelectorAll(".blocklyToolboxCategory");
        for (const category of categories) {
            const label = category.querySelector(".blocklyTreeLabel")?.textContent;
            const key = normalizeCategoryName(label);
            const icon = categoryIcons[key];

            if (icon) {
                category.style.setProperty("--category-icon", `url(\"${icon}\")`);
            } else {
                category.style.removeProperty("--category-icon");
            }
        }
    }

    $: {
        // evaluate transform to establish a reactive dependency
        transform;
        applyTransform();
    }
    const dispatch = createEventDispatcher();
    let width, height;
    function initRoot(root, param) {
        function injectWorkspace(dom, { config, locale: { msg, rtl } }) {
            Blockly.setLocale(msg);
            workspace = Blockly.inject(root, {
                ...config,
                toolbox:
                    config.toolbox ? '<xml><category name="Loading..." colour="100"></category></xml>' : null,
                rtl,
            });
            registerDynamicCategories(workspace);
            if (config.toolbox) workspace.updateToolbox(config.toolbox);
            requestAnimationFrame(() => applyCategoryIcons(root));
            workspace.refreshToolboxSelection();
            if (dom !== null) {
                try {
                    // don't record this reloading of the workspace for undo
                    Blockly.Events.recordUndo = false;
                    Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
                    Blockly.Events.recordUndo = true;
                } catch (ex) {
                    console.warn(ex);
                }
            }
            workspace.addChangeListener(() => {
                dispatch("change");
            });
            workspace.addChangeListener(() => {
                requestAnimationFrame(() => applyCategoryIcons(root));
            });
            // TODO this is a terrible hack, but there's no scroll event
            // translate is the most fundamental in a set of methods
            // that move and zoom the workspace
            // using an arrow function, so `this` is the component not the workspace
            const translate = workspace.translate.bind(workspace);
            workspace.translate = (x, y) => {
                translate(x, y);
                const { scrollX, scrollY, scale } = workspace;
                transform = { scrollX, scrollY, scale };
            };
            if (transform !== undefined) {
                applyTransform();
            } else {
                const { scrollX, scrollY, scale } = workspace;
                transform = { scrollX, scrollY, scale };
            }
        }
        injectWorkspace(null, param);
        return {
            update(param) {
                const dom = Blockly.Xml.workspaceToDom(workspace);
                workspace.dispose();
                injectWorkspace(dom, param);
            },
            destroy() {
                workspace.dispose();
                workspace = undefined;
            },
        };
    }
    function applyTransform() {
        if (workspace === undefined) return;
        const { scrollX, scrollY, scale } = transform;
        if (
            scrollX !== workspace.scrollX ||
            scrollY !== workspace.scrollY ||
            scale !== workspace.scale
        ) {
            workspace.setScale(scale);
            workspace.scroll(scrollX, scrollY);
        }
    }
    $: {
        // evaluate width & height to establish a reactive dependency
        width;
        height;
        if (workspace) {
            Blockly.svgResize(workspace);
        }
    }
    // TODO this breaks smooth scrolling; for now, transform is read-only
    // $: {
    // 	if (workspace && transform) {
    // 		const { scrollX, scrollY, scale } = transform;
    // 		workspace.scroll(scrollX, scrollY);
    // 		workspace.setScale(scale);
    // 	}
    // }
</script>

<div
    class="root"
    bind:offsetWidth={width}
    bind:offsetHeight={height}
    use:initRoot={{ config, locale }}
/>

<style>
    .root {
        width: 100%;
        height: 100%;
    }

    :global(.dark .blocklyToolboxDiv) {
        background: #333;
    }

    :global(.blocklyToolboxCategory) {
        width: 128px;
        position: relative;
        padding: 0;
    }
    :global(.blocklyTreeSelected) {
        background-color: initial !important;
    }

    :global(.blocklyTreeLabel) {
        font-family: "Noto Sans";
        font-weight: 500;
        font-size: 14px;
        margin-left: 20px;
        transition: 0.3s cubic-bezier(0, 0, 0.3, 1);
        z-index: 2;
        color: #000;
    }
    :global(.dark .blocklyTreeLabel) {
        color: #fff;
    }
    :global(.blocklyTreeSelected .blocklyTreeLabel) {
        margin-left: 4px;
        font-weight: 700;
        color: #000b;
    }

    :global(.categoryBubble) {
        position: absolute;
        top: 6px;
        left: 4px;
        width: 14px;
        height: 14px;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid #0008;
        transition: 0.3s cubic-bezier(0, 0, 0.3, 1);
        z-index: 1;
    }
    :global(.blocklyToolboxCategory .categoryBubble::after) {
        content: "";
        position: absolute;
        top: 50%;
        left: 2px;
        width: 10px;
        height: 10px;
        transform: translateY(-50%);
        background-image: var(--category-icon);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        opacity: 0.85;
        pointer-events: none;
    }
    :global(.blocklyTreeSelected .categoryBubble) {
        top: 0;
        left: 0;
        width: 128px;
        height: 24px;
        border-radius: 0;
        border-color: #0004;
        border-left: none;
    }
    :global(.blocklyTreeSelected .categoryBubble::after) {
        left: 10px;
        width: 14px;
        height: 14px;
        opacity: 1;
    }

    :global(.blocklyFlyoutButtonBackground) {
        fill: #0000 !important;
        stroke: #575e75;
        stroke-width: 2px;
    }
    :global(.blocklyFlyoutButton:hover .blocklyFlyoutButtonBackground) {
        fill: #0001 !important;
    }
    :global(.blocklyFlyoutButton:active .blocklyFlyoutButtonBackground) {
        fill: #0002 !important;
    }
    :global(.blocklyFlyoutButton .blocklyText) {
        fill: #575e75 !important;
    }

    :global(.dark .blocklyFlyoutButtonBackground) {
        stroke: #b3bcdb;
    }
    :global(.dark .blocklyFlyoutButton:hover .blocklyFlyoutButtonBackground) {
        fill: #fff1 !important;
    }
    :global(.dark .blocklyFlyoutButton:active .blocklyFlyoutButtonBackground) {
        fill: #fff2 !important;
    }
    :global(.dark .blocklyFlyoutButton .blocklyText) {
        fill: #b3bcdb !important;
    }

    :global(.blocklyTreeSeparator) {
        border: none;
        width: calc(100% - 16px);
        height: 6px;
        margin: 8px;
        box-sizing: border-box;
        background: #8888;
        border-radius: 6px;
    }

    :global(.blocklyMainBackground) {
        stroke: none;
    }

    :global(.dark .blocklySvg), :global(.dark .blocklyMutatorBackground) {
        background: #111;
        fill: #111;
    }

    :global(.dark .blocklyFlyoutBackground) {
        fill: #222;
    }

    :global(.dark .blocklyFlyoutLabelText) {
        fill: #ccc !important;
    }

    :global(.dark .blocklyScrollbarHandle) {
        fill: #777;
        opacity: 0.4;
    }

    :global(.blocklyText) {
        fill: #000b !important;
    }

    :global(.blocklyDropdownText), :global(.blocklyEditableText > image) {
        filter: invert(1);
        opacity: 0.9;
        font-weight: 400 !important;
    }

    :global(.blocklyMenuItemContent) {
        color: #000b !important;
        font-weight: bold;
    }
</style>
