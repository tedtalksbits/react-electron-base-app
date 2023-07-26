type ResponseData<T> = {
  data: T;
};

/**
 *
 *
 * @param deckId
 * @param setFlashcards- React hook state setter
 * @returns void
 *
 * This function is used to fetch flashcards by deckId.
 * keys: 'get-flashcards-by-deckId' and 'get-flashcards-by-deckId-response'
 *
 *
 */

export function fetchFlashcardsByDeckId<T>(
  deckId: number,
  setFlashcards: React.Dispatch<React.SetStateAction<T[]>>
) {
  window.electron.ipcRenderer.sendMessage(
    'get-flashcards-by-deckId',
    'flashcards',
    deckId
  );
  window.electron.ipcRenderer.once(
    'get-flashcards-by-deckId-response',
    (args) => {
      console.log(args);
      const data = args as ResponseData<T[]>;
      setFlashcards(data.data);
    }
  );
}

/**
 *
 *
 * @param flashcardId
 * @param setFlashcards- React hook state setter
 * @param refetchQuery - string: SQL query to refetch data after mutation
 * @returns void
 * This function is used to delete a flashcard by id.
 * keys: 'delete-flashcard' and 'delete-flashcard-response'
 *
 *
 * */

export function deleteFlashcard<T>(
  flashcardId: number,
  setFlashcards: React.Dispatch<React.SetStateAction<T[]>>,
  refetchQuery: string
) {
  window.electron.ipcRenderer.sendMessage(
    'delete-flashcard',
    flashcardId,
    refetchQuery
  );
  window.electron.ipcRenderer.once('delete-flashcard-response', (args) => {
    console.log(args);
    const data = args as ResponseData<T[]>;
    setFlashcards(data.data);
  });
}

/**
 *
 *
 * @param flashcardId
 * @param data
 * @param setFlashcards- React hook state setter
 * @param refetchQuery - string: SQL query to refetch data after mutation
 * This function is used to update a flashcard by id.
 * keys: 'update-flashcard' and 'update-flashcard-response'
 *
 *
 * */

export function updateFlashcard<T>(
  flashcardId: number,
  data: any,
  setFlashcards: React.Dispatch<React.SetStateAction<T[]>>,
  refetchQuery: string
) {
  window.electron.ipcRenderer.sendMessage(
    'update-flashcard',
    flashcardId,
    data,
    refetchQuery
  );
  window.electron.ipcRenderer.once('update-flashcard-response', (args) => {
    console.log(args);
    const data = args as ResponseData<T[]>;
    setFlashcards(data.data);
  });
}

/**
 *
 *
 * @param data
 * @param setFlashcards- React hook state setter
 * @param refetchQuery - string: SQL query to refetch data after mutation
 * @returns void
 * This function is used to create a flashcard.
 * keys: 'create-flashcard' and 'create-flashcard-response'
 *
 *
 * */

export function createFlashcard<T>(
  data: any,
  setFlashcards: React.Dispatch<React.SetStateAction<T[]>>,
  refetchQuery: string
) {
  window.electron.ipcRenderer.sendMessage(
    'create-flashcard',
    data,
    refetchQuery
  );
  window.electron.ipcRenderer.once('create-flashcard-response', (args) => {
    console.log(args);
    const data = args as ResponseData<T[]>;
    setFlashcards(data.data);
  });
}
