import { useState, useEffect, useRef } from "react"
import { games } from "./games"
import { getFarewellText, getRandomWord } from "./utils"
import { clsx } from "clsx"
import Confetti from "react-confetti"
import { Timer } from "./Timer"

export default function App() {
    // STATE VALUES
    const [randomWord, setRandomWord] = useState(() => getRandomWord())
    const [guessedLetter, setGuessedLetter] = useState([])
    const [timer, setTimer] = useState(60)
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [farewellText, setFarewellText] = useState("")
    const [hasGameStarted, setHasGameStarted] = useState(false)

    // CHECKS THE RANDOM WORD AND GUESSED LETTER
    useEffect(() => {
        console.log("Guessed Letters:", guessedLetter);
        console.log("Random Word:", randomWord);
    }, [guessedLetter, randomWord]);

    // ADDING GUESSED LETTERS & ALPHABET INITIALIZATION
    const addGuessedLetter = letter => {
        if (guessedLetter.includes(letter)) return
        setGuessedLetter(prev => [...prev, letter])
    }
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    // DERIVED VALUES
    const wrongGuessCount = guessedLetter.filter(letter => !randomWord.includes(letter)).length
    const numGuessesLeft = games.length - 1
    const isGameWon = randomWord.split("").every(letter => guessedLetter.includes(letter))
    const isGameLost = wrongGuessCount >= numGuessesLeft || timer === 0
    const isGameOver = isGameWon || isGameLost
    const lastGuess = guessedLetter[guessedLetter.length - 1]
    const isLastGuessWrong = lastGuess && !randomWord.includes(lastGuess)

    // HANDLE WRONG GUESSES EFFECT
    useEffect(() => {
        if (isLastGuessWrong) {
            setFarewellText(getFarewellText(games[wrongGuessCount - 1].name))
        }
    }, [guessedLetter, randomWord, wrongGuessCount, lastGuess])

    // HANDLE TIME UP AND STOP TIMER
    const handleTimeUp = () => setIsTimerActive(false)
    useEffect(() => {
        timer === 0 ? handleTimeUp() : null
    }, [timer])
    
    useEffect(() => {
        isGameOver ? setIsTimerActive(false) : null
    }, [isGameOver])

    // KEYBOARD HANDLING
    const mainRef = useRef(null)
    useEffect(() => {
        const handleKeyDown = event => {
            const { key } = event
            if (alphabet.includes(key.toLowerCase()) && !isGameOver) {
                event.preventDefault()
                addGuessedLetter(key.toLowerCase())
            }
        }

        const mainElement = mainRef.current
        if (mainElement && !isGameOver) {
            mainElement.addEventListener("keydown", handleKeyDown)
            mainElement.focus()
        }

        // CLEANUP FUNCTION
        return () => mainElement ? mainElement.removeEventListener("keydown", handleKeyDown) : null
    }, [isGameOver, guessedLetter, addGuessedLetter])

    // GAMES ELEMENTS
    const gamesEl = games.map((game, index) => {
        const styles = {
            backgroundColor: game.backgroundColor,
            color: game.color
        }

        const className = clsx("chips", {
            lost: wrongGuessCount > index
        })

        return (
            <span 
                className={className}
                key={index}
                style={styles}
            >
                {game.name}
            </span>
        )
    })

    // CURRENT WORD DISPLAY
    const currentWordEl = randomWord.split("").map((letter, index) => {
        const className = clsx("words", {
            gameOver: isGameOver && !guessedLetter.includes(letter)
        })

        return <span key={index} className={className}>{guessedLetter.includes(letter) || isGameOver ? letter.toUpperCase() : ""}</span>
    })

    // KEYBOARD ELEMENTS
    const keyboardEl = alphabet.split("").map((letter, index) => {
        const isGuessed = guessedLetter.includes(letter)
        const isWrong = isGuessed && !randomWord.includes(letter)
        const isCorrect = isGuessed && randomWord.includes(letter)
        const className = clsx({
            wrong: isWrong,
            correct: isCorrect
        })

        return <button 
            className={className}
            onClick={() => addGuessedLetter(letter)} 
            key={index}
            disabled={!hasGameStarted || isGameOver}
            >
                {letter.toUpperCase()}
            </button>
    })

    // GAME STATUS
    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        wrong: isLastGuessWrong,
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessWrong) {
            return <p>{farewellText}</p>
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        }

        if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Hangman 😭</p>
                </>
            )
        }

        return null
    }

    // START GAME
    const startGame = () => {
        setHasGameStarted(true)
        setIsTimerActive(true)
        mainRef.current.focus()
    }

    // NEW GAME
    const newGame = () => {
        setRandomWord(getRandomWord())
        setGuessedLetter([])
        setTimer(60)
        setIsTimerActive(true)
        setFarewellText("")
        setHasGameStarted(true)
        mainRef.current.focus()
    }

    // FOCUS FOR NEW/START GAME
    const startGameRef = useRef(null)
    const newGameRef = useRef(null)
    
    useEffect(() => {
        if (!hasGameStarted) {
            startGameRef.current.focus()
        } else if (isGameOver) {
            newGameRef.current.focus()
        }
    }, [hasGameStarted, isGameOver])

    return (
        <>
        {isGameWon && <Confetti />}
        <main ref={mainRef} tabIndex="0" aria-label="Hangman game main page">
            <header>
                <h1>Hangman: Endgame</h1>
                <p>Guess the word in under 8 attempts to keep the gaming world safe from Hangman!</p>
            </header>
            
            <Timer 
                isActive={isTimerActive}
                timeUp={handleTimeUp}
                timeLeft={timer}
                setTimeLeft={setTimer}
            />
            
            <section className={gameStatusClass}>
                {renderGameStatus()}
            </section>

            <section className="game-chips">
                {gamesEl}
            </section>

            <section className="words-container">
                {currentWordEl}
            </section>

            {/* SCREEN READER SECTION */}
            <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {randomWord.includes(lastGuess) ? 
                        `Correct! The letter ${lastGuess} is in the word.` : 
                        `Sorry, the letter ${lastGuess} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {randomWord.split("").map(letter => 
                guessedLetter.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>

            <section className="keyboard">
                {keyboardEl}
            </section>

            {!hasGameStarted && (
                <button 
                    className="start-game" 
                    onClick={startGame} 
                    ref={startGameRef}
                    aria-label="Start a new Hangman game"
                >
                    Start Game
                </button>
            )}
            {hasGameStarted && isGameOver && (
                <button 
                    className="new-game" 
                    onClick={newGame} 
                    ref={newGameRef}
                    aria-label="Start a new Hangman game"
                >
                    New Game
                </button>
            )}
        </main>
        </>
    )
}