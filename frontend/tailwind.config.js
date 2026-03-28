/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mist: "#f4f7fb",
        frost: "rgba(255,255,255,0.7)",
        emeraldPulse: "#4ade80",
        amberPulse: "#f59e0b",
        coralPulse: "#ef4444",
        ink: "#112038",
      },
      boxShadow: {
        neumorphic: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
        "neumorphic-inset": "inset 7px 7px 14px #c8ced8, inset -7px -7px 14px #ffffff",
        glass: "0 24px 50px rgba(17, 32, 56, 0.14)",
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        body: ["'Manrope'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "aurora-surface":
          "radial-gradient(circle at top left, rgba(74, 222, 128, 0.22), transparent 36%), radial-gradient(circle at top right, rgba(245, 158, 11, 0.18), transparent 30%), linear-gradient(160deg, #eef4ff 0%, #f7fafc 55%, #edf6f4 100%)",
      },
    },
  },
  plugins: [],
};
