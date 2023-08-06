import { clean_string } from "./utils";

const excelToDocs = async (buffer: ArrayBuffer) => {
  let text = "";
  const XLSX = await import("xlsx");

  const workbook = XLSX.read(buffer, { type: "array" });

  workbook.SheetNames.forEach((sheetName: string | number) => {
    const worksheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_csv(worksheet);
    text += sheetData;
  });
  const content = clean_string(text);
  return content;
};

export default excelToDocs;
