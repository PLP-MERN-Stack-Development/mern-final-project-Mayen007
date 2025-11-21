# Loading Modal Usage Guide

## Overview

The LoadingModal system provides a reusable, modular way to show loading states during database operations and async tasks.

## Setup (Already Done)

```jsx
// App.jsx
import { LoadingProvider } from "./context/LoadingContext";

<AuthProvider>
  <LoadingProvider>{/* Your app */}</LoadingProvider>
</AuthProvider>;
```

## Basic Usage

### 1. Import the hook

```jsx
import { useLoading } from "../context/LoadingContext";

const MyComponent = () => {
  const { showLoading, hideLoading } = useLoading();
  // ...
};
```

### 2. Simple Loading

```jsx
const handleSubmit = async () => {
  showLoading("Saving changes...");

  try {
    await axios.post("/api/endpoint", data);
  } finally {
    hideLoading();
  }
};
```

### 3. Different Loading Types

```jsx
// Default (gray spinner)
showLoading("Loading...", "default");

// Upload (blue, rotating cloud icon)
showLoading("Uploading files...", "upload");

// Delete (red, trash icon)
showLoading("Deleting report...", "delete");

// Submit (green, checkmark icon)
showLoading("Creating report...", "submit");
```

### 4. Progress Bar (for uploads)

```jsx
const handleUpload = async (files) => {
  showLoading("Uploading images...", "upload", 0);

  for (let i = 0; i < files.length; i++) {
    await uploadFile(files[i]);

    // Update progress
    const progress = ((i + 1) / files.length) * 100;
    updateProgress(progress);
    updateMessage(`Uploading image ${i + 1} of ${files.length}...`);
  }

  hideLoading();
};
```

### 5. Dynamic Messages

```jsx
const { showLoading, hideLoading, updateMessage } = useLoading();

const processData = async () => {
  showLoading("Step 1: Validating...", "submit");
  await validate();

  updateMessage("Step 2: Processing...");
  await process();

  updateMessage("Step 3: Saving...");
  await save();

  hideLoading();
};
```

## Complete Examples

### Report Creation (Already Implemented)

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  showLoading("Validating report...", "submit");

  try {
    updateMessage("Preparing data...");
    const formData = prepareFormData();

    updateMessage(`Uploading report with ${images.length} images...`);
    const response = await axios.post("/api/reports", formData);

    updateMessage("Report created successfully!");
    setTimeout(() => {
      hideLoading();
      navigate(`/reports/${response.data.data.report._id}`);
    }, 500);
  } catch (error) {
    hideLoading();
    setError(error.message);
  }
};
```

### Image Compression

```jsx
const handleImageChange = async (files) => {
  showLoading(`Compressing ${files.length} images...`, "upload", 0);

  try {
    for (let i = 0; i < files.length; i++) {
      const progress = ((i + 1) / files.length) * 100;
      updateProgress(progress);
      updateMessage(`Compressing image ${i + 1} of ${files.length}...`);

      await compressImage(files[i]);
    }

    hideLoading();
  } catch (error) {
    hideLoading();
    setError("Compression failed");
  }
};
```

### Delete Operation

```jsx
const handleDelete = async (id) => {
  if (!confirm("Are you sure?")) return;

  showLoading("Deleting report...", "delete");

  try {
    await axios.delete(`/api/reports/${id}`);
    hideLoading();
    navigate("/reports");
  } catch (error) {
    hideLoading();
    setError("Delete failed");
  }
};
```

### Status Update

```jsx
const handleStatusUpdate = async (newStatus) => {
  showLoading(`Updating status to ${newStatus}...`, "submit");

  try {
    await axios.patch(`/api/reports/${id}/status`, { status: newStatus });
    hideLoading();
    fetchReport(); // Refresh
  } catch (error) {
    hideLoading();
    setError("Update failed");
  }
};
```

## API Reference

### Hook: `useLoading()`

Returns an object with:

- **`loading`** - Current loading state object

  - `isLoading`: boolean
  - `message`: string
  - `type`: 'default' | 'upload' | 'delete' | 'submit'
  - `progress`: number | null (0-100)

- **`showLoading(message, type, progress)`**

  - `message` (string): Text to display
  - `type` (string, optional): Loading type (default: 'default')
  - `progress` (number, optional): Initial progress (0-100)

- **`hideLoading()`**

  - Hides the loading modal

- **`updateMessage(message)`**

  - `message` (string): New message to display

- **`updateProgress(progress)`**
  - `progress` (number): Progress value (0-100)

## Best Practices

1. **Always hide loading** - Use try/finally or ensure hideLoading() is called
2. **Descriptive messages** - Tell users what's happening
3. **Right type** - Use appropriate type for visual feedback
4. **Progress for long tasks** - Show progress bar for multi-step operations
5. **Brief success messages** - Show success before navigation
6. **Error handling** - Always handle errors and hide loading

## Where to Use

✅ **Use Loading Modal for:**

- Report creation/updates
- Image uploads
- Delete operations
- Status changes
- Form submissions
- Data fetching (initial load)

❌ **Don't use for:**

- Instant operations (< 100ms)
- Background tasks user doesn't need to wait for
- Operations where inline loading indicators are better

## Styling

The modal automatically matches your design system:

- Uses Framer Motion for smooth animations
- Glassmorphism backdrop
- Color-coded by type (blue/red/green/gray)
- Responsive and mobile-friendly
- Accessible (proper ARIA labels)

## Future Enhancements

Potential additions:

- Queue multiple operations
- Cancel button for long operations
- Success/error modals with auto-dismiss
- Custom icons
- Sound effects
- Confetti on success 🎉
