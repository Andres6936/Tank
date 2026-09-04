import prettier from "prettier";

const formatXML = async (content: string) => {
  return await prettier.format(content, {
    parser: "angular",
    semi: false,
  });
};

export { formatXML };
