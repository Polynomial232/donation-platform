import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || {};

const config: Record<string, any> = {
  API_URL: publicRuntimeConfig?.NEXT_PUBLIC_API_URL,
  API_SECRET_KEY: serverRuntimeConfig?.API_SECRET_KEY,
  APP_NAME: publicRuntimeConfig?.NEXT_PUBLIC_APP_NAME,
  APP_DESCRIPTION: publicRuntimeConfig?.NEXT_PUBLIC_APP_DESCRIPTION,
  DEBUG: publicRuntimeConfig?.NODE_ENV !== "production",
};

export default config;
