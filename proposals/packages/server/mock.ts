const file = Bun.file("README.md");

const formData = new FormData();
formData.append("Name", "Output.txt");
formData.append("Path", "/Output/sdsaaad.txt");
formData.append("Bucket", "private");
formData.append("Blob", file);

const result = await fetch("http://localhost:3000/api/documents/save", {
  method: "POST",
  body: formData,
});

if (result.ok) {
  const data = await result.json();
  console.log(data);
} else {
  const error = await result.json();
  console.error(error);
}
