import QRCode from 'qrcode';

const CreateQR = async (url: string, tableNumber: number): Promise<string> => {
  const fullUrl = `${url}&table=${tableNumber}`;
  try {
    const qrCodeDataUri = await QRCode.toDataURL(fullUrl);
    return qrCodeDataUri;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

export default CreateQR

