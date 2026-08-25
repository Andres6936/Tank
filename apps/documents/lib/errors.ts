// Base Error Class for XML issues
export class XmlParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace in V8 environments (Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
// 1. Triggered when source input is null, undefined, or empty
export class InvalidDocumentError extends XmlParserError {}
// 2. Triggered by unclosed tags or mismatched elements
export class MalformedXmlError extends XmlParserError {}
// 3. Triggered by unescaped special characters like raw ampersands (&)
export class UnescapedEntityError extends XmlParserError {}
