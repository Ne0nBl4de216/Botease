import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BotManagement } from './pages/BotManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bot-management" element={<BotManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;