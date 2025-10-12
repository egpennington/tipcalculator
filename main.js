const buttonValues = [
  "AC", "+/-", "%", "÷",
  "7", "8", "9", "x",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "=",
  "10%", "15%", "20%", "25%"
];

const rightSymbols = ["÷", "x", "-", "+", "="];
const topSymbols = ["AC", "+/-", "%"];
const bottomSymbols = ["10%", "15%", "20%", "25%"];

const display = document.getElementById("display");
display.value = "0"; // start at 0

// Tip/Total UI (optional)
const billEl = document.getElementById("bill-amount");
const tipEl = document.getElementById("tip-amount");
const totalEl = document.getElementById("total-amount");
const tipResults = document.getElementById("tip-results");

// simple currency-ish formatter
const fmt = (n) => Number(n).toFixed(2);

// helpers (single definitions)
function updateTipUI(bill, tip, total) {
  if (billEl)  billEl.textContent  = `Bill: $${fmt(bill)}`;
  if (tipEl)   tipEl.textContent   = `Tip: $${fmt(tip)}`;
  if (totalEl) totalEl.textContent = `Total: $${fmt(total)}`;
  if (tipResults) tipResults.classList.add("show");
}
function clearTipUI() {
  if (billEl)  billEl.textContent = "";
  if (tipEl)   tipEl.textContent = "";
  if (totalEl) totalEl.textContent = "";
  if (tipResults) tipResults.classList.remove("show");
}

// A+B, A*B, A-B, A/B
let A = 0;
let operator = null;
let B = null;
let lastBill = null;

function clearAll() {
  A = 0;
  operator = null;
  B = null;
}

for (let i = 0; i < buttonValues.length; i++) {
  const value = buttonValues[i];
  const button = document.createElement("button");
  button.innerText = value;

  // simple styling hooks (optional)
  if (value === "0") {
    button.style.width = "200px";
    button.style.gridColumn = "span 2";
  }
  if (rightSymbols.includes(value)) {
    button.style.backgroundColor = "#ff9500";
  } else if (topSymbols.includes(value)) {
    button.style.backgroundColor = "#d4d4d2";
    button.style.color = "#1c1c1c";
  } else if (bottomSymbols.includes(value)) {
    button.style.backgroundColor = "#7dce82";
    button.style.fontSize = "28px";
  }

  button.addEventListener("click", function () {
    if (rightSymbols.includes(value)) {
      // =, ÷, x, -, +
      if (value === "=") {
        if (operator && display.value !== "") {
          B = display.value;
          const numA = Number(A);
          const numB = Number(B);
          let result;

          switch (operator) {
            case "÷": result = numA / numB; break;
            case "x": result = numA * numB; break;
            case "-": result = numA - numB; break;
            case "+": result = numA + numB; break;
          }

          if (Number.isFinite(result)) {
            display.value = Number.isInteger(result) ? String(result) : result.toFixed(2);
          } else {
            display.value = "Error";
          }
          clearAll();
        }
      } else {
        // picked an operator
        operator = value;
        A = display.value;
        display.value = "";
      }

    } else if (topSymbols.includes(value)) {
      // AC, +/-, %
      if (value === "AC") {
        clearAll();
        display.value = "0";
        lastBill = null;
        clearTipUI();
      } else if (value === "+/-") {
        if (display.value !== "" && display.value !== "0") {
          display.value = display.value[0] === "-" ? display.value.slice(1) : "-" + display.value;
        }
      } else if (value === "%") {
        const n = Number(display.value);
        if (Number.isFinite(n)) display.value = String(n / 100);
      }

    } else if (bottomSymbols.includes(value)) {
      // Tip buttons: 10%, 15%, 20%, 25%
      const raw = display.value.trim();
      if (raw === "" || raw === ".") return;

      const base = Number(raw);
      if (!Number.isFinite(base)) return;

      const pct = Number(value.slice(0, -1)) / 100; // "15%" -> 0.15
      const tip = +(base * pct).toFixed(2);         // make it a number
      const total = +(base + tip).toFixed(2);

      lastBill = base;
      display.value = fmt(tip);      // show the tip in the main display
      updateTipUI(lastBill, tip, total);
      clearAll();

    } else {
      // numbers or "."
      if (value === ".") {
        if (display.value === "" || display.value === "0") {
          display.value = "0.";
        } else if (!display.value.includes(".")) {
          display.value += ".";
        }
      } else {
        // digits
        if (display.value === "0") {
          display.value = value; // avoid leading zeros
        } else {
          display.value += value;
        }
      }
    }
  });

  document.getElementById("buttons").appendChild(button);
}

// PWA service worker registration (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .catch(err => console.error("SW registration failed:", err));
  });
}
