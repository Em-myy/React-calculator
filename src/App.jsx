import { useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [secondaryDisplay, setSecondaryDisplay] = useState("");

  return (
    <>
      <div className="first-background">
        <BackgroundComponent
          display={display}
          setDisplay={setDisplay}
          secondaryDisplay={secondaryDisplay}
          setSecondaryDisplay={setSecondaryDisplay}
        />
      </div>
    </>
  );
}

function BackgroundComponent({
  display,
  setDisplay,
  secondaryDisplay,
  setSecondaryDisplay,
}) {
  return (
    <div className="second-background">
      <MainComponent
        display={display}
        setDisplay={setDisplay}
        secondaryDisplay={secondaryDisplay}
        setSecondaryDisplay={setSecondaryDisplay}
      />
    </div>
  );
}

function MainComponent({
  display,
  setDisplay,
  secondaryDisplay,
  setSecondaryDisplay,
}) {
  return (
    <div className="main-component-container">
      <TopComponent
        display={display}
        setDisplay={setDisplay}
        secondaryDisplay={secondaryDisplay}
        setSecondaryDisplay={setSecondaryDisplay}
      />
      <BottomComponent
        display={display}
        setDisplay={setDisplay}
        secondaryDisplay={secondaryDisplay}
        setSecondaryDisplay={setSecondaryDisplay}
      />
    </div>
  );
}

function TopComponent({
  display,
  setDisplay,
  secondaryDisplay,
  setSecondaryDisplay,
}) {
  return (
    <div className="top-component-container">
      <div className="top-component-display secondary-display">
        {secondaryDisplay || "0"}
      </div>
      <div className="top-component-display main-display" id="display">
        {String(display).length > 13 ? "Limit Reached" : display}
      </div>
    </div>
  );
}

function BottomComponent({
  display,
  setDisplay,
  secondaryDisplay,
  setSecondaryDisplay,
}) {
  const LIMIT = 13;

  function handleButtonClick(value) {
    const isOperator = (val) => ["/", "x", "-", "+"].includes(val);

    // Block long inputs
    if (String(display).length > LIMIT && !isOperator(value) && value !== "=") {
      setDisplay("Limit Reached");
      return;
    }

    // AC (Clear)
    if (value === "AC") {
      setDisplay("0");
      setSecondaryDisplay("");
      return;
    }

    // Equals (=)
    if (value === "=") {
      let expression = secondaryDisplay;

      if (!expression || /[+\-x/]$/.test(expression)) return;

      try {
        expression = expression.replace(/x/g, "*").replace(/--/g, "+");
        const result = Function(`return ${expression}`)();
        const rounded =
          Math.round((result + Number.EPSILON) * 1000000) / 1000000;

        setDisplay(rounded.toString());
        setSecondaryDisplay(expression + "=" + rounded);
      } catch {
        setDisplay("Error");
      }
      return;
    }

    // Operators (+, -, x, /)
    if (isOperator(value)) {
      if (secondaryDisplay.includes("=")) {
        setSecondaryDisplay(display + value);
      } else {
        const lastChar = secondaryDisplay.slice(-1);
        const secondLastChar = secondaryDisplay.slice(-2, -1);

        if (isOperator(lastChar)) {
          if (value === "-" && lastChar !== "-") {
            // allow e.g. "5 * -"
            setSecondaryDisplay((prev) => prev + value);
          } else if (
            isOperator(secondLastChar) &&
            lastChar === "-" &&
            value !== "-"
          ) {
            // replace two operators
            setSecondaryDisplay((prev) => prev.slice(0, -2) + value);
          } else {
            // replace last operator
            setSecondaryDisplay((prev) => prev.slice(0, -1) + value);
          }
        } else {
          setSecondaryDisplay((prev) => prev + value);
        }
      }

      setDisplay(value);
      return;
    }

    // Decimal
    if (value === ".") {
      if (display.includes(".")) return;

      if (
        isOperator(display) ||
        display === "0" ||
        secondaryDisplay.includes("=")
      ) {
        setDisplay("0.");
        if (secondaryDisplay.includes("=")) {
          setSecondaryDisplay("0.");
        } else {
          setSecondaryDisplay((prev) => prev + "0.");
        }
      } else {
        setDisplay(display + ".");
        setSecondaryDisplay((prev) => prev + ".");
      }

      return;
    }

    // Number Input
    if (secondaryDisplay.includes("=")) {
      setDisplay(value);
      setSecondaryDisplay(value);
    } else {
      if (display === "0" || isOperator(display)) {
        setDisplay(value);
      } else {
        setDisplay(display + value);
      }
      setSecondaryDisplay((prev) => prev + value);
    }
  }

  const buttons = [
    {
      className: "third-div operators",
      id: "divide",
      label: "/",
    },
    {
      className: "fourth-div operators",
      id: "multiply",
      label: "x",
    },
    {
      className: "fifth-div",
      id: "seven",
      label: "7",
    },
    {
      className: "sixth-div",
      id: "eight",
      label: "8",
    },
    {
      className: "seventh-div",
      id: "nine",
      label: "9",
    },
    {
      className: "eight-div operators operators",
      id: "subtract",
      label: "-",
    },
    {
      className: "ninth-div",
      id: "four",
      label: "4",
    },
    {
      className: "tenth-div",
      id: "five",
      label: "5",
    },
    {
      className: "eleventh-div",
      id: "six",
      label: "6",
    },
    {
      className: "twelve-div operators",
      id: "add",
      label: "+",
    },
    {
      className: "thirteen-div",
      id: "one",
      label: "1",
    },
    {
      className: "fourteen-div",
      id: "two",
      label: "2",
    },
    {
      className: "fifteen-div",
      id: "three",
      label: "3",
    },
    {
      className: "sixteen-div",
      id: "equals",
      label: "=",
    },
    {
      className: "seventeen-div",
      id: "zero",
      label: "0",
    },
    {
      className: "eighteen-div",
      id: "decimal",
      label: ".",
    },
  ];
  return (
    <div className="bottom-component-container">
      <div
        className="bottom-component-button second-div"
        id="clear"
        onClick={() => {
          setDisplay("0");
          setSecondaryDisplay("");
        }}
      >
        AC
      </div>

      {buttons.map((btn, idx) => (
        <div
          key={idx}
          className={`bottom-component-button ${btn.className}`}
          id={btn.id}
          onClick={() => handleButtonClick(btn.label)}
        >
          {btn.label}
        </div>
      ))}
    </div>
  );
}

export default App;
