import * as React from 'react';
import { createComponent } from '@lit/react';
import { MadrassaAnimatedStat } from '../../web-components/madrassa-animated-stat';

export const LitAnimatedStat = createComponent({
  tagName: 'madrassa-animated-stat',
  elementClass: MadrassaAnimatedStat,
  react: React,
  events: {
    onStatClick: 'stat-click',
  },
});
