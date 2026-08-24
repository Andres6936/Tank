const TypeStateDocumentKeys = {
  Draft: "Draft",
  Sealed: "Sealed",
} as const;

type TypeStateDocumentKeysType =
  (typeof TypeStateDocumentKeys)[keyof typeof TypeStateDocumentKeys];

export { TypeStateDocumentKeys, type TypeStateDocumentKeysType };
