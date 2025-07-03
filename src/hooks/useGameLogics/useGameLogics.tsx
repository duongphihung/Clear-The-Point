import { useEffect, useRef, useState } from "react";
import type { DisappearingMap, PositionsMap } from "../../models/common";


const useGameLogics = () => {
    const [points, setPoints] = useState<number[]>([]);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [positions, setPositions] = useState<PositionsMap>({});
    const [disappearingPoints, setDisappearingPoints] = useState<DisappearingMap>({});
    const [nextPoint, setNextPoint] = useState<number>(1);
    const [totalPoints, setTotalPoints] = useState<number>(10);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const countdownIntervalsRef = useRef<Record<number, number>>({});

    useEffect(() => {
        if (!gameOver && points.length > 0 && gameStarted) {
            const timer = setInterval(() => {
                setTimeElapsed((prev) => parseFloat((prev + 0.1).toFixed(1)));
            }, 100);
            return () => clearInterval(timer);
        }
    }, [gameOver, points, gameStarted]);

    const initializePositions = (count: number) => {
        const newPositions: PositionsMap = {};
        for (let i = 1; i <= count; i++) {
            newPositions[i] = {
                top: Math.random() * 310 + "px",
                left: Math.random() * 310 + "px",
                zIndex: count + 1 - i,
            };
        }
        setPositions(newPositions);
    };

    const startGame = () => {
        const resetPoints = Array.from({ length: totalPoints }, (_, i) => i + 1);
        setPoints(resetPoints);
        setTimeElapsed(0);
        setGameOver(false);
        setDisappearingPoints({});
        setNextPoint(1);
        setGameStarted(true);
        initializePositions(totalPoints);
    };

    const clearPoint = (point: number) => {
        if (point !== nextPoint || gameOver) {
            setGameOver(true);
            return;
        }

        setDisappearingPoints((prev) => ({ ...prev, [point]: 3 }));

        const interval = setInterval(() => {
            setDisappearingPoints((prev) => {
                if (gameOver) {
                    clearInterval(countdownIntervalsRef.current[point]);
                    return prev;
                }

                const currentTime = prev[point];
                const newTime = currentTime - 0.1;

                if (newTime <= 0) {
                    clearInterval(countdownIntervalsRef.current[point]);
                    setPoints((prevPoints) => prevPoints.filter((p) => p !== point));
                    const newState = { ...prev };
                    delete newState[point];
                    return newState;
                }

                return { ...prev, [point]: parseFloat(newTime.toFixed(1)) };
            });
        }, 100);

        countdownIntervalsRef.current[point] = interval;

        setNextPoint((prev) => prev + 1);
    };
    useEffect(() => {
        if (gameOver) {
            Object.values(countdownIntervalsRef.current).forEach(clearInterval);
            countdownIntervalsRef.current = {};
        }
    }, [gameOver]);
    const restartGame = () => {
        setGameStarted(false);
        setPoints([]);
        setTimeElapsed(0);
        setGameOver(false);
        setDisappearingPoints({});
        setNextPoint(1);

        setTimeout(() => {
            startGame();
        }, 0);
    };


    return {
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
    };
}

export default useGameLogics