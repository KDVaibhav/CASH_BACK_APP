// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      screens: {
        ms: "700px", // <--- custom breakpoint
      },
    },
  },
} satisfies Config;
