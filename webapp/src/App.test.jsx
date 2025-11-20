import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import App from './App';

describe('Composant Principal (App)', () => {
    it('devrait s\'afficher sans faire planter l\'application', () => {
        render(<App />);
        expect(document.body).toBeDefined();
    });

    it('devrait valider que 1 + 1 = 2', () => {
        expect(1 + 1).toBe(2);
    });
});