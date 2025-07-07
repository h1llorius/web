import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, FileVideo, Music, Video, Info } from "lucide-react";

interface VideoInfo {
  filename: string;
  size: number;
  duration: number;
  format: string;
  video: {
    codec: string;
    width: number;
    height: number;
    bitrate: string;
  } | null;
  audio: {
    codec: string;
    sampleRate: string;
    channels: number;
  } | null;
}

export default function VideoConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [format, setFormat] = useState<string>("mp3");
  const [quality, setQuality] = useState<string>("high");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoInfo(null);
      setError("");
      setSuccess("");
      
      // Get video info
      getVideoInfo(file);
    }
  };

  const getVideoInfo = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/video-info", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze video");
      }

      const info = await response.json();
      setVideoInfo(info);
    } catch (err) {
      console.error("Error getting video info:", err);
      setError("Failed to analyze video file");
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError("Please select a video file first");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("format", format);
      formData.append("quality", quality);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "converted";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(`Successfully converted to ${format.toUpperCase()}!`);
      setProgress(100);
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Failed to convert video");
    } finally {
      setIsConverting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Video Converter</h1>
        <p className="text-muted-foreground">
          Convert your video files to MP3 or MP4 format
        </p>
      </div>

      <div className="grid gap-6">
        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Video File
            </CardTitle>
            <CardDescription>
              Select a video file to convert. Supported formats: MP4, AVI, MOV, MKV, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isConverting}
                >
                  <FileVideo className="h-4 w-4 mr-2" />
                  Choose Video File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedFile.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video Info Section */}
        {videoInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Video Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Filename</Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">
                    {videoInfo.filename}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>File Size</Label>
                  <p className="text-sm">{formatFileSize(videoInfo.size)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <p className="text-sm">{formatDuration(videoInfo.duration)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <p className="text-sm">{videoInfo.format.toUpperCase()}</p>
                </div>
              </div>

              {videoInfo.video && (
                <div className="mt-4">
                  <Separator className="my-4" />
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Stream
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Codec</Label>
                      <p className="text-sm">{videoInfo.video.codec}</p>
                    </div>
                    <div>
                      <Label>Resolution</Label>
                      <p className="text-sm">{videoInfo.video.width} x {videoInfo.video.height}</p>
                    </div>
                    <div>
                      <Label>Bitrate</Label>
                      <p className="text-sm">{videoInfo.video.bitrate}</p>
                    </div>
                  </div>
                </div>
              )}

              {videoInfo.audio && (
                <div className="mt-4">
                  <Separator className="my-4" />
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Audio Stream
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Codec</Label>
                      <p className="text-sm">{videoInfo.audio.codec}</p>
                    </div>
                    <div>
                      <Label>Sample Rate</Label>
                      <p className="text-sm">{videoInfo.audio.sampleRate} Hz</p>
                    </div>
                    <div>
                      <Label>Channels</Label>
                      <p className="text-sm">{videoInfo.audio.channels}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Conversion Settings */}
        {selectedFile && (
          <Card>
            <CardHeader>
              <CardTitle>Conversion Settings</CardTitle>
              <CardDescription>
                Choose your preferred output format and quality settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp3">MP3 (Audio Only)</SelectItem>
                      <SelectItem value="mp4">MP4 (Video)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Quality</SelectItem>
                      <SelectItem value="medium">Medium Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleConvert}
                  disabled={isConverting || !selectedFile}
                  className="w-full"
                  size="lg"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Convert & Download
                    </>
                  )}
                </Button>
              </div>

              {isConverting && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Converting...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
