import rtf2text from "rtf2text";

export const extractTextFromTXTOrMD = async (file: File): Promise<string> => {
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

export const extractTextFromRTF = async (file: File): Promise<string> => {
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
