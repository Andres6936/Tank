export const currencyToSpeech = async (
  value: number,
  currencyType: string,
): Promise<string> => {
  try {
    const key = process.env.GOOGLE_AI_STUDIO;
    const stream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Convert the currency value ($ ${value} ${currencyType}) to text
                                representation in spanish language and capitalize the first letter,
                                use the name of the currency avoiding abbreviations in the text.`,
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            response_schema: {
              type: "OBJECT",
              properties: {
                value: {
                  type: "STRING",
                },
              },
            },
          },
        }),
      },
    );
    const response = await stream.json();
    const [content] = response.candidates;
    const [part] = content.content.parts;
    const payload = JSON.parse(part.text);
    return payload.value;
  } catch (e) {
    console.error(e);
    return "";
  }
};
