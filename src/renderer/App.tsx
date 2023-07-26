import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Decks } from './features/decks/routes';
import { Flashcards } from './features/flashcards/routes';
import MainLayout from './components/layouts/main';
export default function App() {
  return (
    <MainLayout>
      <Router>
        <Routes>
          <Route path="/" element={<Decks />} />
          <Route path="/deck/:id/flashcards" element={<Flashcards />} />
        </Routes>
      </Router>
    </MainLayout>
  );
}
