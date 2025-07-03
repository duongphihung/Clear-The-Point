export type Position = {
    top: string;
    left: string;
    zIndex: number;
};

export type PositionsMap = Record<number, Position>;
export type DisappearingMap = Record<number, number>;