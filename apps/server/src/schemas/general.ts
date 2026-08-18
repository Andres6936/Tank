import { z } from "zod";

const PaginateSchema = z.object({
  Page: z.number().min(1),
  PageSize: z.number().min(1),
})

type PaginateType = z.infer<typeof PaginateSchema>;

const defaultPagination = {
  Page: 1,
  PageSize: 10,
} satisfies PaginateType;

export { PaginateSchema, type PaginateType, defaultPagination }
