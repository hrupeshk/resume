import QRCode from 'qrcode';

export interface QrCodeOptions {
  size?: number;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Generates a clean, crisp QR code as a PNG data URL completely on the client side.
 * Zero external API calls, zero tracking.
 */
export async function generateQrCodeDataUrl(
  text: string,
  options?: QrCodeOptions
): Promise<string> {
  const size = options?.size ?? 200;
  const darkColor = options?.darkColor ?? '#1a1a1a';
  const lightColor = options?.lightColor ?? '#ffffff';

  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel: 'M',
  });
}
