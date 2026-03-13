import QRCode from "qrcode"

export async function generateQRDataUrl(token: string): Promise<string> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const url = `${baseUrl}/confirmacion/${token}`

  return QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: "#1e293b", light: "#ffffff" },
    errorCorrectionLevel: "M",
  })
}
