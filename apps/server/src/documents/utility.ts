/**
 * Returns a minimal well-formed XML document containing only the opening
 * `<Document ...>` tag and a synthetic closing `</Document>`. It stops
 * scanning at the first `>` after `<Document`, so it never walks the rest
 * of the file. Assumes the document starts with `<Document` (no BOM,
 * no XML declaration, no comments or DOCTYPE before it).
 */
function getDocumentHeader(xml: string): string | null {
  const start = xml.indexOf("<Document");
  if (start === -1) return null;

  // Find the first `>` after `<Document`. This is the end of the opening
  // tag, whether it's `<Document ...>` or `<Document ... />`.
  const end = xml.indexOf(">", start + 9); // 9 = "<Document".length
  if (end === -1) return null;

  return xml.slice(start, end + 1) + "</Document>";
}

function getDocumentProps(xml: string) {
  const parsed = Bun.XML.parse(xml);
  const document = parsed.Document as {
    "@title": string | null;
    "@subject": string | null;
  };
  if (!document) return null;

  const title = document["@title"];
  const subject = document["@subject"];

  return {
    Title: title ? title : "",
    Subject: subject ? subject : "",
  };
}

export { getDocumentHeader, getDocumentProps };
