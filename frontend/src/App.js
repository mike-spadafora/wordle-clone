import { useEffect, useState } from "react";
import logo from "./logo.svg";
import styled from "styled-components";
import "./App.css";
import { SlotState } from "./SlotState.ts";

function App() {
  const [wordGrid, setWordGrid] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [isGameOver, setisGameOver] = useState(false);
  const [solution, setSolution] = useState("");

  const NUM_GUESSES = 6;
  const WORD_SIZE = 5;

  useEffect(() => {
    function initializeWordGrid() {
      let newWordGrid = [];
      //create the rows (from guesses)
      for (let i = 0; i < NUM_GUESSES; i++) {
        newWordGrid.push([]);
      }

      //initialize empty spots
      for (let i = 0; i < NUM_GUESSES; i++) {
        for (let j = 0; j < WORD_SIZE; j++) {
          newWordGrid[i].push({ letter: "", state: SlotState.EMPTY });
        }
      }

      setWordGrid(newWordGrid);
    }

    function pickWord() {
      setSolution("hello");
    }

    if (wordGrid.length === 0) {
      initializeWordGrid();
      pickWord();
      console.log("hi");
    }
  });

  const handlechange = (e, row, column) => {
    const newWordGrid = [...wordGrid];
    newWordGrid[row][column].letter = e.target.value;
    setWordGrid(newWordGrid);
    setFocusToNextCol(row, column);
  };

  const setFocusToNextCol = (row, col) => {
    if (col !== 4) {
      let getId = row + ":" + (col + 1);
      let cell = document.getElementById(getId);
      cell.focus();
    }
  };

  const setFocusToNextRow = (row) => {
    if (row !== 5) {
      let getId = row + 1 + ":" + 0;
      let cell = document.getElementById(getId);
      cell.focus();
    }
  };

  const isValidGuess = (guess) => {
    for (let i = 0; i < 5; i++) {
      if (guess[i].letter === "") {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    const newWordGrid = [...wordGrid];
    const currentGuess = newWordGrid[currentRow];

    if (isValidGuess(currentGuess)) {
      for (let i = 0; i < currentGuess.length; i++) {
        const currentGuessSlot = currentGuess[i];
        const currentGuessLetter = currentGuessSlot.letter;
        // check letter state
        if (currentGuessLetter === solution[i]) {
          newWordGrid[currentRow][i].state = SlotState.CORRECT;
        } else if (solution.includes(currentGuessLetter)) {
          newWordGrid[currentRow][i].state = SlotState.WRONG_POSITION;
        } else {
          newWordGrid[currentRow][i].state = SlotState.INCORRECT;
        }
      }

      let isCorrect = true;
      for (let i = 0; i < currentGuess.length; i++) {
        if (currentGuess[i].state !== SlotState.CORRECT) {
          isCorrect = false;
          setFocusToNextRow(currentRow);
          setCurrentRow(currentRow + 1);
        }
      }
      setisGameOver(isCorrect);
    }
  };

  const onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      handleSubmit();
    }
  };

  return (
    <Div>
      {wordGrid.map((row, rowIndex) => (
        <RowWrapper key={rowIndex}>
          {row.map((col, colIndex) => (
            <LetterBox
              id={rowIndex + ":" + colIndex}
              status={col.state}
              onChange={(e) => handlechange(e, rowIndex, colIndex)}
              value={wordGrid[rowIndex][colIndex].letter}
              maxLength={1}
              readOnly={currentRow !== rowIndex}
              onKeyPress={enterPressed}
            />
          ))}
        </RowWrapper>
      ))}
      <SubmitButton onClick={handleSubmit} onKeyPress={enterPressed}>
        Submit
      </SubmitButton>
    </Div>
  );
}

const Div = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const RowWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const LetterBox = styled.input`
  font-size: 56px;
  background-color: ${(props) => {
    if (props.status === SlotState.CORRECT) {
      return "green";
    } else if (props.status === SlotState.WRONG_POSITION) {
      return "yellow";
    } else if (props.status === SlotState.INCORRECT) {
      return "grey";
    } else {
      return "#d3d3d3";
    }
  }};
  padding: 8px;
  width: 40px;
  height: 40px;
  type: text
  maxLength: 1;
`;
const SubmitButton = styled.button`
  background-color: #0e2b06;
  font-size: 56px;
  color: white;
`;

export default App;
