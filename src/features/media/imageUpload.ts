import {
  Buffer,
} from "node:buffer";

export const MAX_IMAGE_SIZE_BYTES =
  8 * 1024 * 1024;

export type SupportedImageMime =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif"
  | "image/avif";

export type DetectedImageFormat = {
  mime: SupportedImageMime;
  extension: string;
};

function ascii(
  buffer: Buffer,
  start: number,
  end: number
) {
  return buffer
    .subarray(
      start,
      end
    )
    .toString(
      "ascii"
    );
}

export function detectImageFormat(
  buffer: Buffer
): DetectedImageFormat | null {
  /*
   * JPEG / JPG / JFIF
   */

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return {
      mime:
        "image/jpeg",

      extension:
        "jpg",
    };
  }

  /*
   * PNG
   */

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return {
      mime:
        "image/png",

      extension:
        "png",
    };
  }

  /*
   * WEBP
   */

  if (
    buffer.length >= 12 &&
    ascii(
      buffer,
      0,
      4
    ) === "RIFF" &&
    ascii(
      buffer,
      8,
      12
    ) === "WEBP"
  ) {
    return {
      mime:
        "image/webp",

      extension:
        "webp",
    };
  }

  /*
   * GIF
   */

  if (
    buffer.length >= 6
  ) {
    const signature =
      ascii(
        buffer,
        0,
        6
      );

    if (
      signature ===
        "GIF87a" ||
      signature ===
        "GIF89a"
    ) {
      return {
        mime:
          "image/gif",

        extension:
          "gif",
      };
    }
  }

  /*
   * AVIF
   */

  if (
    buffer.length >= 16 &&
    ascii(
      buffer,
      4,
      8
    ) === "ftyp"
  ) {
    const brands =
      ascii(
        buffer,
        8,
        Math.min(
          buffer.length,
          40
        )
      );

    if (
      brands.includes(
        "avif"
      ) ||
      brands.includes(
        "avis"
      )
    ) {
      return {
        mime:
          "image/avif",

        extension:
          "avif",
      };
    }
  }

  return null;
}