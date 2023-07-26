import React from 'react';
import { FlashcardType } from '../types';
import { deleteFlashcard, updateFlashcard } from '../api';
import Dialog from 'renderer/components/dialog/Dialog';

type FlashcardProps = {
  flashcard: FlashcardType;
  setFlashcards: React.Dispatch<React.SetStateAction<FlashcardType[]>>;
};
function Flashcard({ flashcard, setFlashcards }: FlashcardProps) {
  const [isOpenEditFlashcardDialog, setIsOpenEditFlashcardDialog] =
    React.useState(false);

  const openDialog = () => {
    setIsOpenEditFlashcardDialog(true);
  };
  const closeDialog = () => {
    setIsOpenEditFlashcardDialog(false);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;
    const hint = formData.get('hint') as string;
    const tags = formData.get('tags') as string;
    const data = {
      question,
      answer,
      hint,
      tags,
    } as FlashcardType;
    console.log(data);
    const refetchQuery = `SELECT * FROM flashcards WHERE deck_id = ${flashcard.deck_id}`;
    updateFlashcard<FlashcardType>(
      flashcard.id,
      data,
      setFlashcards,
      refetchQuery
    );
    closeDialog();
  };

  const handleDelete = () => {
    const refetchQuery = `SELECT * FROM flashcards WHERE deck_id = ${flashcard.deck_id}`;
    deleteFlashcard(flashcard.id, setFlashcards, refetchQuery);
  };

  return (
    <fieldset key={flashcard.id}>
      <legend>{flashcard.id}</legend>
      <header>
        <button onClick={openDialog}>edit</button>
        <button onClick={handleDelete}>delete</button>
      </header>
      <p>{flashcard.question}</p>
      <p>{flashcard.answer}</p>
      <Dialog open={isOpenEditFlashcardDialog} onClose={closeDialog}>
        <button onClick={closeDialog}>close</button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="question">Question</label>
          <input
            type="text"
            name="question"
            id="question"
            defaultValue={flashcard.question}
          />
          <label htmlFor="answer">Answer</label>
          <input
            type="text"
            name="answer"
            id="answer"
            defaultValue={flashcard.answer}
          />
          <label htmlFor="hint">Hint</label>
          <input
            type="text"
            name="hint"
            id="hint"
            defaultValue={flashcard.hint ?? ''}
          />
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            name="tags"
            id="tags"
            defaultValue={flashcard.tags ?? ''}
          />
          <button>Save</button>
        </form>
      </Dialog>
    </fieldset>
  );
}

export default Flashcard;
