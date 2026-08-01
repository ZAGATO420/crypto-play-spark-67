import { loadFont as loadDisplay } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const display = loadDisplay("normal", { weights: ["800", "900"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;