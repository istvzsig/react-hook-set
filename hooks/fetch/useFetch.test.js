import { renderHook } from "@testing-library/react";

import useFetch from "./useFetch";

describe("useFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle an empty URL", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetch(""));
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("should handle an invalid URL", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Invalid URL")));
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("invalid-url"),
    );
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Invalid URL");
  });

  it("should handle network errors", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network Error")));
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("https://example.com"),
    );
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Network Error");
  });

  it("should handle non-JSON response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve("Not JSON"),
      }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("https://example.com"),
    );
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe("Not JSON");
    expect(result.current.error).toBe(null);
  });

  it("should fetch data with POST method", async () => {
    const mockData = { id: 1, name: "Test" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("https://example.com", {
        method: "POST",
        body: { name: "Test" },
      }),
    );
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it("should send custom headers", async () => {
    const mockData = { id: 1, name: "Test" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("https://example.com", {
        headers: { Authorization: "Bearer token" },
      }),
    );
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
      }),
    );
  });
});
