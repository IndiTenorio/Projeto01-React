
import './App.css'
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

import { useCallback, useEffect, useState } from 'react'

import { wordsList } from "./data/words"

// Components 
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [gameStarted, setGameStarted] = useState(false);
  const [words] = useState(wordsList)


  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])


  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)


  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * categories.length)]

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  },[words])

  const startGame = useCallback(() => {
    clearLetterStates()
    //pick word and pick category
    const { word, category } = pickWordAndCategory();
    //create an array of letteres 
    let wordletters = word.split("")

    wordletters = wordletters.map((l) => l.toLowerCase())

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordletters)

    // Primeira função
    console.log('aqui')

    setGameStarted(true); // Indicar que o jogo começou
    setGameStage(stages[1].name);
  }, [pickWordAndCategory, gameStarted]);


  const verifyletter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter

      ])


    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)

    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([""])
    setWrongLetters([""])
  }

  //check if guesses ended

  useEffect(() => {
    if (guesses <= 0) {

      clearLetterStates()

      setGameStage(stages[2].name)
    }

  }, [guesses])


  // check win condition
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]

    // win condition 
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => actualScore += 100)

      // restart game with new word 
      // so chame startGame apos 3000 ms
      setTimeout(() => {
        startGame()
      }, 3000)
    }

  }, [guessedLetters, letters, startGame])





  // Para voltar para o inicio do jogo 
  const retry = () => {

    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (

    <div className='container'>
      {gameStage === 'start' && <StartScreen startGame={startGame} gameStarted={gameStarted}/>}
      {gameStage === 'game' && <Game verifyletter={verifyletter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
