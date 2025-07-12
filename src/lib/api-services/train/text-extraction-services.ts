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
