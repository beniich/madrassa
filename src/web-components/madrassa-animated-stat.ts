import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('madrassa-animated-stat')
export class MadrassaAnimatedStat extends LitElement {
  @property({ type: String }) title = 'Statistique';
  @property({ type: Number }) value = 0;
  @property({ type: String }) icon = '📊';
  @property({ type: String }) trend = 'up'; // up, down, neutral
  @property({ type: String }) trendValue = '+0%';

  static styles = css`
    :host {
      display: block;
      --card-bg: rgba(255, 255, 255, 0.05);
      --card-border: rgba(255, 255, 255, 0.1);
      --text-main: #ffffff;
      --text-muted: #9ca3af;
      --trend-up: #10b981;
      --trend-down: #ef4444;
      --trend-neutral: #6b7280;
    }

    .stat-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    .stat-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .stat-container:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .stat-container:hover::before {
      opacity: 1;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      position: relative;
      z-index: 1;
    }

    .title {
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .icon-container {
      background: rgba(255, 255, 255, 0.1);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      font-size: 1.25rem;
    }

    .value {
      color: var(--text-main);
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 0.5rem;
      position: relative;
      z-index: 1;
      background: linear-gradient(to right, #fff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .trend {
      display: inline-flex;
      align-items: center;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      position: relative;
      z-index: 1;
    }

    .trend.up {
      background: rgba(16, 185, 129, 0.1);
      color: var(--trend-up);
    }

    .trend.down {
      background: rgba(239, 68, 68, 0.1);
      color: var(--trend-down);
    }

    .trend.neutral {
      background: rgba(107, 114, 128, 0.1);
      color: var(--trend-neutral);
    }

    .glow {
      position: absolute;
      width: 100px;
      height: 100px;
      background: white;
      filter: blur(50px);
      opacity: 0;
      border-radius: 50%;
      top: -50px;
      right: -50px;
      transition: opacity 0.5s;
      pointer-events: none;
    }

    .stat-container:hover .glow {
      opacity: 0.1;
    }
  `;

  render() {
    return html`
      <div class="stat-container" @click="${this._handleClick}">
        <div class="glow"></div>
        <div class="header">
          <span class="title">${this.title}</span>
          <div class="icon-container">${this.icon}</div>
        </div>
        <div class="value">${this.value}</div>
        <div class="trend ${this.trend}">
          ${this.trend === 'up' ? '↗' : this.trend === 'down' ? '↘' : '→'}
          ${this.trendValue}
        </div>
      </div>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('stat-click', {
      detail: { title: this.title, value: this.value },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'madrassa-animated-stat': MadrassaAnimatedStat;
  }
}
