import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import ShortenForm from './components/ShortenForm';
import ResultCard from './components/ResultCard';
import UrlTable from './components/UrlTable';
import api from './api';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleShorten = async (formData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await api.post('/shorten', formData);
      setResult(response.data);
      toast.success('URL shortened successfully!');
      // Trigger table reload
      setReloadTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || 'Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Short links, <span className="gradient-text">big results</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            A powerful URL shortener with analytics, custom aliases, and QR codes. Built for performance and reliability.
          </p>
        </div>

        <div className="dashboard-grid">
          <ShortenForm onShorten={handleShorten} isLoading={isLoading} />
          {result && <ResultCard result={result} />}
        </div>

        <UrlTable reloadTrigger={reloadTrigger} />
      </main>
      
      <ToastContainer 
        position="bottom-right" 
        autoClose={4000} 
        theme="dark"
        toastStyle={{ backgroundColor: 'var(--surface)' }}
      />
    </>
  );
}

export default App;
