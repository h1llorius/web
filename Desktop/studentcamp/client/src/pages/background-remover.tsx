import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Wand2, Download, Loader2 } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

export default function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backgroundOption, setBackgroundOption] = useState("transparent");
  const [edgeRefinement, setEdgeRefinement] = useState([50]);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setShowPreview(false);
    setProcessedImageUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("backgroundOption", backgroundOption);
      formData.append("edgeRefinement", edgeRefinement[0].toString());

      const response = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove background");
      }

      // Convert the response to a blob and create URL
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setProcessedImageUrl(imageUrl);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement("a");
      link.href = processedImageUrl;
      link.download = `background-removed-${selectedFile?.name.replace(/\.[^/.]+$/, "")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const backgroundOptions = [
    {
      id: "transparent",
      name: "Transparent",
      preview: (
        <div className="w-full h-20 bg-transparent border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
          <span className="text-primary font-medium">Transparent</span>
        </div>
      )
    },
    {
      id: "white",
      name: "White Background",
      preview: <div className="w-full h-20 bg-white border-2 border-slate-200 rounded-lg"></div>
    },
    {
      id: "custom",
      name: "Custom Color",
      preview: <div className="w-full h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Background Remover</h1>
        <p className="text-lg text-slate-600">Remove backgrounds with AI precision</p>
      </div>

      <Card className="shadow-xl">
        <CardContent className="p-8">
          {/* File Upload Area */}
          <FileUpload
            accept="image/*"
            maxSize={10}
            onFileSelect={handleFileSelect}
            className="mb-8"
          />

          {/* Processing Options */}
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">Background Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {backgroundOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className={`p-4 h-auto flex-col border-2 transition-all duration-200 ${
                      backgroundOption === option.id
                        ? "bg-primary/10 border-primary"
                        : "border-slate-200 hover:border-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setBackgroundOption(option.id)}
                  >
                    {option.preview}
                    <div className="text-sm font-medium mt-3">{option.name}</div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Edge Refinement */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">Edge Refinement</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={edgeRefinement}
                  onValueChange={setEdgeRefinement}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-slate-600 font-medium min-w-[3rem]">
                  {edgeRefinement[0]}%
                </span>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Process Button */}
            <Button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full gradient-accent hover:opacity-90 text-white py-4 h-auto font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Remove Background
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Before/After Preview */}
      {showPreview && (
        <Card className="mt-8 shadow-xl">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-slate-600 mb-2">Original</div>
                <div className="aspect-square bg-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden">
                  {selectedFile && (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600 mb-2">Result</div>
                <div className="aspect-square bg-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden">
                  {processedImageUrl ? (
                    <img
                      src={processedImageUrl}
                      alt="Background Removed"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-slate-500">Processing...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button 
              onClick={handleDownload}
              disabled={!processedImageUrl}
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3 font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Result
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
