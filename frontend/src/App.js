import { useEffect, useState } from "react";
import logo from "./logo.svg";
import styled from "styled-components";
import "./App.css";
import axios from "axios";
import { SlotState } from "./SlotState.ts";

function App() {
  const [wordGrid, setWordGrid] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [isGameOver, setisGameOver] = useState(false);
  const [solution, setSolution] = useState("");

  const NUM_GUESSES = 6;
  const WORD_SIZE = 5;

  useEffect(() => {
    /**
     * create a WORD_SIZE by NUM_GUESSES sized grid
     */
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

    /**
     * chooses the solution word. This should be altered to call the django server.
     */
    function pickWord() {
      axios
        .get("http://localhost:8000/word")
        .then((res) => {
          setSolution(res.data.toString());
          console.log("solution:" + res.data.toString());
        })
        .catch((err) => console.log(err));
    }

    /**
     * start the game. initialize grid and pick the solution word.
     */
    if (wordGrid.length === 0) {
      initializeWordGrid();
      pickWord();
    }
  });

  /**
   * this is called whenever a user types in one of the boxes
   * @param {*} e the change event
   * @param {int} row the current row (or word within the grid)
   * @param {int} column the current column (letter within the word)
   */
  const handlechange = (e, row, column) => {
    const newWordGrid = [...wordGrid];
    newWordGrid[row][column].letter = e.target.value;
    setWordGrid(newWordGrid);
    setFocusToNextCol(row, column);
  };

  /**
   * This is called whenever a user types a single letter, in order to
   * shift the focus to the next box to the right
   * @param {*} row the current row
   * @param {*} col the current col
   */
  const setFocusToNextCol = (row, col) => {
    if (col !== 4) {
      let getId = row + ":" + (col + 1);
      let cell = document.getElementById(getId);
      cell.focus();
    }
  };

  /**
   * this is called when a guess is successfully submitted
   * @param {*} row the current row
   */
  const setFocusToNextRow = (row) => {
    if (row !== 5) {
      let getId = row + 1 + ":" + 0;
      let cell = document.getElementById(getId);
      cell.focus();
    }
  };

  /**
   * validates the guess has 5 letters
   * @param {Array[ {char, SlotState }]} guess The guess that was submitted
   * @returns true if guess is valid, false if not
   */
  const isValidGuess = async (guess) => {
    let guessString = "";

    //validate exactly 5 letters
    for (let i = 0; i < 5; i++) {
      if (guess[i].letter === "") {
        return false;
      }
      guessString += guess[i].letter;
    }

    return await djangoValidate(guessString);
  };

  const djangoValidate = async (guessString) => {
    const params = new URLSearchParams();
    params.append("word", guessString);

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const res = await axios.post(
      "http://localhost:8000/validate/",
      params,
      config
    );

    return res.data;
  };

  /**
   * handles submit logic:
   * checks if guess is valid, then checks letter by letter of guess.
   * finally, checks if game is over, and moves cursor to next row if not
   */
  const handleSubmit = async () => {
    const newWordGrid = [...wordGrid];
    const currentGuess = newWordGrid[currentRow];

    if (await isValidGuess(currentGuess)) {
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

  /**
   * submits if enter is pressed
   * @param {*} event the keypress event
   */
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

/**
 * stores a set of rows
 */
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

/**
 * individual box for letters, which changes color based on game state
 */
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
