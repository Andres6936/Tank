const TypeBucketKeys = {
  Public: "Public",
  Private: "Private",
  Ephemeral: "Ephemeral",
} as const;

type TypeBucketKeysType = (typeof TypeBucketKeys)[keyof typeof TypeBucketKeys];

const TypeStateDocumentKeys = {
  Draft: "Draft",
  Sealed: "Sealed",
} as const;

type TypeStateDocumentKeysType =
  (typeof TypeStateDocumentKeys)[keyof typeof TypeStateDocumentKeys];

export {
  TypeBucketKeys,
  type TypeBucketKeysType,
  TypeStateDocumentKeys,
  type TypeStateDocumentKeysType,
};
