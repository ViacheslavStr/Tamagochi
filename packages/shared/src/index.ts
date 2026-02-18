// Общие типы для фронтенда и бэкенда

export interface ParentProfile {
  id: string;
  name: string;
  photos: string[];
  videos?: string[];
  questionnaire: QuestionnaireAnswers;
}

export interface QuestionnaireAnswers {
  age: number;
  height?: number;
  build?: string;
  ethnicity?: string;
  education?: string;
  interests?: string[];
  personalityTraits?: PersonalityTraits;
}

export interface PersonalityTraits {
  openness: number; // 0-1
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface Child {
  id: string;
  familyId: string;
  birthTimestamp: Date;
  currentAgeStage: AgeStage;
  personalityVector: PersonalityTraits;
  health?: number; // 0-1
  happiness?: number; // 0-1
}

export enum AgeStage {
  INFANT = 'infant', // 0-1 год
  TODDLER = 'toddler', // 1-3 года
  PRESCHOOL = 'preschool', // 3-7 лет
  SCHOOL = 'school', // 7-12 лет
  TEEN = 'teen', // 12+ лет
}

export interface Memory {
  id: string;
  childId: string;
  content: string;
  timestamp: Date;
  embedding?: number[];
}

export interface Event {
  id: string;
  childId: string;
  type: EventType;
  description: string;
  timestamp: Date;
}

export enum EventType {
  FIRST_WORD = 'first_word',
  LEARNED_SKILL = 'learned_skill',
  MILESTONE = 'milestone',
  CALLING_PARENT = 'calling_parent',
}

// WebSocket события
export interface WebSocketEvent {
  type: WebSocketEventType;
  payload: unknown;
}

export enum WebSocketEventType {
  CHILD_CALLING = 'child_calling',
  CHILD_STATE_UPDATE = 'child_state_update',
  EMOTION_CHANGE = 'emotion_change',
}

export interface ChildCallingEvent {
  childId: string;
  message: string;
  emotion: string;
}
