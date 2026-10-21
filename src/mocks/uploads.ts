// The demo has no file storage, so a photo is kept as a data URL inside the record that uses it.
// It lasts as long as that record: until the server restarts.
export const mockUploads = {
  async uploadPhoto(file: File): Promise<string> {
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    return `data:${file.type};base64,${base64}`;
  },
};
