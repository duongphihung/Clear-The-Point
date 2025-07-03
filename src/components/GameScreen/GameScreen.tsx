import './GameScreen.css';
import useGameLogics from '../../hooks/useGameLogics/useGameLogics';
import { FaPlay, FaStop } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Point from '../Point/Point';

const GameScreen = () => {
    const {
        points,
        timeElapsed,
        gameOver,
        positions,
        disappearingPoints,
        nextPoint,
        totalPoints,
        gameStarted,
        startGame,
        clearPoint,
        restartGame,
        setTotalPoints
    } = useGameLogics();

    const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (isAutoPlaying && gameStarted && !gameOver && points.length > 0) {
            const delay = 800;
            const timer = setTimeout(() => {
                clearPoint(nextPoint);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [isAutoPlaying, nextPoint, gameStarted, gameOver, points]);

    useEffect(() => {
        if (gameOver || points.length === 0) {
            setIsAutoPlaying(false);
        }
    }, [gameOver, points]);

    return (
        <div className="flex items-center justify-center text-black">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-start">
                    <h1
                        className={`
                            text-2xl font-bold mb-4 
                            ${!gameStarted ? 'text-black' : ''}
                            ${gameStarted && !gameOver && points.length > 0 ? 'text-black' : ''}
                            ${gameStarted && points.length === 0 ? 'text-green-500' : ''}
                            ${gameOver && points.length > 0 ? 'text-red-500' : ''}
                        `}
                    >
                        {!gameStarted && "LET'S PLAY"}
                        {gameStarted && !gameOver && points.length > 0 && "LET'S PLAY"}
                        {gameStarted && points.length === 0 && "ALL CLEARED!"}
                        {gameOver && points.length > 0 && "GAME OVER"}
                    </h1>
                    <div className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                            <label htmlFor="pointCount">Points:</label>
                            <input
                                id="pointCount"
                                type="number"
                                min={1}
                                max={100}
                                value={totalPoints}
                                disabled={gameStarted}
                                onChange={(e) => setTotalPoints(Number(e.target.value))}
                                className="border border-gray-500 rounded p-1 w-20"
                            />
                        </div>
                        <p>Time: {timeElapsed.toFixed(1)}s</p>
                        {/* {gameStarted && (
                            <p>Next: <span className="font-bold text-blue-500">{nextPoint}</span></p>
                        )} */}
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={gameStarted ? restartGame : startGame}
                            className={`${gameStarted ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'
                                } text-white rounded px-3 py-1`}
                        >
                            {gameStarted ? 'Reset' : 'Start Game'}
                        </button>

                        <button
                            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            className="bg-yellow-500 text-white rounded hover:bg-yellow-700 px-3 py-1 cursor-pointer gap-2 flex items-center"
                        >
                            Auto Play
                            {isAutoPlaying ? <FaStop /> : <FaPlay />}
                        </button>
                    </div>
                </div>

                <div className="game-container relative w-[360px] h-[360px] bg-gray-200 mt-4 rounded-md overflow-hidden">
                    {points.map((point) => (
                        <Point
                            key={point}
                            point={point}
                            positions={positions}
                            disappearingPoints={disappearingPoints}
                            clearPoint={clearPoint}
                            gameOver={gameOver}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameScreen;
