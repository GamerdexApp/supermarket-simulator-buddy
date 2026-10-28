const CORRECTED_PRODUCT_NAMES: Record<string, string> = {
  Avacado: "Avocado",
};

/**
 * Shopping list items keep the `productName` they were saved with, and saved data is never
 * rewritten. A name that the game data later corrected reads as the corrected name.
 */
export const currentProductName = (storedName: string): string =>
  CORRECTED_PRODUCT_NAMES[storedName] ?? storedName;
