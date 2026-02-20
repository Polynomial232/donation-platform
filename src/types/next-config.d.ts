declare module "next/config" {
  export default function getConfig(): {
    serverRuntimeConfig: Record<string, any>;
    publicRuntimeConfig: Record<string, any>;
  };
}
