import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateReport from "../../src/pages/CreateReport.jsx";
import { LoadingProvider } from "../../src/context/LoadingContext.jsx";
import { MemoryRouter } from "react-router-dom";

describe("CreateReport validation", () => {
  it("shows validation error when location not set", async () => {
    render(
      <MemoryRouter>
        <LoadingProvider>
          <CreateReport />
        </LoadingProvider>
      </MemoryRouter>
    );

    // Fill required fields to bypass native HTML validation
    const titleInput = screen.getByPlaceholderText(
      "e.g., Illegal dump near Main Street"
    );
    const descInput = screen.getByPlaceholderText(
      "Provide details about the waste site..."
    );
    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(descInput, { target: { value: "Test description" } });

    const submit = screen.getByRole("button", { name: /Submit Report/i });
    fireEvent.click(submit);

    // The component updates error state synchronously in handleSubmit
    const err = await screen.findByText(
      /Please get your current location first/i
    );
    expect(err).toBeInTheDocument();
  });
});
