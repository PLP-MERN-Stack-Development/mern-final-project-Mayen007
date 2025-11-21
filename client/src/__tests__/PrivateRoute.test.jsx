import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";

// Mutable auth state for tests
let authState = { isAuthenticated: true, loading: false };

vi.mock("../context/AuthContext", () => ({
  useAuth: () => authState,
}));

describe("PrivateRoute", () => {
  it("renders children when authenticated", () => {
    authState = { isAuthenticated: true, loading: false };

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected")).toBeInTheDocument();
  });

  it("hides children when not authenticated", () => {
    authState = { isAuthenticated: false, loading: false };

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <PrivateRoute>
          <div>Protected</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Protected")).toBeNull();
  });
});
