import "./StartScreen.css"
const StartScreen = ({startGame, gameStarted}) => {
  return (
    <div className="start">
      <h1>Secret Word</h1>
      <p>Clique no botão abaixo para começar a jogar</p>
      <button onClick={gameStarted ? null : startGame}>Começar o jogo</button>
    </div>

  )
}

export default StartScreen