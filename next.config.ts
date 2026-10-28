import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

const { version } = JSON.parse(readFileSync("./package.json", "utf8")) as {
  version: string;
};

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_APP_VERSION: version },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/overview", permanent: true },
    ];
  },
};

export default withFlowbiteReact(nextConfig);
