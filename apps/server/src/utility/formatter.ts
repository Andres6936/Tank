import prettier from "prettier";

const formatXML = async (content: string) => {
  return await prettier.format(content, {
    parser: "xml",
    tabWidth: 4,
    printWidth: 100,
    xmlQuoteAttributes: "double",
    xmlSortAttributesByKey: true,
    plugins: ["@prettier/plugin-xml"],
  });
};

export { formatXML };
