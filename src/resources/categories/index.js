import variables from "./variables";
import blocks from "./blocks"
import meta from "./meta";

export default (workspace) => {
    variables(workspace);
    blocks(workspace);
    meta(workspace);
};
