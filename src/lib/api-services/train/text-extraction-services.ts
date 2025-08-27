import rtf2text from "rtf2text";
import { PdfReader } from "pdfreader";

/**
 * This function is used to extract the text from a TXT or MD file.
 *
 * Written by: Hemant Sharma (GH: @hemants1703)
 *
 * @param file - The file to extract the text from.
 * @returns A promise that resolves to the text extracted from the file.
 */

export const extractTextFromTXTOrMD = async (
  file: File
): Promise<string | Error> => {
  return new Promise(
    (resolve: (text: string) => void, reject: (error: Error) => void) => {
      const reader: FileReader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          const text: string = event.target.result as string;
          resolve(text.trim());
        }
      };

      reader.onerror = (event: ProgressEvent<FileReader>) => {
        reject(
          new Error(`Failed to read file: ${event.target?.error?.message}`)
        );
      };

      reader.readAsText(file);
    }
  );
};

/**
 * This function is used to extract the text from a RTF file.
 *
 * Written by: Hemant Sharma (GH: @hemants1703)
 *
 * @param file - The file to extract the text from.
 * @returns A promise that resolves to the text extracted from the file.
 */

export const extractTextFromRTF = async (
  file: File
): Promise<string | Error> => {
  const rtfContent = await file.text();

  return new Promise(
    (resolve: (text: string) => void, reject: (error: Error) => void) => {
      rtf2text.string(rtfContent, (err: Error | null, result: string) => {
        if (err) {
          reject(new Error(`Failed to parse RTF file: ${err.message}`));
        } else {
          resolve(result.trim());
        }
      });
    }
  );
};

/**
 * This function is used to extract the text from a PDF file.
 *
 * Written by: Hemant Sharma (GH: @hemants1703)
 *
 * @param file - The file to extract the text from.
 * @returns A promise that resolves to the text extracted from the file.
 */

export const extractTextFromPDF = async (
  file: File
): Promise<string | Error> => {
  let extractedText: string = "";
  const pdfBuffer: Buffer = Buffer.from(await file.arrayBuffer());

  const pdfReader = new PdfReader();

  return new Promise((resolve, reject) => {
    pdfReader.parseBuffer(pdfBuffer, (err, item) => {
      if (err) {
        reject(new Error(`Failed to parse PDF file: ${err}`));
      } else if (!item) {
        console.warn("end of PDF file");
        resolve(extractedText);
      } else if (item?.text) {
        extractedText += item.text;
      }
    });
  });
};
