import type { DisappearingMap, PositionsMap } from "../../models/common";

type Props = {
    point: number;
    positions: PositionsMap;
    disappearingPoints: DisappearingMap;
    clearPoint: (point: number) => void;
    gameOver: boolean;
}
const Point = ({ point, positions, disappearingPoints, clearPoint, gameOver }: Props) => {
    return (
        <>
            <button
                key={point}
                onClick={() => clearPoint(point)}
                className={`absolute point transition-all duration-100 ${disappearingPoints[point] && !gameOver ? 'disappearing' : ''
                    }`}
                style={{
                    top: positions[point]?.top,
                    left: positions[point]?.left,
                    zIndex: positions[point]?.zIndex,
                }}
            >
                <span className={`text-lg font-medium`}>
                    {point}
                </span>
                {disappearingPoints[point] ? (
                    <span className="countdown text-sm block pb-1">
                        {disappearingPoints[point].toFixed(1)}s
                    </span>
                ) : null}
            </button>
        </>
    )
}

export default Point