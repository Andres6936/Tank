/**
 * Css to camelCase
 * @param str Css
 * @returns camelCase
 */
export const cssToCamelCase = (str: string): string => {
  const splitted = str.split("-");
  if (splitted.length === 1) return splitted[0];

  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
};

/**
 * Attribute to number
 * @param item Item
 * @param value Value
 * @returns Number
 */
export const attributeToNumber = (
  item: Element,
  value: string,
): string | number => {
  if (value.includes("px")) return value;

  if (value.includes("rem")) throw new Error("rem size not implemented");

  if (value.includes("em")) {
    // Convert em to px
    const fontSize = +getComputedStyle(item).fontSize || 20;

    const num = +value.replace("em", "");
    const px = Math.round(num * fontSize);

    return px;
  }

  return Number(value);
};
