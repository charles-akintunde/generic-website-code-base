export const toKebabCase = (str: string): string => {
  str = str.toLowerCase();
  str = str.replace(/ /g, '-');
  return str;
};

export const fromKebabCase = (str: string): string => {
  str = str.replace(/-/g, ' ');
  return str.charAt(0).toUpperCase() + str.slice(1);
};
