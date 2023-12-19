export interface GameRound {
  id: number;
  score: number;
  listOfAnswers: string[];
}

export interface GameAnswerResult {
  right: boolean;
  alive: boolean;
  score: number;
  round: GameRound;
}

export interface GameParameter {
  score: number;
  parameter: string[];
  alive: boolean;
}

export enum GameParameterType {
  ACTOR = 'ACTOR',
  DIRECTOR = 'DIRECTOR',
  GENRE = 'GENRE',
  KEYWORD = 'KEYWORD',
  IMAGES = 'IMAGES',
  YEARS = 'YEARS',
  RATING = 'RATING',
  COUNTRIES = 'COUNTRIES',
}
