import { z } from "zod";

const DocumentSchema = z.object({
  Id: z.uuidv7(),
  Title: z.string(),
  Subject: z.string(),
  Content: z.string(),
  TypeState: z.string(),
  FileId: z.string().nullish(),
  Metadata: z.string(),
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
});

export default {
  Select: DocumentSchema,
  Insert: DocumentSchema.omit({ Id: true, UpdatedAt: true, CreatedAt: true })
    .partial()
    .required({ Title: true, Subject: true }),
  Update: DocumentSchema.omit({ CreatedAt: true, UpdatedAt: true })
    .partial()
    .required({ Id: true }),
};
