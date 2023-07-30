const wordToDocs = async (buffer: Buffer) => {
  const mammoth = await import("mammoth");

  const result = await mammoth.extractRawText({ buffer });

  return result.value;
};

export default wordToDocs;
