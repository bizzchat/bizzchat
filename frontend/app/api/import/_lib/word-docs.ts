import { clean_string } from "./utils";

const wordToDocs = async (buffer: Buffer) => {
  const mammoth = await import("mammoth");

  const result = await mammoth.extractRawText({ buffer });

  const content = clean_string(result.value);
  return content;
};

export default wordToDocs;
