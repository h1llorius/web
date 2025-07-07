import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shuffle, Pipette, Palette, Copy, FileCode, FileText, Image, Code, Lightbulb } from "lucide-react";
import { 
  generateRandomColor, 
  generateHarmoniousPalette, 
  generateComplementaryPalette,
  generateMonochromaticPalette,
  hexToHsl, 
  hexToRgb, 
  formatHsl, 
  formatRgb 
} from "@/lib/color-utils";
import { useToast } from "@/hooks/use-toast";

export default function ColorGenerator() {
  const [baseColor, setBaseColor] = useState("#3B82F6");
  const [colors, setColors] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    generateRandomPalette();
  }, []);

  const generateRandomPalette = () => {
    const newColors = [];
    for (let i = 0; i < 5; i++) {
      newColors.push(generateRandomColor());
    }
    setColors(newColors);
  };

  const generateFromColor = () => {
    const newColors = generateHarmoniousPalette(baseColor);
    setColors(newColors);
  };

  const generateComplementary = () => {
    const newColors = generateComplementaryPalette(baseColor);
    setColors(newColors);
  };

  const generateMonochromatic = () => {
    const newColors = generateMonochromaticPalette(baseColor);
    setColors(newColors);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `Color ${text} copied successfully`,
      });
    });
  };

  const exportPalette = (format: string) => {
    let content = "";
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case "css":
        content = `:root {\n${colors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
        break;
      case "scss":
        content = colors.map((color, i) => `$color-${i + 1}: ${color};`).join('\n');
        break;
      case "json":
        content = JSON.stringify({ 
          name: `Palette ${timestamp}`,
          colors: colors.map((color, i) => ({
            name: `Color ${i + 1}`,
            hex: color,
            rgb: formatRgb(hexToRgb(color)),
            hsl: formatHsl(hexToHsl(color))
          }))
        }, null, 2);
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `palette-${timestamp}.${format === 'json' ? 'json' : format === 'scss' ? 'scss' : 'css'}`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Palette exported",
      description: `Downloaded as ${format.toUpperCase()} file`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Color Palette Generator</h1>
        <p className="text-lg text-slate-600">Create beautiful color combinations for your designs</p>
      </div>

      <Card className="shadow-xl">
        <CardContent className="p-8">
          {/* Generation Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={generateRandomPalette}
              className="flex-1 gradient-accent hover:opacity-90 text-white font-semibold"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Generate Random
            </Button>
            <Button
              onClick={generateFromColor}
              variant="outline"
              className="flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Pipette className="mr-2 h-4 w-4" />
              From Base Color
            </Button>
            <Button
              onClick={generateComplementary}
              variant="outline"
              className="flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Palette className="mr-2 h-4 w-4" />
              Complementary
            </Button>
            <Button
              onClick={generateMonochromatic}
              variant="outline"
              className="flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Palette className="mr-2 h-4 w-4" />
              Monochromatic
            </Button>
          </div>

          {/* Base Color Input */}
          <div className="mb-8">
            <Label className="text-sm font-medium text-slate-700 mb-3 block">Base Color (Optional)</Label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
              />
              <Input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                placeholder="#3B82F6"
                className="font-mono border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Color Palette Display */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {colors.map((color, index) => {
              const hsl = hexToHsl(color);
              const rgb = hexToRgb(color);
              
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden border border-slate-200">
                  <div 
                    className="h-32 group-hover:h-36 transition-all duration-200"
                    style={{ backgroundColor: color }}
                  ></div>
                  <CardContent className="p-4">
                    <div className="font-mono text-sm text-slate-900 font-semibold mb-2">
                      {color.toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>RGB: {formatRgb(rgb)}</div>
                      <div>HSL: {formatHsl(hsl)}</div>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(color)}
                      variant="ghost"
                      size="sm"
                      className="mt-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Export Options */}
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Export Options</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => exportPalette("css")}
                variant="outline"
                className="border-2 border-slate-200 hover:border-slate-300"
              >
                <FileCode className="mr-2 h-4 w-4" />
                CSS
              </Button>
              <Button
                onClick={() => exportPalette("scss")}
                variant="outline"
                className="border-2 border-slate-200 hover:border-slate-300"
              >
                <FileText className="mr-2 h-4 w-4" />
                SCSS
              </Button>
              <Button
                onClick={() => exportPalette("json")}
                variant="outline"
                className="border-2 border-slate-200 hover:border-slate-300"
              >
                <Code className="mr-2 h-4 w-4" />
                JSON
              </Button>
              <Button
                onClick={() => toast({ title: "PNG Export", description: "PNG export feature coming soon!" })}
                variant="outline"
                className="border-2 border-slate-200 hover:border-slate-300"
              >
                <Image className="mr-2 h-4 w-4" />
                PNG
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Theory Tips */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" />
            Color Theory Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div>
              <strong>Complementary:</strong> Colors opposite on the color wheel create high contrast and vibrant looks.
            </div>
            <div>
              <strong>Analogous:</strong> Adjacent colors create serene and comfortable designs.
            </div>
            <div>
              <strong>Triadic:</strong> Three evenly spaced colors offer strong visual contrast while retaining harmony.
            </div>
            <div>
              <strong>Monochromatic:</strong> Variations of a single color create elegant and cohesive designs.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
