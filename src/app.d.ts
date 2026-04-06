// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare global {
	interface Window {
		modals: Record<string, { toggle: () => void }>;
		variables: Record<string, any>;
		blocks: Record<string, any>;
		Blockly: any;
		workspace: any;
	}
}

export {};