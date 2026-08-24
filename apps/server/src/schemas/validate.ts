import { z } from "zod";

const SaveFileSchema = z.object({
  Path: z.string(),
  Blob: z.union([
    z.instanceof(Blob).refine(
      (it) => it.size <= 5 * 1024 * 1024, // 5MB
      { message: "File must be less than 5MB" },
    ),
    z.instanceof(ArrayBuffer).refine(
      (it) => it.byteLength <= 5 * 1024 * 1024, // 5MB
      { message: "File must be less than 5MB" },
    ),
  ]),
});

const UpdateFileSchema = SaveFileSchema.extend({
  Id: z.uuidv7(),
});

type SaveFileType = z.infer<typeof SaveFileSchema>;
type UpdateFileType = z.infer<typeof UpdateFileSchema>;

export { SaveFileSchema, UpdateFileSchema };

export type { SaveFileType, UpdateFileType };
