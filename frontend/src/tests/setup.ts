import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Corre un cleanup despues de cada test
afterEach(() => {
  cleanup();
});
