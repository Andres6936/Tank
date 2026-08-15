import { expect, test, describe, beforeAll } from "bun:test";
import { trpc } from "~/client";

describe("Server Flow File", () => {
  beforeAll(
    async () => {
      const result = await trpc.status.query();
      expect(result).toBeDefined();
      expect(result).toHaveProperty("statusCode");
      expect(result.statusCode).toBe(200);
    },
    { timeout: 1000 }, // 1 Second to check if the server is up
  );

  let FileId = "";

  test("Save test", async () => {
    const file = Bun.file("./test/resources/file.txt");

    const formData = new FormData();
    formData.append("Path", "/file.txt");
    formData.append("Blob", file);

    const payload = await trpc.documents.save.mutate(formData);

    expect(payload).toBeDefined();
    expect(payload).toHaveProperty("statusCode");
    expect(payload.statusCode).toBe(200);
    expect(payload).toHaveProperty("body");
    expect(payload.body).toBeDefined();
    expect(payload.body).toHaveProperty("Id");
    expect(payload.body.Id).toBeDefined();

    FileId = payload.body.Id;
  });

  test("Query File", async () => {
    const payload = await trpc.documents.getById.query(FileId);

    expect(payload).toBeDefined();
    expect(payload).toHaveProperty("statusCode");
    expect(payload.statusCode).toBe(200);
    expect(payload).toHaveProperty("body");
    expect(payload.body).toBeDefined();
    expect(payload.body).toHaveProperty("link");
    expect(payload.body.link).toBeDefined();
  });

  test("Update File", async () => {
    const file = Bun.file("./test/resources/text.txt");

    const formData = new FormData();
    formData.append("Id", FileId);
    formData.append("Path", "/text.txt");
    formData.append("Blob", file);

    const payload = await trpc.documents.updateById.mutate(formData);

    expect(payload).toBeDefined();
    expect(payload).toHaveProperty("statusCode");
    expect(payload.statusCode).toBe(200);
    expect(payload).toHaveProperty("body");
    expect(payload.body).toBeDefined();
    expect(payload.body).toHaveProperty("Id");
    expect(payload.body.Id).toBeDefined();
  });

  test("Delete File", async () => {
    const payload = await trpc.documents.deleteById.mutate(FileId);

    expect(payload).toBeDefined();
    expect(payload).toHaveProperty("statusCode");
    expect(payload.statusCode).toBe(200);
    expect(payload).toHaveProperty("body");
    expect(payload.body).toBeDefined();
    expect(payload.body).toHaveProperty("Id");
    expect(payload.body.Id).toBeDefined();
  });
});
