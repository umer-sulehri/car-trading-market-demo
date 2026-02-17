/**
 * Utility function to handle image URLs robustly.
 * Handles both relative paths (local storage) and absolute URLs (S3).
 */
export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";

    // If the path is already an absolute URL (starts with http or https), return as is
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // Otherwise, prepend the storage URL
    const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000/storage";

    // Ensure we don't have double slashes if the path starts with /
    const cleanedPath = path.startsWith("/") ? path.substring(1) : path;

    return `${baseUrl}/${cleanedPath}`;
};
