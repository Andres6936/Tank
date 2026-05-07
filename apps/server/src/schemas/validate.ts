import { z } from "zod";

const SaveFileSchema = z.object({
  Path: z.string(),
  Blob: z.instanceof(Blob).refine(
    (it) => it.size <= 5 * 1024 * 1024, // 5MB
    { message: "File must be less than 5MB" },
  ),
});

type SaveFileType = z.infer<typeof SaveFileSchema>;

export { SaveFileSchema };

export type { SaveFileType };
