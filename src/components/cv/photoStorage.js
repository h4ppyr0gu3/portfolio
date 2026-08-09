/** Max edge length + JPEG quality keep portraits small enough for localStorage. */
const MAX_EDGE = 320;
const JPEG_QUALITY = 0.84;

/**
 * Read a File, resize/compress to a JPEG data URL for localStorage.
 * @param {File} file
 * @returns {Promise<string>} data:image/jpeg;base64,...
 */
export async function fileToStoredPhoto(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('Image is too large (max 12MB before resize).');
  }

  const bitmap = await loadImage(file);
  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_EDGE);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);

  if (typeof bitmap.close === 'function') bitmap.close();

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  // Soft cap — localStorage budgets vary; ~900KB is usually safe with the rest of the CV.
  if (dataUrl.length > 900_000) {
    throw new Error('Image is still too large after compression. Try a smaller photo.');
  }
  return dataUrl;
}

function fitWithin(w, h, max) {
  if (w <= max && h <= max) return { width: w, height: h };
  const scale = max / Math.max(w, h);
  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
  };
}

function loadImage(file) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file);
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image.'));
    };
    img.src = url;
  });
}

export function isStoredPhoto(url) {
  return typeof url === 'string' && url.startsWith('data:image/');
}
