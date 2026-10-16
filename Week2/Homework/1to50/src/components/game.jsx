import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage'; 
import Header from './header';
import Ranking from './ranking';
import FinishModal from './finishModal';

function Game() {
    const [menu, setMenu] = useState('game');
    const [level, setLevel] = useState(1);
    const [nextNumber, setNextNumber] = useState(1);
    const [finished, setFinished] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef(null);

    const [records, setRecords] = useLocalStorage('records', []);

    const [numbers, setNumbers] = useState(() => {
        const initialNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
        return [...initialNumbers].sort(() => Math.random() - 0.5);
    });

    const [nextNumbers, setNextNumbers] = useState(() => {
        const initialNumbers = Array.from({ length: 9 }, (_, i) => i + 10);
        return [...initialNumbers].sort(() => Math.random() - 0.5);
    });

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const interval = setInterval(() => {
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
            setTimer(elapsedTime);
        }, 10);

        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        localStorage.setItem('records', JSON.stringify(records));
    }, [records]);

    const sortedRecords = [...records].sort((a, b) => {
        if (a.level !== b.level) {
            return b.level - a.level;
        }

        return a.timer - b.timer;
    });

    const startGame = (selectedLevel) => {
        const size = selectedLevel + 2;
        const count = size * size;

        const initialNumbers = Array.from(
            { length: count },
            (_, i) => i + 1
        );

        setNumbers(
            [...initialNumbers].sort(() => Math.random() - 0.5)
        );

        const initialNextNumbers = Array.from(
            { length: count },
            (_, i) => i + count + 1
        );

        setNextNumbers(
            [...initialNextNumbers].sort(() => Math.random() - 0.5)
        );

        setNextNumber(1);
        setFinished(false);
        setTimer(0);
        setIsRunning(false);
        startTimeRef.current = null;
    };

    const handleLevel = (selectedLevel) => {
        setLevel(selectedLevel);
        startGame(selectedLevel);
    };

    const handleClick = (number) => {
        const size = level + 2;
        const count = size * size;

        if (number === nextNumber && !finished) {
            if (nextNumber === 1) {
                startTimeRef.current = Date.now();
                setIsRunning(true);
            }

            setNextNumber((prev) => prev + 1);

            const newNumbers = [...numbers];
            const numberIndex = newNumbers.indexOf(number);

            if (nextNumbers.length > 0) {
                newNumbers[numberIndex] = nextNumbers[0];
                setNextNumbers(nextNumbers.slice(1));
            } else {
                newNumbers[numberIndex] = null;
            }

            setNumbers(newNumbers);

            if (nextNumber === count * 2) {
                const finalTime =
                    (Date.now() - startTimeRef.current) / 1000;

                setTimer(finalTime);
                setIsRunning(false);
                setFinished(true);

                const newRecord = {
                    level: level,
                    timer: finalTime,
                    date: new Date().toLocaleString('ko-KR')
                };

                setRecords((prevRecords) => [
                    ...prevRecords,
                    newRecord
                ]);
            }
        }
    };

    const handleRestart = () => {
        startGame(level);
    };

    const clearRecords = () => {
        setRecords([]);
    };

    const count = (level + 2) * (level + 2);
    const totalNumbers = count * 2;

    return (
        <div className="app">
            <Header
                menu={menu}
                setMenu={setMenu}
                level={level}
                handleLevel={handleLevel}
                timer={timer}
            />

            <main className="main-content">
                {menu === 'game' ? (
                    <section className="game-page">
                        <div className="game-info">
                            <h2>Level {level}</h2>
                            <p>
                                다음 숫자: {finished ? '완료!🎉' : nextNumber}
                                {' '}({Math.min(nextNumber, totalNumbers)}/{totalNumbers})
                            </p>
                        </div>

                        <div
                            className="game-board"
                            style={{
                                gridTemplateColumns: `repeat(${level + 2}, 1fr)`
                            }}
                        >
                            {numbers.map((number, index) => (
                                <button
                                    key={index}
                                    className="game-button"
                                    onClick={() => handleClick(number)}
                                    disabled={number === null || finished}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn btn-primary restart-button"
                            onClick={handleRestart}
                        >
                            Restart
                        </button>
                    </section>
                ) : (
                    <Ranking
                        sortedRecords={sortedRecords}
                        clearRecords={clearRecords}
                    />
                )}
            </main>

            {finished && (
                <FinishModal
                    level={level}
                    timer={timer}
                    handleConfirm={handleRestart}
                />
            )}
        </div>
    );
}

export default Game;