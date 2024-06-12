export const toKebabCase = (str: string) => {
  // Convert the string to lowercase
  str = str.toLowerCase();

  // Replace spaces with hyphens
  str = str.replace(/ /g, '-');

  return str;
};
