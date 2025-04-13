import { useState, useEffect } from "react";

/**
 * Custom hook to load an image and manage its loading state.
 *
 * @param {string} src - The source URL of the image to load.
 * @returns {Object} An object containing:
 *   - {HTMLImageElement|null} image - The loaded image element or null if not loaded.
 *   - {boolean} loading - A boolean indicating if the image is still loading.
 *   - {string|null} error - An error message if the image failed to load, or null if no error occurred.
 */
export const initialError = {
  error: "",
  message: "",
};

export default function useLoadImage(src) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  const img = new Image();

  function handleLoad() {
    setImage(img);
    setError({
      error: "",
      message: "",
    });
    setLoading(false);
  }

  function handleError(e = Event) {
    setError({
      error: e.error,
      message: `Failed to load image with src: ${src}`,
    });
    setLoading(false);
  }

  useEffect(() => {
    img.src = src;

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [src]);

  return { image, loading, error };
}
