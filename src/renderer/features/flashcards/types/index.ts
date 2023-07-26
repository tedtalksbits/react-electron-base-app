export type FlashcardType = {
  id: number;
  deck_id: number;
  user_id: number;
  question: string;
  answer: string;
  tags: string | null;
  hint: string | null;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  audio: string | null;
  video: string | null;
  mastery_level: number;
};

export type DataResponse = {
  data: FlashcardType[];
};

export type FlashcardDTO = {
  deck_id: number;
  user_id: number;
  question: string;
  answer: string;
  tags: string | null;
  hint: string | null;
  image: string | null;
  audio: string | null;
  video: string | null;
  mastery_level: number | null;
};
