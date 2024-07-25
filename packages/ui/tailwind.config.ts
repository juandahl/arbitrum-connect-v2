import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        150: "37.5rem",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        custom: {
          primary: "#213147", //Primary500
          neutral: colors.neutral[200],
        },
      },
    ],
  },
} satisfies Config;
