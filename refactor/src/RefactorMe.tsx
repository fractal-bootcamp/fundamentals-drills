import React, { useState } from "react";

type Item = { id: string; label: string; price: number };

const ITEMS: Item[] = [
  { id: "widget", label: "Widget", price: 12.5 },
  { id: "gadget", label: "Gadget", price: 7.25 },
];

export default function RefactorMe() {
  const [qtyWidget, setQtyWidget] = useState(0);
  const [qtyGadget, setQtyGadget] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);

  const widgetPrice = ITEMS[0].price;
  const gadgetPrice = ITEMS[1].price;
  const subtotal = qtyWidget * widgetPrice + qtyGadget * gadgetPrice;
  const discountPct = code.trim().toUpperCase() === "SAVE10" ? 0.1 : 0;
  const discounted = subtotal - subtotal * discountPct;
  const tax = discounted * 0.08;
  const total = discounted + tax;

  const fmt = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

  const canCheckout =
    name.trim().length > 0 && email.trim().length > 0 && agree && total > 0;

  return (
    <div
      data-testid="cart"
      style={{
        maxWidth: 520,
        margin: "0 auto",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Mini Checkout</h1>

      <div style={{ display: "grid", gap: 8 }}>
        <label>
          Name
          <input
            data-testid="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name"
            id="name"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <label>
          Email
          <input
            data-testid="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your email"
            id="email"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
      </div>

      <div
        style={{
          marginTop: 16,
          borderTop: "1px solid #eee",
          paddingTop: 12,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          data-testid="row-widget"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div>{ITEMS[0].label}</div>
          <div>${fmt(widgetPrice)}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              aria-label="decrement-widget"
              onClick={() => setQtyWidget((q) => (q - 1 < 0 ? 0 : q - 1))}
            >
              -
            </button>
            <span data-testid="qty-widget">{qtyWidget}</span>
            <button
              aria-label="increment-widget"
              onClick={() => setQtyWidget((q) => q + 1)}
            >
              +
            </button>
          </div>
          <div data-testid="line-widget">${fmt(qtyWidget * widgetPrice)}</div>
        </div>

        <div
          data-testid="row-gadget"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div>{ITEMS[1].label}</div>
          <div>${fmt(gadgetPrice)}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              aria-label="decrement-gadget"
              onClick={() => setQtyGadget((q) => (q - 1 < 0 ? 0 : q - 1))}
            >
              -
            </button>
            <span data-testid="qty-gadget">{qtyGadget}</span>
            <button
              aria-label="increment-gadget"
              onClick={() => setQtyGadget((q) => q + 1)}
            >
              +
            </button>
          </div>
          <div data-testid="line-gadget">${fmt(qtyGadget * gadgetPrice)}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        <label>
          Discount Code
          <input
            data-testid="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SAVE10"
            id="code"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            data-testid="agree"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I agree to the terms
        </label>
      </div>

      <div
        style={{
          marginTop: 12,
          borderTop: "1px dashed #ddd",
          paddingTop: 12,
          display: "grid",
          gap: 6,
        }}
      >
        <div data-testid="subtotal">Subtotal: ${fmt(subtotal)}</div>
        <div data-testid="discount">
          Discount: -${fmt(subtotal * discountPct)}
        </div>
        <div data-testid="tax">Tax (8%): ${fmt(tax)}</div>
        <div data-testid="total" style={{ fontWeight: 700 }}>
          Total: ${fmt(total)}
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button data-testid="toggle-summary" onClick={() => setShow((s) => !s)}>
          {show ? "Hide" : "Show"} Summary
        </button>
        <button
          data-testid="checkout"
          disabled={!canCheckout}
          onClick={() => alert("Checked out")}
        >
          Checkout
        </button>
      </div>

      {show && (
        <div
          data-testid="summary"
          style={{
            marginTop: 12,
            background: "#fafafa",
            border: "1px solid #eee",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <div>{name}</div>
          <div>{email}</div>
          <div>Items: {qtyWidget + qtyGadget}</div>
          <div>Due: ${fmt(total)}</div>
        </div>
      )}
    </div>
  );
}
