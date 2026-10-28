/** A device setting. It is not exported, imported, synced or cleared by Reset all data. */
export const THEME_STORAGE_KEY = "supermarket-simulator-buddy-theme";

export const DARK_QUERY = "(prefers-color-scheme: dark)";

// Runs before the first paint so a dark theme never flashes light.
export const applyThemeBeforePaint = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("${DARK_QUERY}").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}`;
