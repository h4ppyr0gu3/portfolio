/** Square portrait size + JPEG quality for localStorage. */
const OUTPUT_SIZE = 320;
const JPEG_QUALITY = 0.84;

/**
 * Read a File, center-crop to square, compress to JPEG data URL.
 * @param {File} file
 * @returns {Promise<string>} data:image/jpeg;base64,...
 */
export async function fileToStoredPhoto(file) {
  const bitmap = await loadImageFile(file);
  try {
    return cropImageToStoredPhoto(bitmap, { panX: 0, panY: 0, zoom: 1 });
  } finally {
    if (typeof bitmap.close === 'function') bitmap.close();
  }
}

/**
 * Crop an already-loaded image to a square JPEG data URL.
 * @param {CanvasImageSource & { width: number, height: number }} image
 * @param {{ panX?: number, panY?: number, zoom?: number }} [opts]
 *   panX/panY in [-1, 1] shift the crop within the image; zoom >= 1 zooms in.
 * @returns {string}
 */
export function cropImageToStoredPhoto(image, opts = {}) {
  const nw = image.naturalWidth || image.width;
  const nh = image.naturalHeight || image.height;
  if (!nw || !nh) throw new Error('Could not process image.');

  const zoom = Math.max(1, Math.min(4, Number(opts.zoom) || 1));
  const panX = clamp(Number(opts.panX) || 0, -1, 1);
  const panY = clamp(Number(opts.panY) || 0, -1, 1);

  // Largest square that fits, then shrink by zoom (crop tighter).
  const side = Math.min(nw, nh) / zoom;
  const maxOx = (nw - side) / 2;
  const maxOy = (nh - side) / 2;
  const sx = maxOx + panX * maxOx;
  const sy = maxOy + panY * maxOy;

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  ctx.drawImage(image, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  if (dataUrl.length > 900_000) {
    throw new Error('Image is still too large after compression. Try a smaller photo.');
  }
  return dataUrl;
}

/**
 * @param {File} file
 * @returns {Promise<ImageBitmap | HTMLImageElement>}
 */
export async function loadImageFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('Image is too large (max 12MB before resize).');
  }
  return loadImage(file);
}

export function isStoredPhoto(url) {
  return typeof url === 'string' && url.startsWith('data:image/');
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
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
