import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('madrassa-lit-card')
export class MadrassaLitCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .card {
      background: var(--card-bg, #ffffff);
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      padding: 20px;
      border: 1px solid var(--card-border, #e2e8f0);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      color: var(--card-text, #1e293b);
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    .dark-mode {
      --card-bg: #1e293b;
      --card-border: #334155;
      --card-text: #f8fafc;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      color: var(--card-text);
    }
    .badge {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: white;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .action-btn {
      margin-top: 16px;
      width: 100%;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      border: 1px solid rgba(99, 102, 241, 0.2);
      padding: 10px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .action-btn:hover {
      background: #6366f1;
      color: white;
    }
    .dark-mode .action-btn {
      background: rgba(129, 140, 248, 0.1);
      color: #818cf8;
      border-color: rgba(129, 140, 248, 0.2);
    }
    .dark-mode .action-btn:hover {
      background: #818cf8;
      color: white;
    }
    .counter {
      font-size: 2rem;
      font-weight: 700;
      margin: 10px 0;
      color: #6366f1;
    }
    .dark-mode .counter {
      color: #818cf8;
    }
  `;

  @property({ type: String }) title = 'Carte Lit Native';
  @property({ type: String }) subtitle = 'Composant Web Standard';
  @property({ type: Boolean }) isDark = false;

  @state() private _clicks = 0;

  private _handleClick() {
    this._clicks++;
    
    // Dispatch d'un événement natif DOM que React pourra écouter
    this.dispatchEvent(new CustomEvent('card-clicked', {
      detail: { clicks: this._clicks, title: this.title },
      bubbles: true,
      composed: true // Permet de traverser le Shadow DOM
    }));
  }

  render() {
    return html`
      <div class="card ${this.isDark ? 'dark-mode' : ''}">
        <div class="header">
          <h3 class="title">${this.title}</h3>
          <span class="badge">New (Lit)</span>
        </div>
        <div style="font-size: 0.875rem; opacity: 0.8; margin-bottom: 12px;">
          ${this.subtitle}
        </div>
        
        <!-- Slot permet d'insérer du contenu HTML/React à l'intérieur du composant -->
        <div style="margin: 16px 0;">
          <slot></slot>
        </div>

        <div class="counter">${this._clicks} clics</div>
        
        <button class="action-btn" @click=${this._handleClick}>
          Tester la réactivité locale
        </button>
      </div>
    `;
  }
}

// Global declaration for TS (HTML elements)
declare global {
  interface HTMLElementTagNameMap {
    'madrassa-lit-card': MadrassaLitCard;
  }
}
