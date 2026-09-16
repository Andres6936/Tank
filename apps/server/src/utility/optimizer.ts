const optimizerImage = async (thumbnailBuffer: Buffer | ArrayBuffer) => {
  const image = new Bun.Image(thumbnailBuffer);
  const placeholder = await image.placeholder();
  const optimize = await image.webp({ quality: 80 }).blob();

  return {
    placeholder,
    optimize,
  };
};

export { optimizerImage };
