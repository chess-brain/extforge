import registerGeneric from "./generic";
import registerEvents from "./events";
import registerControl from "./control";
import registerMath from "./math";
import registerStrings from "./strings";
import registerVectors from "./vectors";
import registerInputs from "./inputs";
import registerVariables from "./variables";
import registerLists from "./lists";
import registerBlocks from "./blocks";
import registerExtra from "./extra";
import registerAdvanced from "./advanced";

import registerRuntime from "./runtime";
import registerScript from "./script";
import registerMusic from "./music";

export default () => {
    registerGeneric();
    registerEvents();
    registerControl();
    registerMath();
    registerStrings();
    registerVectors();
    registerInputs();
    registerVariables();
    registerLists();
    registerBlocks();
    registerExtra();
    registerAdvanced();

    registerRuntime();
    registerScript();
    registerMusic();
}
