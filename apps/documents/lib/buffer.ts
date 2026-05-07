const getBufferFromStream = async (stream: NodeJS.ReadableStream) => {
    const chunks: Uint8Array<ArrayBufferLike>[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk as Uint8Array<ArrayBufferLike>);
    }
    return Buffer.concat(chunks);
};

export {
    getBufferFromStream,
}