import express, { Request } from "express";
import { storage } from "./storage";
import ffmpeg from "fluent-ffmpeg";
import multer from "multer";
import { unlinkSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { createServer, type Server } from "http";
import { removeBackground } from "@imgly/background-removal-node";

// Extend Request type to include file property from multer
interface MulterRequest extends Request {
  file?: any;
}

const router = express.Router();

// Setup multer for file uploads
const upload = multer({ 
  dest: "uploads/",
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Ensure directories exist
const ensureDirectories = () => {
  const dirs = ["uploads", "converted"];
  dirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectories();

// Background removal endpoint
router.post("/api/remove-background", upload.single("image"), async (req: MulterRequest, res) => {
  try {
    const file = req.file;
    const backgroundOption = req.body.backgroundOption || "transparent";
    const edgeRefinement = parseInt(req.body.edgeRefinement) || 50;
    
    if (!file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Validate file type
    if (!file.mimetype.startsWith("image/")) {
      unlinkSync(file.path);
      return res.status(400).json({ error: "File must be an image" });
    }

    // Check for supported image formats
    const supportedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!supportedFormats.includes(file.mimetype.toLowerCase())) {
      unlinkSync(file.path);
      return res.status(400).json({ 
        error: `Unsupported image format: ${file.mimetype}. Supported formats: JPEG, PNG, WebP` 
      });
    }

    console.log(`Processing background removal for: ${file.originalname} (${file.mimetype})`);
    console.log(`File path: ${file.path}`);

    // Configure background removal
    const config = {
      model: "medium" as const,
      output: {
        format: "image/png" as const,
        quality: 0.8,
        type: "foreground" as const
      },
      debug: true, // Enable debug to see more information
      progress: (key: string, current: number, total: number) => {
        console.log(`Downloading ${key}: ${current} of ${total}`);
      }
    };

    try {
      // Remove background using file path directly (as shown in documentation)
      const resultBlob = await removeBackground(file.path, config);

      // Convert blob to buffer
      const arrayBuffer = await resultBlob.arrayBuffer();
      const resultBuffer = Buffer.from(arrayBuffer);

      // Clean up uploaded file
      unlinkSync(file.path);

      // Set response headers
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="background-removed-${file.originalname.replace(/\.[^/.]+$/, "")}.png"`);
      
      // Send the processed image
      res.send(resultBuffer);

    } catch (error) {
      console.error("Background removal error:", error);
      
      // Clean up uploaded file if it exists
      if (req.file) {
        try {
          unlinkSync(req.file.path);
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }
      }
      
      res.status(500).json({ error: "Failed to remove background" });
    }
  } catch (error) {
    console.error("Background removal error:", error);
    
    // Clean up uploaded file if it exists
    if (req.file) {
      try {
        unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }
    }
    
    res.status(500).json({ error: "Failed to remove background" });
  }
})

// Get video info from uploaded file
router.post("/api/video-info", upload.single("video"), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    ffmpeg.ffprobe(file.path, (err, metadata) => {
      if (err) {
        console.error("FFprobe error:", err);
        unlinkSync(file.path);
        return res.status(500).json({ error: "Failed to analyze video" });
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === "video");
      const audioStream = metadata.streams.find(stream => stream.codec_type === "audio");

      const info = {
        filename: file.originalname,
        size: file.size,
        duration: metadata.format.duration,
        format: metadata.format.format_name,
        video: videoStream ? {
          codec: videoStream.codec_name,
          width: videoStream.width,
          height: videoStream.height,
          bitrate: videoStream.bit_rate
        } : null,
        audio: audioStream ? {
          codec: audioStream.codec_name,
          sampleRate: audioStream.sample_rate,
          channels: audioStream.channels
        } : null
      };

      // Clean up uploaded file
      unlinkSync(file.path);
      
      res.json(info);
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server failed" });
  }
});

// Convert uploaded video to MP3/MP4
router.post("/api/convert", upload.single("video"), async (req, res) => {
  try {
    const format = req.body.format || "mp3";
    const quality = req.body.quality || "high";
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    const filename = file.originalname.replace(/\.[^/.]+$/, ""); // Remove extension
    const outputExtension = format === "mp3" ? "mp3" : "mp4";
    const outputPath = join("converted", `${filename}.${outputExtension}`);

    // Ensure output directory exists
    if (!existsSync("converted")) {
      mkdirSync("converted", { recursive: true });
    }

    let command = ffmpeg(file.path);

    if (format === "mp3") {
      // Convert to MP3
      command = command
        .toFormat("mp3")
        .audioCodec("libmp3lame")
        .audioBitrate(quality === "high" ? "320k" : "128k")
        .audioChannels(2);
    } else {
      // Convert to MP4
      command = command
        .toFormat("mp4")
        .videoCodec("libx264")
        .audioCodec("aac")
        .videoBitrate(quality === "high" ? "2000k" : "800k")
        .audioBitrate("128k")
        .size("1280x720"); // Standard HD resolution
    }

    command
      .on("start", (commandLine) => {
        console.log("FFmpeg command:", commandLine);
      })
      .on("progress", (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on("end", () => {
        console.log("Conversion completed");
        
        // Send converted file to client
        res.download(outputPath, `${filename}.${outputExtension}`, (err) => {
          if (err) {
            console.error("Download error:", err);
          }
          
          // Clean up files
          try {
            unlinkSync(file.path); // Remove uploaded file
            unlinkSync(outputPath); // Remove converted file
          } catch (cleanupErr) {
            console.error("Cleanup error:", cleanupErr);
          }
        });
      })
      .on("error", (err) => {
        console.error("Conversion error:", err);
        
        // Clean up uploaded file
        try {
          unlinkSync(file.path);
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }
        
        res.status(500).json({ error: "Failed to convert video" });
      })
      .save(outputPath);

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server failed" });
  }
});

export async function registerRoutes(app: express.Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Register the router with the app
  app.use(router);

  // Create HTTP server
  const server = createServer(app);
  return server;
}
