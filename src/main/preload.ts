// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'get-decks'
  | 'get-decks-response'
  | 'create-deck'
  | 'create-deck-response'
  | 'delete-deck'
  | 'delete-deck-response'
  | 'update-deck'
  | 'update-deck-response'
  | 'get-flashcards-by-deckId'
  | 'get-flashcards-by-deckId-response'
  | 'create-flashcard'
  | 'create-flashcard-response'
  | 'delete-flashcard'
  | 'delete-flashcard-response'
  | 'update-flashcard'
  | 'update-flashcard-response';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
