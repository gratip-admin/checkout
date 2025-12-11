import type { Config } from "tailwindcss";
// import withMT from "@material-tailwind/react/utils/withMT";
// import * as tailwindScrollbar from "tailwind-scrollbar";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mi: ["var(--font-mi)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        auth: "url('/auth/auth-bg.png')",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
