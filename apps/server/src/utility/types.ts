type MutationKeys = "Id" | "CreatedAt" | "UpdatedAt";

export type OmitInsertKeys<T> = Omit<T, MutationKeys>;

export type OmitUpdateKeys<T> = Omit<T, MutationKeys> & { Id: string };

export type AwaitedReturnSingleInfer<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>[number];
