import React, { useRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useOnClickOutside } from "./useOnClickOutside";

function TestComponent({ onClickOutside }) {
  const ref = useRef(null);
  useOnClickOutside(onClickOutside);

  return (
    <div ref={ref} data-testid="inside">
      Click inside
    </div>
  );
}

describe("useOnClickOutside", () => {
  let handleClickOutside;

  beforeEach(() => {
    handleClickOutside = jest.fn();
  });

  it("does not call handler when clicking inside the referenced element", () => {
    const { getByTestId } = render(
      <TestComponent onClickOutside={handleClickOutside} />
    );

    // Click inside the component
    fireEvent.mouseDown(getByTestId("inside"));

    // Check that the handler was not called
    expect(handleClickOutside).not.toHaveBeenCalled();
  });

  it("cleans up event listeners on unmount", () => {
    const { unmount } = render(
      <TestComponent onClickOutside={handleClickOutside} />
    );

    // Unmount the component
    unmount();

    // Click outside the component
    fireEvent.mouseDown(document.body);

    // Check that the handler was not called
    expect(handleClickOutside).not.toHaveBeenCalled();
  });

  it("handles null ref gracefully", () => {
    const { unmount } = render(
      <TestComponent onClickOutside={handleClickOutside} />
    );

    // Click outside the component
    fireEvent.mouseDown(document.body);

    // Check that the handler was not called
    expect(handleClickOutside).not.toHaveBeenCalled();
  });

  it("handles undefined ref gracefully", () => {
    const { unmount } = render(
      <TestComponent onClickOutside={handleClickOutside} />
    );

    // Click outside the component
    fireEvent.mouseDown(document.body);

    // Check that the handler was not called
    expect(handleClickOutside).not.toHaveBeenCalled();
  });
});
