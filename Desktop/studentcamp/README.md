# Video Converter Tool

A modern web application for converting video files to MP3 and MP4 formats using `fluent-ffmpeg`.

## Features

- **File Upload Conversion**: Upload video files and convert them to MP3 or MP4
- **Multiple Input Formats**: Supports MP4, AVI, MOV, MKV, and other video formats
- **Quality Settings**: Choose between high and medium quality output
- **Video Analysis**: Get detailed information about uploaded videos including codec, resolution, duration, and audio details
- **Real-time Processing**: Uses `fluent-ffmpeg` for efficient video processing
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- FFmpeg installed on your system
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studentcamp
```

2. Install dependencies:
```bash
npm install
```

3. Install additional dependencies for file upload:
```bash
npm install multer @types/multer
```

4. Make sure FFmpeg is installed on your system:
   - **Windows**: Download from https://ffmpeg.org/download.html
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg` (Ubuntu/Debian) or `sudo yum install ffmpeg` (CentOS/RHEL)

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Click on "Video Converter" from the home page

4. Upload a video file by clicking "Choose Video File"

5. The system will automatically analyze the video and display information about:
   - File size and duration
   - Video codec, resolution, and bitrate
   - Audio codec, sample rate, and channels

6. Choose your preferred output format (MP3 or MP4) and quality settings

7. Click "Convert & Download" to process the video

8. The converted file will be automatically downloaded to your computer

## API Endpoints

### POST `/api/video-info`
Analyzes uploaded video file and returns detailed information.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `video` (file)

**Response:**
```json
{
  "filename": "video.mp4",
  "size": 1048576,
  "duration": 120.5,
  "format": "mp4",
  "video": {
    "codec": "h264",
    "width": 1920,
    "height": 1080,
    "bitrate": "2000000"
  },
  "audio": {
    "codec": "aac",
    "sampleRate": "44100",
    "channels": 2
  }
}
```

### POST `/api/convert`
Converts uploaded video to MP3 or MP4 format.

**Request:**
- Content-Type: `multipart/form-data`
- Body: 
  - `video` (file)
  - `format` (string): "mp3" or "mp4"
  - `quality` (string): "high" or "medium"

**Response:**
- File download with converted video/audio

## Technical Details

### Backend
- **Express.js**: Web server framework
- **fluent-ffmpeg**: Video processing library
- **multer**: File upload middleware
- **TypeScript**: Type safety

### Frontend
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library

### File Processing
- Uploaded files are temporarily stored in `uploads/` directory
- Converted files are temporarily stored in `converted/` directory
- Files are automatically cleaned up after processing
- Maximum file size: 100MB

## Supported Formats

### Input Formats
- MP4, AVI, MOV, MKV, WMV, FLV, WebM, and more

### Output Formats
- **MP3**: Audio only, 128kbps (medium) or 320kbps (high)
- **MP4**: Video with H.264 codec, 720p resolution, AAC audio

## Error Handling

The application includes comprehensive error handling for:
- Invalid file uploads
- Unsupported file formats
- FFmpeg processing errors
- Network issues
- File size limits

## Security Considerations

- File size limits prevent abuse
- Temporary file cleanup prevents disk space issues
- Input validation ensures only video files are processed
- No persistent storage of uploaded files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. "# web" 
"# web" 
