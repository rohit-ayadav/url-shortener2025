

// src/components/url-shortener/utils.ts
export const isValidURL = (str: string): boolean => {
  try {
    return !!new URL(str);
  } catch {
    return false;
  }
};

export const formatAlias = (alias: string): string => {
  let transformedAlias = alias.trim().toLowerCase();
  transformedAlias = transformedAlias.replace(/\s/g, '-');
  transformedAlias = transformedAlias.replace(/[^a-z0-9-_]/g, '');
  transformedAlias = transformedAlias.replace(/-+/g, '-');
  transformedAlias = transformedAlias.replace(/^-|-$/g, '');
  return transformedAlias.slice(0, 50);
};

export const cleanText = (input: string): string => {
  const cleanedCaption = input
    .replace(/^.*?Caption\s*.*?\n/, "")
    .replace(/^.*?caption\s*.*?\n/, "");
  return cleanedCaption.replace(/^.*?usp=sharing\s*/s, "").trim();
};