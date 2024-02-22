//CSS
import "./App.css";

//REACT
import { useCallback, useEffect, useState } from "react";

//DATA ver
import {wordsList} from './data/words'

//COMPONENTES
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(50);

  const pickWordAndCategory = () => {
    //pega uma categoria aleatoria
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];

    //pega uma palavra aleatoria de uma categoria
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  };

  //começa o jogo
  const startGame = () => {
    //escolhe uma palavra e uma categoria
    const { word, category } = pickWordAndCategory();

    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //configura estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    //cria um array que contém todas as letras da palavra escolhida
    setGameStage(stages[1].name);
  };

  //processa a letra
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //chegcar se a letra já foi usada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //guardar letra adivinhada ou diminuir uma chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((atualGuessed) => [
        ...atualGuessed, 
        normalizedLetter
      ]);
    } else {
      setWrongLetters((atualWrong) => [
        ...atualWrong, 
        normalizedLetter
      ]);

      setGuesses(atualGuesses => atualGuesses - 1);
    }

  };

  function clearLetterStates(){
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //verifica as tentativas restantes
  useEffect(()=>{
    if(guesses <= 0){

      //resetar todos os estados
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //verifica condição de vitória
  useEffect(()=>{},[]);

  //recomeça o jogo
  const retry = () => {
    setScore(0);
    setGuesses(3);

    setGameStage(stages[0].name);
  };
  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
