import type { Config } from "tailwindcss";

export default {
  content: ["./modern.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mochi: {
          cream: "#fff1cf",
          rose: "#ffabc3",
          peach: "#ffd4bf",
          mint: "#bdebd7",
          ink: "#49343a"
        }
      },
      boxShadow: {
        game: "0 18px 42px rgba(17, 10, 20, 0.24)"
      }
    }
  },
  plugins: []
} satisfies Config;
