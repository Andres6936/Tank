import { expect, test, describe, beforeAll } from "bun:test";

const BASE_URL = "http://localhost:3000/";

beforeAll(
  async () => {
    const url = new URL("/api/status", BASE_URL);
    const result = await fetch(url);
    expect(result.ok).toBe(true);
  },
  {
    timeout: 1000, // 1 Second to check if the server is running
  },
);

describe("Server Flow File", async () => {
  let FileId = "";

  test("Save File", async () => {
    const file = Bun.file("./test/resources/file.txt");

    const formData = new FormData();
    formData.append("Path", "/file.txt");
    formData.append("Blob", file);

    const url = new URL("/api/documents/private/save", BASE_URL);
    const result = await fetch(url, {
      method: "POST",
      body: formData,
    });

    expect(result.ok).toBe(true);
    const payload = await result.json();
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
    const url = new URL(`/api/documents/private/${FileId}`, BASE_URL);
    const result = await fetch(url, {
      method: "GET",
    });

    expect(result.ok).toBe(true);
    const payload = await result.json();
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
    formData.append("Path", "/text.txt");
    formData.append("Blob", file);

    const url = new URL(`/api/documents/private/${FileId}`, BASE_URL);
    const result = await fetch(url, {
      method: "PUT",
      body: formData,
    });

    expect(result.ok).toBe(true);
    const payload = await result.json();
    expect(payload).toBeDefined();
    expect(payload).toHaveProperty("statusCode");
    expect(payload.statusCode).toBe(200);
    expect(payload).toHaveProperty("body");
    expect(payload.body).toBeDefined();
    expect(payload.body).toHaveProperty("Id");
    expect(payload.body.Id).toBeDefined();
  });

  test("Delete File", async () => {
    const url = new URL(`/api/documents/private/${FileId}`, BASE_URL);
    const result = await fetch(url, {
      method: "DELETE",
    });

    expect(result.ok).toBe(true);
    const payload = await result.json();
    expect(payload).toBeDefined();
    expect(payload).toHaveProperty("statusCode");
    expect(payload.statusCode).toBe(200);
    expect(payload).toHaveProperty("body");
    expect(payload.body).toBeDefined();
    expect(payload.body).toHaveProperty("Id");
    expect(payload.body.Id).toBeDefined();
  });
});
