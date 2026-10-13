/**
 * Utility for client-side image compression and resizing.
 * Transforms raw 2-5MB high-resolution camera/phone photos into lightweight,
 * high-fidelity ~25-40KB base64 JPEG strings (max 500x500px).
 *
 * Benefits:
 * 1. Eliminates massive 20-30 page long Base64 strings in JSON backups.
 * 2. Prevents exceeding browser localStorage quota (5MB limit).
 * 3. Keeps live preview, re-renders, and state updates blazing fast.
 * 4. Preserves 300 DPI print sharpness for 1.5-inch circular/square resume photos.
 */
export async function compressAndResizeImage(
  fileOrDataUrl: File | string,
  maxDimension = 500,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const processImage = (src: string) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // If image is already smaller than maxDimension and already lightweight, return as-is
        if (width <= maxDimension && height <= maxDimension && src.length < 60000) {
          resolve(src);
          return;
        }

        // Scale down proportionally
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        // Fill background with white to handle transparent PNGs cleanly
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = src;
    };

    if (typeof fileOrDataUrl === 'string') {
      processImage(fileOrDataUrl);
    } else {
      if (!fileOrDataUrl.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) {
          reject(new Error('Empty image result'));
          return;
        }
        processImage(result);
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
