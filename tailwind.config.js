/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0B0F14",
          900: "#0F151C",
          800: "#121821",
          700: "#1A222D",
          600: "#242E3A",
          500: "#36414F",
          400: "#5B6878",
          300: "#8B97A6",
          200: "#C2CAD3",
          100: "#E7EBEF",
        },
        signal: {
          amber: "#F2B544",
          green: "#3ECF8E",
          red: "#F2666D",
          blue: "#5FA8F5",
        },
      },
      fontFamily: {
        display: [
          '"Space Grotesk"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          '"IBM Plex Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
        wideish: "0.08em",
      },
      animation: {
        scan: "scan 2.4s linear infinite",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        "slide-in": "slide-in 0.25s ease-out",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.3 },
        },
        "slide-in": {
          "0%": { opacity: 0, transform: "translateY(-4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
