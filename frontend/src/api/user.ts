// ----------------------------------------------------------------------

export async function getPhotoBase64Data(photoUrl: string) {
  if (!photoUrl) {
    return undefined;
  }

  try {
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    const newBlob = new Blob([blob], { type: 'image/jpeg' });

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(newBlob);
    });
  } catch (error) {
    console.error(`Failed to get base64 data: ${error}`);
    return undefined;
  }
}
