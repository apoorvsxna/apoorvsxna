import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { XMBContainer } from './components/XMBContainer';
import { Editor } from './components/EditorNew';
import initialData from './data/portfolio-data.json';
import './index.css';

function App() {
  const [portfolioData, setPortfolioData] = useState(() => {
    // Try to load from localStorage first (only in dev)
    if (import.meta.env.DEV) {
      const saved = localStorage.getItem('portfolio-data');
      return saved ? JSON.parse(saved) : initialData;
    }
    return initialData;
  });

  const handleSave = (newData) => {
    setPortfolioData(newData);
    localStorage.setItem('portfolio-data', JSON.stringify(newData));
    alert('Data saved successfully!');
  };

  const handlePreview = (data) => {
    setPortfolioData(data);
    window.open('/', '_blank');
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<XMBContainer data={portfolioData} />} />
        {/* Editor only available in development */}
        {import.meta.env.DEV && (
          <Route 
            path="/editor" 
            element={
              <Editor 
                initialData={portfolioData} 
                onSave={handleSave}
                onPreview={handlePreview}
              />
            } 
          />
        )}
        {/* Redirect to home if trying to access editor in production */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
