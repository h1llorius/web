export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToHsl(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return { 
    h: Math.round(h * 360), 
    s: Math.round(s * 100), 
    l: Math.round(l * 100) 
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360; // Normalize to 0-360
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, (h / 360) + 1/3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, (h / 360) - 1/3);
  }

  const toHex = (c: number): string => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 50) + 50; // 50-100%
  const lightness = Math.floor(Math.random() * 40) + 30; // 30-70%
  return hslToHex(hue, saturation, lightness);
}

export function generateHarmoniousPalette(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  const colors = [baseColor];
  
  // Generate analogous colors (30 degree intervals)
  for (let i = 1; i < 5; i++) {
    const newHue = (hsl.h + (i * 30)) % 360;
    const newSaturation = Math.max(20, Math.min(100, hsl.s + (Math.random() - 0.5) * 20));
    const newLightness = Math.max(20, Math.min(80, hsl.l + (Math.random() - 0.5) * 20));
    colors.push(hslToHex(newHue, newSaturation, newLightness));
  }
  
  return colors;
}

export function generateComplementaryPalette(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  const colors = [baseColor];
  
  // Complementary color (180 degrees opposite)
  const compHue = (hsl.h + 180) % 360;
  colors.push(hslToHex(compHue, hsl.s, hsl.l));
  
  // Triadic colors (120 and 240 degrees)
  const triadic1 = (hsl.h + 120) % 360;
  const triadic2 = (hsl.h + 240) % 360;
  colors.push(hslToHex(triadic1, Math.round(hsl.s * 0.8), Math.round(hsl.l * 1.1)));
  colors.push(hslToHex(triadic2, Math.round(hsl.s * 0.8), Math.round(hsl.l * 1.1)));
  
  // Add a neutral tone
  colors.push(hslToHex(hsl.h, Math.round(hsl.s * 0.2), Math.round(hsl.l * 0.9)));
  
  return colors;
}

export function generateMonochromaticPalette(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  const colors = [];
  
  // Generate 5 variations with different lightness values
  const lightnessValues = [20, 35, 50, 65, 80];
  for (const lightness of lightnessValues) {
    colors.push(hslToHex(hsl.h, hsl.s, lightness));
  }
  
  return colors;
}

export function formatHsl(hsl: HSL): string {
  return `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
}

export function formatRgb(rgb: RGB): string {
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}
