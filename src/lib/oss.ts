import OSS from 'ali-oss';

const getOSSClient = () => {
  // Only initialize if variables are present (avoids crash during build if missing)
  if (!process.env.ALIBABA_CLOUD_REGION || !process.env.ALIBABA_CLOUD_ACCESS_KEY_ID) {
    console.warn('OSS credentials not found. File uploads will fail.');
    return null;
  }

  return new OSS({
    region: process.env.ALIBABA_CLOUD_REGION,
    accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!,
    bucket: process.env.OSS_BUCKET_NAME,
  });
};

const client = getOSSClient();

export default client;
