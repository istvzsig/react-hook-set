import { renderHook, act } from "@testing-library/react";
import useLoadImage, { initialError } from "./useLoadImage";

const dummy_image_url = "https://stevensegallery.lucidinternets.com/200/300";

describe("useLoadImage", () => {
  let originalImage;

  beforeEach(() => {
    originalImage = global.Image;
  });

  afterEach(() => {
    global.Image = originalImage;
    jest.clearAllMocks();
  });

  it("should initialize with null image, false loading, and initial error", () => {
    const { result } = renderHook(() =>
      useLoadImage("http://test.com/image.jpg")
    );
    expect(result.current.image).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(initialError);
  });

  it("should handle successful image load", async () => {
    let loadCallback;

    const mockImageInstance = {
      src: "",
      addEventListener: jest.fn((event, cb) => {
        if (event === "load") loadCallback = cb;
      }),
      removeEventListener: jest.fn(),
    };

    global.Image = jest.fn(() => mockImageInstance);

    const { result } = renderHook(() => useLoadImage(dummy_image_url));

    await act(async () => {
      loadCallback();
    });

    expect(result.current.image).toEqual(mockImageInstance);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(initialError);
  });

  it("should handle image load error", async () => {
    let errorCallback;

    const mockError = { error: "mockError" };

    const mockImageInstance = {
      src: "",
      addEventListener: jest.fn((event, cb) => {
        if (event === "error") errorCallback = cb;
      }),
      removeEventListener: jest.fn(),
    };

    global.Image = jest.fn(() => mockImageInstance);

    const { result } = renderHook(() =>
      useLoadImage(dummy_image_url + " FAIL")
    );

    await act(async () => {
      errorCallback(mockError);
    });

    expect(result.current.image).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual({
      error: "mockError",
      message: `Failed to load image with src: ${dummy_image_url} FAIL`,
    });
  });
});
