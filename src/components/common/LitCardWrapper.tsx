import * as React from 'react';
import { createComponent } from '@lit/react';
import { MadrassaLitCard } from '../../web-components/lit-card';

// Mapping du composant Web Lit vers un composant classique React
export const LitCard = createComponent({
  tagName: 'madrassa-lit-card',
  elementClass: MadrassaLitCard,
  react: React,
  events: {
    // Le CustomEvent natif 'card-clicked' devient la prop React 'onCardClicked'
    onCardClicked: 'card-clicked',
  },
});
