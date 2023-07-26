import React from 'react';
import { useParams } from 'react-router-dom';
import { DataResponse, FlashcardType, FlashcardDTO } from '../types';
import { useEffect, useState } from 'react';
import Flashcard from '../components/Flashcard';
import { createFlashcard, fetchFlashcardsByDeckId } from '../api';
import Dialog from 'renderer/components/dialog/Dialog';
function Flashcards() {
  const { id } = useParams();
  console.log(id);
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [isOpenNewFlashcardDialog, setIsOpenNewFlashcardDialog] =
    useState(false);
  useEffect(() => {
    fetchFlashcardsByDeckId<FlashcardType>(Number(id), setFlashcards);
  }, []);

  const openDialog = () => {
    setIsOpenNewFlashcardDialog(true);
  };
  const closeDialog = () => {
    setIsOpenNewFlashcardDialog(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;
    const data = {
      question,
      answer,
      deck_id: Number(id),
      user_id: 2,
      audio: null,
      image: null,
      tags: null,
      hint: null,
      mastery_level: null,
      video: null,
    } as FlashcardDTO;
    console.log(data);
    const refetchQuery = `SELECT * FROM flashcards WHERE deck_id = ${id}`;
    createFlashcard<FlashcardType>(data, setFlashcards, refetchQuery);
    closeDialog();
  };

  return (
    <div>
      <h2>Flashcards | Deck {id}</h2>
      <button onClick={openDialog}>new</button>

      {flashcards.map((flashcard) => (
        <Flashcard
          key={flashcard.id}
          flashcard={flashcard}
          setFlashcards={setFlashcards}
        />
      ))}

      <Dialog open={isOpenNewFlashcardDialog} onClose={closeDialog}>
        <button onClick={closeDialog}>close</button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="question">Question</label>
          <input type="text" name="question" id="question" />
          <label htmlFor="answer">Answer</label>
          <input type="text" name="answer" id="answer" />
          <button>Save</button>
        </form>
      </Dialog>
    </div>
  );
}

export default Flashcards;
