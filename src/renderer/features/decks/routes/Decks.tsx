import { useEffect, useState } from 'react';
import { DeckType } from '../types';
import { createDeck, fetchDecks } from '../api';
import Deck from '../components/Deck';
import Dialog from 'renderer/components/dialog/Dialog';

function Decks() {
  const [decks, setDecks] = useState<DeckType[]>([]);
  useEffect(() => {
    fetchDecks<DeckType>(setDecks);
  }, []);

  const [isOpenDeckDialog, setIsOpenDeckDialog] = useState(false);

  const openDialog = () => {
    setIsOpenDeckDialog(true);
  };
  const closeDialog = () => {
    setIsOpenDeckDialog(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const data = {
      name,
      description,
      user_id: 2,
      tags: null,
    } as DeckType;
    const refetchQuery = `SELECT * FROM decks`;
    createDeck<DeckType>(data, setDecks, refetchQuery);
    closeDialog();
  };

  return (
    <div>
      <button onClick={openDialog}>new</button>
      <div>
        <h1>Decks List</h1>
        {decks.map((deck) => (
          <Deck key={deck.id} deck={deck} setDecks={setDecks} />
        ))}
      </div>
      <Dialog open={isOpenDeckDialog} onClose={closeDialog}>
        <button onClick={closeDialog}>close</button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">name</label>
          <input type="text" name="name" id="name" />
          <label htmlFor="description">description</label>
          <input type="text" name="description" id="description" />
          <button>Save</button>
        </form>
      </Dialog>
    </div>
  );
}

export default Decks;
