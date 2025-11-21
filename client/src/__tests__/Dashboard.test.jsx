import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../../src/pages/Dashboard.jsx";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

// Mock AuthContext to return a simple user
vi.mock("../../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "u1",
      name: "Test",
      role: "user",
      ecoPoints: 5,
      reportsCount: 2,
    },
  }),
}));

describe("Dashboard page", () => {
  it("renders user eco points and fetches stats", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/reports/stats/dashboard") {
        return Promise.resolve({
          data: { data: { stats: { resolved: 1, pending: 2 } } },
        });
      }
      if (url.startsWith("/api/reports/user/")) {
        return Promise.resolve({ data: { data: { reports: [] } } });
      }
      return Promise.resolve({ data: {} });
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for component to finish loading and render content
    await waitFor(() =>
      expect(screen.getByText(/Your Recent Reports/i)).toBeInTheDocument()
    );

    // User eco points should be shown (from context)
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
