import React from 'react';
import { DeckType } from '../types';
import { Link } from 'react-router-dom';
import { deleteDeck, updateDeck } from '../api';
import Dialog from 'renderer/components/dialog/Dialog';

type DeckProps = {
  deck: DeckType;
  setDecks: React.Dispatch<React.SetStateAction<DeckType[]>>;
};

function Deck({ deck, setDecks }: DeckProps) {
  const [isOpenEditDeckDialog, setIsOpenEditDeckDialog] = React.useState(false);
  function handleDelete() {
    const refetchQuery = `SELECT * FROM decks`;
    deleteDeck(deck.id, setDecks, refetchQuery);
  }

  const openDialog = () => {
    setIsOpenEditDeckDialog(true);
  };
  const closeDialog = () => {
    setIsOpenEditDeckDialog(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;
    const data = {
      name,
      description,
      tags,
    } as DeckType;
    const refetchQuery = `SELECT * FROM decks`;
    updateDeck<DeckType>(deck.id, data, setDecks, refetchQuery);
    closeDialog();
  };

  return (
    <fieldset>
      <legend>{deck.id}</legend>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={openDialog}>edit</button>
      <h1>
        <Link to={`/deck/${deck.id}/flashcards`}>{deck.name}</Link>
      </h1>
      <p>{deck.description}</p>
      <p>{deck.tags}</p>
      <Dialog open={isOpenEditDeckDialog} onClose={closeDialog}>
        <button onClick={closeDialog}>close</button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" defaultValue={deck.name} />
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            defaultValue={deck.description ?? ''}
          />
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            name="tags"
            id="tags"
            defaultValue={deck.tags ?? ''}
          />
          <button>Save</button>
        </form>
      </Dialog>
    </fieldset>
  );
}

export default Deck;
