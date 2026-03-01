const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
  API_SECRET_KEY: process.env.API_SECRET_KEY as string | undefined,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || undefined,
  APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || undefined,
  DEBUG: process.env.NODE_ENV !== "production",
};

export default config;
