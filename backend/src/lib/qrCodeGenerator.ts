import QRCode from "qrcode";
import path from "path";

export async function generateTicketQR(qrCode: string): Promise<string> {
  const filename = `qr-${qrCode}.png`;
  const filePath = path.join("public/qrCodeEvent", filename);

  await QRCode.toFile(filePath, qrCode);

  return `${process.env.BASE_URL}/public/qrCodeEvent/${filename}`;
}
