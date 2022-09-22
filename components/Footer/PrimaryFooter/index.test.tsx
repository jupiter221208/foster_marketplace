import PrimaryFooter from './index';
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Footer", () => {
  it("renders the Footer", () => {
    render(<PrimaryFooter />);
    expect(screen.getByTestId("footer-container")).toBeInTheDocument();
  });
});
