import prettier from "prettier";

const formatXML = async (content: string) => {
  return await prettier.format(content, {
    parser: "angular",
    semi: false,
    tabWidth: 4,
    printWidth: 100,
    xmlQuoteAttributes: "double",
    xmlSortAttributesByKey: true,
  });
};

export { formatXML };
