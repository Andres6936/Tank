const file = Bun.file("README.md");

const formData = new FormData();
formData.append("Path", "/Readme.txt");
formData.append("Blob", file);

const result = await fetch("http://localhost:3000/api/documents/private/save", {
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
