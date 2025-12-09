const buttonValues = [
  "AC",
  "del","+/-", "%", "÷",
  "7", "8", "9", "x",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "=",
  "10%", "15%", "20%", "25%"
];

const rightSymbols = ["÷", "x", "-", "+", "="];
const topSymbols = ["AC", "del", "+/-", "%"];
const bottomSymbols = ["10%", "15%", "20%", "25%"];

const display = document.getElementById("display");
display.value = "0";

// Tip/Total UI
const billEl = document.getElementById("bill-amount");
const tipEl = document.getElementById("tip-amount");
const totalEl = document.getElementById("total-amount");
const tipResults = document.getElementById("tip-results");

// Expression line UI
const exprEl = document.getElementById("expr-line");
const setExpr = (a, op, b = "") => {
  if (!exprEl) return;
  const left  = a !== "" ? String(+a) : "";
  const right = b !== "" ? String(+b) : "";
  exprEl.textContent = right ? `${left} ${op} ${right}` : `${left} ${op}`;
};
const clearExpr = () => { if (exprEl) exprEl.textContent = ""; };

// Formatter
const fmt = (n) => Number(n).toFixed(2);

// UI helpers
function updateTipUI(bill, tip, total) {
  billEl.textContent  = `Bill: $${fmt(bill)}`;
  tipEl.textContent   = `Tip: $${fmt(tip)}`;
  totalEl.textContent = `Total: $${fmt(total)}`;
  tipResults.classList.add("show");
}
function clearTipUI() {
  billEl.textContent = "";
  tipEl.textContent = "";
  totalEl.textContent = "";
  tipResults.classList.remove("show");
}

// Calculator state
let A = 0;
let operator = null;
let B = null;
let lastBill = null;

function clearAll() {
  A = 0;
  operator = null;
  B = null;
}

// Build buttons
for (let value of buttonValues) {
  const button = document.createElement("button");
  button.innerText = value;

  if (value === "0") {
    button.style.width = "200px";
    button.style.gridColumn = "span 2";
  }

  if (value === "AC") {
    button.style.gridColumn = "1 / -1";
    button.style.width = "100%";
    button.style.fontSize = "28px";
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

    // OPERATORS
    if (rightSymbols.includes(value)) {
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

          display.value = Number.isFinite(result)
            ? Number.isInteger(result) ? String(result) : result.toFixed(2)
            : "Error";

          clearAll();
          clearExpr();
        }

      } else {
        if (operator && display.value !== "") {
          const acc = Number(A);
          const rhs = Number(display.value);
          let interim;

          switch (operator) {
            case "÷": interim = acc / rhs; break;
            case "x": interim = acc * rhs; break;
            case "-": interim = acc - rhs; break;
            case "+": interim = acc + rhs; break;
          }

          A = Number.isFinite(interim)
            ? String(Number.isInteger(interim) ? interim : +interim.toFixed(2))
            : "0";

          setExpr(A, value);
          display.value = "0";
        } else {
          A = display.value;
          setExpr(A, value);
          display.value = "0";
        }

        operator = value;
      }

    // TOP BUTTONS
    } else if (topSymbols.includes(value)) {

      if (value === "AC") {
        clearAll();
        display.value = "0";
        lastBill = null;
        clearTipUI();
        clearExpr();

      } else if (value === "del") {
        if (display.value === "Error") {
          display.value = "0";
          return;
        }

        if (display.value.length > 1) {
          display.value = display.value.slice(0, -1);
          if (
            display.value === "-" ||
            display.value === "" ||
            display.value === "0."
          ) {
            display.value = "0";
          }
        } else {
          display.value = "0";
        }

      } else if (value === "+/-") {
        if (display.value !== "0") {
          display.value = display.value[0] === "-"
            ? display.value.slice(1)
            : "-" + display.value;
        }

      } else if (value === "%") {
        const n = Number(display.value);
        if (Number.isFinite(n)) display.value = String(n / 100);
      }

    // TIP BUTTONS
    } else if (bottomSymbols.includes(value)) {
      const base = Number(display.value);
      if (!Number.isFinite(base)) return;

      const pct = Number(value.slice(0, -1)) / 100;
      const tip = +(base * pct).toFixed(2);
      const total = +(base + tip).toFixed(2);

      lastBill = base;
      display.value = tip.toFixed(2);
      updateTipUI(lastBill, tip, total);
      clearAll();
      clearExpr();

    // NUMBERS & DOT
    } else {
      if (value === ".") {
        if (display.value === "0") {
          display.value = "0.";
        } else if (!display.value.includes(".")) {
          display.value += ".";
        }
      } else {
        if (display.value === "0") {
          display.value = value;
        } else {
          display.value += value;
        }
      }
    }
  });

  document.getElementById("buttons").appendChild(button);
}

// PWA service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .catch(err => console.error("SW registration failed:", err));
  });
}
