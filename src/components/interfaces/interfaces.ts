export interface QueryParam {
  name: string;
  value: string | number;
}

export interface DataParam {
  [key: string]: string | number;
}

export interface Car {
  name?: string;
  color?: string;
  id?: number;
}

export interface CarView {
  items: Car[];
  count: number;
}

export interface CarSpeedDistance {
  velocity: number;
  distance: number;
}

export interface RaceStatus {
  status: Boolean;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface RaceWinner {
  id: number;
  wins: number;
  time: number;
  name?: string;
}

export interface WinnerView {
  items: Winner[];
  count: number;
}

export default QueryParam;
