export type DataResponse = {
  data: DeckType[];
};
export type DeckType = {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  tags: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
};
export type DecksListType = {
  decks: DeckType[];
};
