# Camera Capture Feature

## Overview

Added camera capture functionality to the CreateReport page, allowing users to take photos directly from their device camera in addition to uploading existing images.

## What Was Added

### 1. **New State Variables**

- `showCamera`: Controls the visibility of the camera modal
- `stream`: Stores the MediaStream object for camera access

### 2. **Camera Functions**

#### `startCamera()`

- Requests access to device camera using `navigator.mediaDevices.getUserMedia`
- Uses `facingMode: "environment"` to default to back camera on mobile devices
- Handles permission errors gracefully with user-friendly error messages

#### `stopCamera()`

- Stops all camera tracks to release camera resources
- Closes the camera modal
- Cleans up the stream state

#### `capturePhoto()`

- Captures the current video frame from the camera
- Converts it to a JPEG file with timestamp-based naming
- Applies the same compression logic used for uploaded images
- Automatically closes the camera after successful capture
- Adds the captured photo to the images array

### 3. **UI Components**

#### Button Layout

- Split the upload button into two side-by-side buttons:
  - **Choose Images**: Opens file picker for uploading from gallery
  - **Take Photo**: Opens camera modal for direct capture

#### Camera Modal

- Full-screen overlay with dark background
- Live video preview from camera
- Close button (X) in top-right corner
- Large "Capture Photo" button below video
- Smooth animations using Framer Motion

#### Image Counter

- Shows current image count (e.g., "3/5 images added")
- Displayed between buttons and previews

### 4. **Cleanup and Memory Management**

- `useEffect` hook ensures camera stream is stopped when component unmounts
- Properly revokes object URLs for image previews to prevent memory leaks

## User Experience

### Desktop Users

1. Click "Take Photo" button
2. Browser requests camera permission (if not already granted)
3. Camera feed displays in full-screen modal
4. Click "Capture Photo" to take the picture
5. Photo is automatically compressed and added to the report
6. Camera closes automatically after capture

### Mobile Users

1. Same flow as desktop, but uses back camera by default
2. Can switch cameras using browser's native controls
3. Touch-friendly interface with large capture button

## Technical Details

### Browser API Used

- `navigator.mediaDevices.getUserMedia()`: Accesses camera
- Canvas API: Captures video frame and converts to image
- Blob API: Creates image file from canvas data

### Image Processing

- Captured photos go through the same compression pipeline as uploaded images
- Maximum dimension: 1920px
- JPEG quality: 0.7 (70%)
- Automatic size reduction for large images

### Error Handling

- Camera permission denied: User-friendly error message suggesting file upload
- Camera not available: Graceful fallback to file upload only
- Maximum image limit: Both buttons disabled when 5 images reached

## Browser Compatibility

### Supported

- ✅ Chrome/Edge (desktop & mobile)
- ✅ Firefox (desktop & mobile)
- ✅ Safari (iOS 11+, macOS)
- ✅ Samsung Internet
- ✅ Chrome for Android

### Fallback

- If camera API is not supported, the "Take Photo" button will show an error
- Users can always use "Choose Images" as a fallback

## Security & Privacy

### Permissions

- Camera access requires explicit user permission
- Permission is requested only when user clicks "Take Photo"
- No camera access occurs until user initiates it

### Data Handling

- Camera feed is never recorded or stored
- Only captured snapshots are processed
- All processing happens locally in the browser
- Images are only uploaded when user submits the report

## Future Enhancements

Potential improvements for future versions:

1. **Camera Controls**

   - Switch between front/back camera
   - Zoom controls
   - Flash control (if available)

2. **Multiple Captures**

   - Stay in camera mode to capture multiple photos
   - Gallery view of captured photos before closing

3. **Image Editing**

   - Crop/rotate captured images
   - Apply filters or adjustments
   - Draw/annotate on images

4. **Video Recording**

   - Capture short video clips of waste sites
   - Video thumbnail generation

5. **Enhanced Mobile Experience**
   - Native camera app integration
   - Better landscape/portrait handling
   - Touch gestures for zoom

## Testing Checklist

- [ ] Camera opens successfully on desktop
- [ ] Camera opens successfully on mobile
- [ ] Back camera is default on mobile
- [ ] Capture button works correctly
- [ ] Photos are compressed properly
- [ ] Photos appear in preview grid
- [ ] Remove button works on captured photos
- [ ] Camera stops when modal is closed
- [ ] Camera stops after successful capture
- [ ] Error handling for permission denied
- [ ] Error handling for no camera available
- [ ] Max image limit (5) is enforced
- [ ] Memory cleanup on component unmount
- [ ] Both upload and camera work together
- [ ] Photos can be submitted in report

## Code Files Modified

- `client/src/pages/CreateReport.jsx`: Added camera capture functionality

## Dependencies

No new dependencies required. Uses standard browser APIs:

- MediaStream API (getUserMedia)
- Canvas API
- Blob API

All dependencies are already available in modern browsers.
