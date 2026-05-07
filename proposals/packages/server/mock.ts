// const file = Bun.file("README.md");

// const formData = new FormData();
// formData.append("Path", "/Readme.txt");
// formData.append("Blob", file);

// const result = await fetch("http://localhost:3000/api/documents/private/save", {
//   method: "POST",
//   body: formData,
// });

// if (result.ok) {
//   const data = await result.json();
//   console.log(data);
// } else {
//   const error = await result.json();
//   console.error(error);
// }

// const result = await fetch(
//   "http://localhost:3000/api/documents/private/019dffe7-0b3d-7c94-995d-963eb7a64795",
//   {
//     method: "GET",
//   },
// );

// if (result.ok) {
//   const data = await result.json();
//   console.log(data);
// } else {
//   const error = await result.json();
//   console.error(error);
// }

// const file = Bun.file("README.md");

// const formData = new FormData();
// formData.append("Path", "/README.md");
// formData.append("Blob", file);

// const result = await fetch(
//   "http://localhost:3000/api/documents/private/019dffe7-0b3d-7c94-995d-963eb7a64795",
//   {
//     method: "PUT",
//     body: formData,
//   },
// );

// if (result.ok) {
//   const data = await result.json();
//   console.log(data);
// } else {
//   const error = await result.json();
//   console.error(error);
// }

const result = await fetch(
  "http://localhost:3000/api/documents/private/019dffe7-0b3d-7c94-995d-963eb7a64795",
  {
    method: "DELETE",
  },
);

if (result.ok) {
  const data = await result.json();
  console.log(data);
} else {
  const error = await result.json();
  console.error(error);
}
