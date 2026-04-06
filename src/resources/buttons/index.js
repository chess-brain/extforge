/** @param {import('blockly').Workspace} workspace */
function register(workspace) {
    const SEARCH_STORAGE_KEY = "extforge_toolbox_search_v1";
    const FAVORITES_STORAGE_KEY = "extforge_toolbox_favorites_v1";

    const readFavorites = () => {
        try {
            const data = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    };

    const saveFavorites = (favorites) => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    };

    workspace.registerButtonCallback("variables_register", () => {
        window.modals['createVariable'].toggle()
    });

    workspace.registerButtonCallback("variables_remove", () => {
        let v = prompt("temporary delete variable prompt (put variable name here)")
        if (v != "") {
            delete window.variables[v]
            workspace.refreshToolboxSelection()
        }
    });

    workspace.registerButtonCallback("search_set", () => {
        const current = localStorage.getItem(SEARCH_STORAGE_KEY) || "";
        const next = prompt("Search block types by keyword", current);
        if (next === null) return;
        localStorage.setItem(SEARCH_STORAGE_KEY, next.trim());
        workspace.refreshToolboxSelection();
    });

    workspace.registerButtonCallback("search_clear", () => {
        localStorage.removeItem(SEARCH_STORAGE_KEY);
        workspace.refreshToolboxSelection();
    });

    workspace.registerButtonCallback("favorites_add_selected", () => {
        const selected = (workspace.getSelected && workspace.getSelected())
            || (window.Blockly && window.Blockly.getSelected && window.Blockly.getSelected());
        if (!selected?.type) {
            alert("Select a block in the editor first.");
            return;
        }

        const favorites = readFavorites();
        if (!favorites.includes(selected.type)) {
            favorites.push(selected.type);
            saveFavorites(favorites);
        }
        workspace.refreshToolboxSelection();
    });

    workspace.registerButtonCallback("favorites_remove_by_type", () => {
        const favorites = readFavorites();
        if (favorites.length === 0) {
            alert("No favorites yet.");
            return;
        }
        const removeType = prompt("Enter block type to remove", favorites[0]);
        if (!removeType) return;
        saveFavorites(favorites.filter((type) => type !== removeType.trim()));
        workspace.refreshToolboxSelection();
    });

    workspace.registerButtonCallback("favorites_clear", () => {
        if (!confirm("Clear all favorite blocks?")) return;
        localStorage.removeItem(FAVORITES_STORAGE_KEY);
        workspace.refreshToolboxSelection();
    });
}

export default register;
