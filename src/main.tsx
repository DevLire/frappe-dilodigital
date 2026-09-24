import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'swiper/swiper-bundle.css';
import 'flatpickr/dist/flatpickr.css';
import FrappeFrontend from './FrappeFrontend.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FrappeFrontend />
  </StrictMode>
);
