const tailwindColors = {
  red: {
    300: "#fca5a5",
    600: "#dc2626"
  },
  orange: {
    300: "#fdba74",
    600: "#ea580c"
  },
  amber: {
    300: "#fcd34d",
    600: "#d97706"
  },
  yellow: {
    300: "#fde047",
    600: "#ca8a04"
  },
  lime: {
    300: "#bef264",
    600: "#65a30d"
  },
  green: {
    300: "#86efac",
    600: "#16a34a"
  },
  emerald: {
    300: "#6ee7b7",
    600: "#059669"
  },
  teal: {
    300: "#5eead4",
    600: "#0d9488"
  },
  cyan: {
    300: "#67e8f9",
    600: "#0891b2"
  },
  sky: {
    300: "#7dd3fc",
    600: "#0284c7"
  },
  blue: {
    300: "#93c5fd",
    600: "#2563eb"
  },
  indigo: {
    300: "#a5b4fc",
    600: "#4f46e5"
  },
  violet: {
    300: "#c4b5fd",
    600: "#7c3aed"
  },
  purple: {
    300: "#d8b4fe",
    600: "#9333ea"
  },
  fuchsia: {
    300: "#f0abfc",
    600: "#c026d3"
  },
  pink: {
    300: "#f9a8d4",
    600: "#db2777"
  },
  rose: {
    300: "#fda4af",
    600: "#e11d48"
  },
  gray: {
    300: "#d1d5db",
    600: "#4b5563"
  },
  slate: {
    300: "#cbd5e1",
    600: "#475569"
  },
  zinc: {
    300: "#d4d4d8",
    600: "#52525b"
  },
  neutral: {
    300: "#d6d6d6",
    600: "#525252"
  },
  stone: {
    300: "#e7e5e4",
    600: "#57534e"
  }
};

const colors300 = Object.values(tailwindColors).map(color => color[300]);
const colors600 = Object.values(tailwindColors).map(color => color[600]);

const hexColors = [...colors300, ...colors600];

export default hexColors