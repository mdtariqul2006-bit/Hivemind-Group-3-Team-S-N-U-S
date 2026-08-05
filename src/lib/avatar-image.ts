/**
 * Turning a chosen photo into something small enough to keep.
 *
 * Avatars live in localStorage alongside the rest of the member record, and
 * that budget is roughly 5MB for the whole origin. A phone photo is commonly
 * 3 to 8MB, so storing the file as picked would blow the quota on the first
 * upload and take the account record down with it. Every image is therefore
 * decoded, centre cropped to a square, and re-encoded at avatar size before it
 * ever reaches storage, which lands a typical photo around 15 to 30KB.
 *
 * The crop is centred rather than letterboxed because the avatar is displayed
 * inside a hexagon: bars at the edges would show through the clip.
 */

/** Rendered avatars are at most 76px at 2x, so 256 leaves room to spare. */
const OUTPUT_SIZE = 256;

/** Refuse absurd files before decoding, decoding is what costs memory. */
const MAX_INPUT_BYTES = 20 * 1024 * 1024;

/** A guard against a pathological result still being too big to store. */
const MAX_OUTPUT_BYTES = 400 * 1024;

export type AvatarResult =
  | { ok: true; dataUrl: string }
  | { ok: false; error: string };

function approximateBytes(dataUrl: string): number {
  // base64 carries 3 bytes per 4 characters, ignoring the small header.
  const commaAt = dataUrl.indexOf(',');
  const payload = commaAt === -1 ? dataUrl : dataUrl.slice(commaAt + 1);
  return Math.floor((payload.length * 3) / 4);
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // createImageBitmap decodes off the main thread where available, and also
  // applies EXIF orientation, so portrait phone photos are not sideways.
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // Fall through to the <img> path below, some browsers reject the options
      // bag rather than ignoring it.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('decode failed'));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Reads a picked file and returns a small square data URL, or a message that is
 * safe to show the user as is.
 */
export async function fileToAvatarDataUrl(file: File): Promise<AvatarResult> {
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'That file is not an image. Pick a JPG, PNG, or WebP.' };
  }
  if (file.size > MAX_INPUT_BYTES) {
    return { ok: false, error: 'That image is very large. Pick one under 20MB.' };
  }

  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await decode(file);
  } catch {
    return { ok: false, error: 'That image could not be opened. Try a different file.' };
  }

  const width = 'width' in source ? source.width : 0;
  const height = 'height' in source ? source.height : 0;
  if (!width || !height) {
    return { ok: false, error: 'That image could not be read. Try a different file.' };
  }

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { ok: false, error: 'Your browser could not process that image.' };
  }

  // Centre crop the largest square the source allows, then scale it down.
  const side = Math.min(width, height);
  const sx = (width - side) / 2;
  const sy = (height - side) / 2;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source as CanvasImageSource, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  if ('close' in source && typeof source.close === 'function') source.close();

  // WebP is meaningfully smaller than JPEG at the same quality. toDataURL falls
  // back to PNG when a type is unsupported, so check what actually came back
  // rather than trusting the request.
  let dataUrl = canvas.toDataURL('image/webp', 0.82);
  if (!dataUrl.startsWith('data:image/webp')) {
    dataUrl = canvas.toDataURL('image/jpeg', 0.82);
  }

  if (approximateBytes(dataUrl) > MAX_OUTPUT_BYTES) {
    return { ok: false, error: 'That image could not be shrunk enough to save. Try another one.' };
  }

  return { ok: true, dataUrl };
}
