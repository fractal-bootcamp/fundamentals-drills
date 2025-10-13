import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import RefactorMe from "../src/RefactorMe";

afterEach(() => {
  cleanup();
});

const click = (el: HTMLElement) => fireEvent.click(el);
const input = (el: HTMLElement, value: string) =>
  fireEvent.change(el, { target: { value } });

const money = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

describe("RefactorMe", () => {
  beforeEach(() => {
    render(<RefactorMe />);
  });

  it("renders base structure", () => {
    expect(screen.getByTestId("cart")).toBeInTheDocument();
    expect(screen.getByTestId("row-widget")).toBeInTheDocument();
    expect(screen.getByTestId("row-gadget")).toBeInTheDocument();
    expect(screen.getByTestId("subtotal")).toHaveTextContent("Subtotal: $0.00");
    expect(screen.getByTestId("total")).toHaveTextContent("Total: $0.00");
    expect(screen.getByTestId("checkout")).toBeDisabled();
  });

  it("increments and decrements quantities with non-negative clamp", () => {
    click(screen.getByLabelText("decrement-widget"));
    expect(screen.getByTestId("qty-widget")).toHaveTextContent("0");
    click(screen.getByLabelText("increment-widget"));
    click(screen.getByLabelText("increment-widget"));
    expect(screen.getByTestId("qty-widget")).toHaveTextContent("2");
    click(screen.getByLabelText("decrement-widget"));
    expect(screen.getByTestId("qty-widget")).toHaveTextContent("1");
  });

  it("computes totals with tax and optional discount", () => {
    click(screen.getByLabelText("increment-widget")); // +1 * 12.5
    click(screen.getByLabelText("increment-gadget")); // +1 * 7.25
    const subtotal = 12.5 + 7.25;
    const discount = 0;
    const discounted = subtotal - discount;
    const tax = discounted * 0.08;
    const total = discounted + tax;

    expect(screen.getByTestId("subtotal")).toHaveTextContent(
      `Subtotal: $${money(subtotal)}`
    );
    expect(screen.getByTestId("discount")).toHaveTextContent(
      `Discount: -$${money(discount)}`
    );
    expect(screen.getByTestId("tax")).toHaveTextContent(
      `Tax (8%): $${money(tax)}`
    );
    expect(screen.getByTestId("total")).toHaveTextContent(
      `Total: $${money(total)}`
    );
  });

  it("applies SAVE10 discount before tax", () => {
    click(screen.getByLabelText("increment-widget")); // +1 * 12.5
    click(screen.getByLabelText("increment-gadget")); // +1 * 7.25
    input(screen.getByTestId("code-input"), "save10");
    const subtotal = 12.5 + 7.25;
    const discount = subtotal * 0.1;
    const discounted = subtotal - discount;
    const tax = discounted * 0.08;
    const total = discounted + tax;

    expect(screen.getByTestId("discount")).toHaveTextContent(
      `Discount: -$${money(discount)}`
    );
    expect(screen.getByTestId("total")).toHaveTextContent(
      `Total: $${money(total)}`
    );
  });

  it("enables Checkout only with name, email, agreement, and nonzero total", () => {
    input(screen.getByTestId("name-input"), "Ada");
    input(screen.getByTestId("email-input"), "ada@example.com");
    fireEvent.click(screen.getByTestId("agree"));
    expect(screen.getByTestId("checkout")).toBeDisabled();

    click(screen.getByLabelText("increment-widget"));
    expect(screen.getByTestId("checkout")).toBeEnabled();
  });

  it("toggles summary panel and shows correct values", () => {
    input(screen.getByTestId("name-input"), "Linus");
    input(screen.getByTestId("email-input"), "linus@example.com");
    click(screen.getByLabelText("increment-gadget"));
    click(screen.getByTestId("toggle-summary"));
    expect(screen.getByTestId("summary")).toBeInTheDocument();
    expect(screen.getByTestId("summary")).toHaveTextContent("Linus");
    expect(screen.getByTestId("summary")).toHaveTextContent(
      "linus@example.com"
    );
    expect(screen.getByTestId("summary")).toHaveTextContent("Items: 1");
  });

  it("line totals reflect each row correctly", () => {
    click(screen.getByLabelText("increment-widget"));
    click(screen.getByLabelText("increment-widget"));
    click(screen.getByLabelText("increment-gadget"));
    expect(screen.getByTestId("line-widget")).toHaveTextContent("$25.00");
    expect(screen.getByTestId("line-gadget")).toHaveTextContent("$7.25");
  });
});
