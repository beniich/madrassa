// @ts-nocheck
// src/pages/SlideEditor.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import * as fabric from 'fabric';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Plus, Trash2, Copy, ChevronLeft, ChevronRight,
  Type, Square, Circle, Image as ImageIcon, Download,
  AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Minus,
  Palette, Layout, Play, Save, Undo, Redo,
  Triangle, Star, ArrowRight, Eye, EyeOff,
  ChevronUp, ChevronDown, Layers, Grid,
  ZoomIn, ZoomOut, RotateCcw, RotateCw,
  Presentation, FileDown, Share2, Settings2
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────── */
interface Slide {
  id: string;
  name: string;
  canvasJson: string | null;
  thumbnail: string | null;
  background: string;
  transition: string;
}

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fill: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: string;
}

/* ─── Constants ─────────────────────────────────────────── */
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;

const THEMES = [
  { name: 'Midnight Blue', bg: '#0f172a', accent: '#6366f1', text: '#f8fafc' },
  { name: 'Emerald Dark', bg: '#064e3b', accent: '#10b981', text: '#ecfdf5' },
  { name: 'Crimson', bg: '#7f1d1d', accent: '#ef4444', text: '#fef2f2' },
  { name: 'Purple Dreams', bg: '#2e1065', accent: '#a855f7', text: '#faf5ff' },
  { name: 'Ocean', bg: '#0c4a6e', accent: '#0ea5e9', text: '#f0f9ff' },
  { name: 'White Clean', bg: '#ffffff', accent: '#3b82f6', text: '#1e293b' },
  { name: 'Warm Sand', bg: '#fef9f0', accent: '#f59e0b', text: '#451a03' },
  { name: 'Forest', bg: '#1a2e1a', accent: '#22c55e', text: '#f0fdf4' },
];

const TEMPLATES = [
  {
    name: 'Titre Principal',
    elements: [
      { type: 'textbox', text: 'Titre de la Présentation', left: 120, top: 130, width: 720, fontSize: 52, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Inter' },
      { type: 'textbox', text: 'Sous-titre — Madrassa App', left: 120, top: 220, width: 720, fontSize: 28, fill: '#94a3b8', fontFamily: 'Inter' },
      { type: 'line', x1: 120, y1: 310, x2: 840, y2: 310, stroke: '#6366f1', strokeWidth: 2 },
      { type: 'textbox', text: 'Date · Auteur', left: 120, top: 330, width: 400, fontSize: 18, fill: '#64748b', fontFamily: 'Inter' },
    ]
  },
  {
    name: 'Titre + Contenu',
    elements: [
      { type: 'textbox', text: 'Titre de la Slide', left: 60, top: 40, width: 840, fontSize: 38, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Inter' },
      { type: 'line', x1: 60, y1: 100, x2: 900, y2: 100, stroke: '#6366f1', strokeWidth: 2 },
      { type: 'textbox', text: '• Premier point important\n• Deuxième point clé\n• Troisième élément\n• Quatrième détail', left: 60, top: 120, width: 840, fontSize: 24, fill: '#cbd5e1', fontFamily: 'Inter' },
    ]
  },
  {
    name: 'Deux Colonnes',
    elements: [
      { type: 'textbox', text: 'Titre Principal', left: 60, top: 30, width: 840, fontSize: 38, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Inter' },
      { type: 'rect', left: 60, top: 110, width: 400, height: 380, fill: 'rgba(99,102,241,0.15)', rx: 12 },
      { type: 'rect', left: 500, top: 110, width: 400, height: 380, fill: 'rgba(99,102,241,0.15)', rx: 12 },
      { type: 'textbox', text: 'Colonne Gauche\n\n• Point 1\n• Point 2\n• Point 3', left: 80, top: 130, width: 360, fontSize: 20, fill: '#cbd5e1', fontFamily: 'Inter' },
      { type: 'textbox', text: 'Colonne Droite\n\n• Point 4\n• Point 5\n• Point 6', left: 520, top: 130, width: 360, fontSize: 20, fill: '#cbd5e1', fontFamily: 'Inter' },
    ]
  },
  {
    name: 'Citation',
    elements: [
      { type: 'textbox', text: '"L\'éducation est l\'arme la plus puissante que vous puissiez utiliser pour changer le monde."', left: 100, top: 120, width: 760, fontSize: 32, fontStyle: 'italic', fill: '#ffffff', fontFamily: 'Georgia', textAlign: 'center' },
      { type: 'textbox', text: '— Nelson Mandela', left: 100, top: 360, width: 760, fontSize: 22, fill: '#94a3b8', fontFamily: 'Inter', textAlign: 'center' },
    ]
  },
];

const FONTS = ['Inter', 'Georgia', 'Arial', 'Roboto', 'Poppins', 'Times New Roman', 'Courier New', 'Verdana'];

/* ─── Helper ─────────────────────────────────────────────── */
const createSlide = (name = 'Slide'): Slide => ({
  id: crypto.randomUUID(),
  name,
  canvasJson: null,
  thumbnail: null,
  background: '#0f172a',
  transition: 'fade',
});

/* ═══════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function SlideEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [slides, setSlides] = useState<Slide[]>([createSlide('Slide 1')]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedObj, setSelectedObj] = useState<fabric.Object | null>(null);
  const [textStyle, setTextStyle] = useState<TextStyle>({ fontSize: 24, fontFamily: 'Inter', fill: '#ffffff', bold: false, italic: false, underline: false, align: 'left' });
  const [showTemplates, setShowTemplates] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showPresent, setShowPresent] = useState(false);
  const [presentIdx, setPresentIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'insert' | 'design' | 'animate'>('insert');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [title, setTitle] = useState('Ma Présentation');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const slidesJson = useRef<Record<string, string | null>>({});
  const thumbnails = useRef<Record<string, string | null>>({});

  /* ── Init canvas ── */
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: bgColor,
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    canvas.on('selection:created', (e) => setSelectedObj(e.selected?.[0] ?? null));
    canvas.on('selection:updated', (e) => setSelectedObj(e.selected?.[0] ?? null));
    canvas.on('selection:cleared', () => setSelectedObj(null));
    canvas.on('object:modified', () => saveHistory());
    canvas.on('object:added', () => saveHistory());

    // Add welcome text
    const welcomeText = new fabric.Textbox('Titre de la Présentation', {
      left: 120, top: 130, width: 720, fontSize: 52, fontWeight: 'bold',
      fill: '#ffffff', fontFamily: 'Inter', textAlign: 'center',
    });
    const subText = new fabric.Textbox('Cliquez pour modifier · Double-cliquez pour éditer', {
      left: 120, top: 220, width: 720, fontSize: 24,
      fill: '#94a3b8', fontFamily: 'Inter', textAlign: 'center',
    });
    canvas.add(welcomeText, subText);
    canvas.renderAll();
    saveHistory();

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newH = [...prev.slice(0, historyIdx + 1), json];
      setHistoryIdx(newH.length - 1);
      return newH;
    });
  }, [historyIdx]);

  /* ── Save/Load slide ── */
  const saveCurrentSlide = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    const thumb = canvas.toDataURL({ format: 'jpeg', quality: 0.3, multiplier: 0.3 });
    slidesJson.current[slides[currentIdx].id] = json;
    thumbnails.current[slides[currentIdx].id] = thumb;
    setSlides(prev => prev.map((s, i) => i === currentIdx ? { ...s, canvasJson: json, thumbnail: thumb, background: bgColor } : s));
  }, [slides, currentIdx, bgColor]);

  const loadSlide = useCallback((idx: number, slideList?: Slide[]) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const list = slideList ?? slides;
    const slide = list[idx];
    const json = slidesJson.current[slide.id];
    canvas.clear();
    canvas.backgroundColor = slide.background;
    setBgColor(slide.background);
    if (json) {
      canvas.loadFromJSON(json, () => {
        canvas.renderAll();
      });
    } else {
      canvas.renderAll();
    }
  }, [slides]);

  const switchSlide = useCallback(async (newIdx: number) => {
    await saveCurrentSlide();
    setCurrentIdx(newIdx);
    loadSlide(newIdx);
    setSelectedObj(null);
  }, [saveCurrentSlide, loadSlide]);

  /* ── Insert elements ── */
  const addText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const t = new fabric.Textbox('Double-cliquez pour éditer', {
      left: 100, top: 150, width: 400, fontSize: 28, fill: '#ffffff',
      fontFamily: 'Inter', editable: true,
    });
    canvas.add(t);
    canvas.setActiveObject(t);
    canvas.renderAll();
  };

  const addShape = (type: 'rect' | 'circle' | 'triangle' | 'line') => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    let shape: fabric.Object;
    const opts = { left: 200, top: 160, fill: '#6366f1', opacity: 0.85 };
    if (type === 'rect') shape = new fabric.Rect({ ...opts, width: 200, height: 120, rx: 10 });
    else if (type === 'circle') shape = new fabric.Circle({ ...opts, radius: 80 });
    else if (type === 'triangle') shape = new fabric.Triangle({ ...opts, width: 180, height: 160 });
    else shape = new fabric.Line([100, 270, 500, 270], { stroke: '#6366f1', strokeWidth: 3, left: 100, top: 260 });
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        fabric.Image.fromURL(url, (img) => {
          img.scaleToWidth(300);
          img.set({ left: 180, top: 120 });
          fabricRef.current?.add(img);
          fabricRef.current?.setActiveObject(img);
          fabricRef.current?.renderAll();
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  /* ── Apply template ── */
  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = bgColor;
    tpl.elements.forEach((el: Record<string, unknown>) => {
      if (el.type === 'textbox') {
        canvas.add(new fabric.Textbox(el.text as string, {
          left: el.left as number, top: el.top as number, width: el.width as number,
          fontSize: el.fontSize as number, fontWeight: el.fontWeight as string,
          fontStyle: el.fontStyle as string, fill: el.fill as string,
          fontFamily: el.fontFamily as string, textAlign: el.textAlign as string,
          editable: true,
        }));
      } else if (el.type === 'rect') {
        canvas.add(new fabric.Rect({
          left: el.left as number, top: el.top as number,
          width: el.width as number, height: el.height as number,
          fill: el.fill as string, rx: el.rx as number ?? 0,
        }));
      } else if (el.type === 'line') {
        canvas.add(new fabric.Line([el.x1 as number, el.y1 as number, el.x2 as number, el.y2 as number], {
          stroke: el.stroke as string, strokeWidth: el.strokeWidth as number,
          left: el.x1 as number, top: el.y1 as number,
        }));
      }
    });
    canvas.renderAll();
    setShowTemplates(false);
    saveHistory();
  };

  /* ── Apply theme ── */
  const applyTheme = (theme: typeof THEMES[0]) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.backgroundColor = theme.bg;
    setBgColor(theme.bg);
    canvas.getObjects('textbox').forEach((obj) => {
      (obj as fabric.Textbox).set('fill', theme.text);
    });
    canvas.renderAll();
    setShowThemes(false);
    saveHistory();
  };

  /* ── Text formatting ── */
  const applyTextProp = (prop: Partial<fabric.ITextboxOptions & { fill: string }>) => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj || !(obj instanceof fabric.Textbox)) return;
    obj.set(prop as fabric.ITextboxOptions);
    canvas?.renderAll();
    setTextStyle(prev => ({ ...prev, ...prop as Partial<TextStyle> }));
  };

  /* ── Delete selected ── */
  const deleteSelected = () => {
    const canvas = fabricRef.current;
    const objs = canvas?.getActiveObjects();
    if (!objs?.length) return;
    objs.forEach(o => canvas?.remove(o));
    canvas?.discardActiveObject();
    canvas?.renderAll();
    saveHistory();
  };

  /* ── Duplicate selected ── */
  const duplicateSelected = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj) return;
    obj.clone((cloned: fabric.Object) => {
      cloned.set({ left: (obj.left ?? 0) + 20, top: (obj.top ?? 0) + 20 });
      canvas?.add(cloned);
      canvas?.setActiveObject(cloned);
      canvas?.renderAll();
    });
  };

  /* ── Z-order ── */
  const bringForward = () => { const o = fabricRef.current?.getActiveObject(); if (o) { fabricRef.current?.bringForward(o); fabricRef.current?.renderAll(); } };
  const sendBackward = () => { const o = fabricRef.current?.getActiveObject(); if (o) { fabricRef.current?.sendBackwards(o); fabricRef.current?.renderAll(); } };

  /* ── Undo / Redo ── */
  const undo = () => {
    if (historyIdx <= 0) return;
    const newIdx = historyIdx - 1;
    setHistoryIdx(newIdx);
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.loadFromJSON(history[newIdx], () => canvas.renderAll());
  };

  const redo = () => {
    if (historyIdx >= history.length - 1) return;
    const newIdx = historyIdx + 1;
    setHistoryIdx(newIdx);
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.loadFromJSON(history[newIdx], () => canvas.renderAll());
  };

  /* ── Add slide ── */
  const addSlide = async () => {
    await saveCurrentSlide();
    const newSlide = createSlide(`Slide ${slides.length + 1}`);
    const newList = [...slides, newSlide];
    setSlides(newList);
    const newIdx = newList.length - 1;
    setCurrentIdx(newIdx);
    loadSlide(newIdx, newList);
  };

  /* ── Delete slide ── */
  const deleteSlide = async (idx: number) => {
    if (slides.length === 1) return;
    delete slidesJson.current[slides[idx].id];
    delete thumbnails.current[slides[idx].id];
    const newSlides = slides.filter((_, i) => i !== idx);
    setSlides(newSlides);
    const newIdx = Math.min(idx, newSlides.length - 1);
    setCurrentIdx(newIdx);
    loadSlide(newIdx, newSlides);
  };

  /* ── Duplicate slide ── */
  const duplicateSlide = async (idx: number) => {
    await saveCurrentSlide();
    const src = slides[idx];
    const newSlide: Slide = { ...createSlide(`${src.name} (copie)`), background: src.background };
    const srcJson = slidesJson.current[src.id];
    if (srcJson) slidesJson.current[newSlide.id] = srcJson;
    const newSlides = [...slides.slice(0, idx + 1), newSlide, ...slides.slice(idx + 1)];
    setSlides(newSlides);
    const newIdx = idx + 1;
    setCurrentIdx(newIdx);
    loadSlide(newIdx, newSlides);
  };

  /* ── Export PDF ── */
  const exportPDF = async () => {
    await saveCurrentSlide();
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CANVAS_WIDTH, CANVAS_HEIGHT] });
    for (let i = 0; i < slides.length; i++) {
      const canvas = fabricRef.current;
      if (!canvas) continue;
      if (i > 0) {
        const prevJson = slidesJson.current[slides[i - 1].id];
        if (prevJson) await new Promise<void>(r => { canvas.loadFromJSON(prevJson, () => { canvas.renderAll(); r(); }); });
      }
      const json = slidesJson.current[slides[i].id];
      if (json) await new Promise<void>(r => { canvas.loadFromJSON(json, () => { canvas.renderAll(); r(); }); });
      const dataUrl = canvas.toDataURL({ format: 'jpeg', quality: 0.9 });
      if (i > 0) pdf.addPage();
      pdf.addImage(dataUrl, 'JPEG', 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    pdf.save(`${title}.pdf`);
    loadSlide(currentIdx);
  };

  /* ── Export PNG ── */
  const exportPNG = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `slide-${currentIdx + 1}.png`;
    link.href = canvas.toDataURL({ format: 'png', quality: 1 });
    link.click();
  };

  /* ── Present mode ── */
  const startPresent = async () => {
    await saveCurrentSlide();
    setPresentIdx(0);
    setShowPresent(true);
  };

  /* ── Background change ── */
  const changeBackground = (color: string) => {
    setBgColor(color);
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.backgroundColor = color;
    canvas.renderAll();
    setSlides(prev => prev.map((s, i) => i === currentIdx ? { ...s, background: color } : s));
  };

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="slide-editor-root" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a14', color: '#f0f0ff', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

      {/* ── TOP BAR ── */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', height: 56, background: 'rgba(15,15,30,0.98)', borderBottom: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 2px 20px rgba(0,0,0,0.5)', zIndex: 50, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
          <Presentation size={22} style={{ color: '#6366f1' }} />
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f0f0ff', fontSize: 15, fontWeight: 600, width: 200 }}
          />
        </div>

        {/* History */}
        <div style={{ display: 'flex', gap: 4 }}>
          <TopBtn onClick={undo} title="Cancel (Ctrl+Z)" disabled={historyIdx <= 0}><Undo size={15} /></TopBtn>
          <TopBtn onClick={redo} title="Refaire (Ctrl+Y)" disabled={historyIdx >= history.length - 1}><Redo size={15} /></TopBtn>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

        {/* Templates & Themes */}
        <TopBtn onClick={() => { setShowTemplates(!showTemplates); setShowThemes(false); }}><Layout size={15} /> Templates</TopBtn>
        <TopBtn onClick={() => { setShowThemes(!showThemes); setShowTemplates(false); }}><Palette size={15} /> Thèmes</TopBtn>

        <div style={{ flex: 1 }} />

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TopBtn onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}><ZoomOut size={14} /></TopBtn>
          <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <TopBtn onClick={() => setZoom(z => Math.min(2, z + 0.1))}><ZoomIn size={14} /></TopBtn>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

        {/* Export */}
        <TopBtn onClick={exportPNG} title="Export PNG"><FileDown size={15} /> PNG</TopBtn>
        <TopBtn onClick={exportPDF} title="Export PDF"><Download size={15} /> PDF</TopBtn>

        {/* Present */}
        <button onClick={startPresent} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Play size={14} /> Présenter
        </button>
      </header>

      {/* ── DROPDOWNS ── */}
      {showTemplates && (
        <div style={{ position: 'absolute', top: 58, left: 200, zIndex: 200, background: '#13132a', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 12, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
          <div style={{ gridColumn: '1/-1', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>CHOISIR UN TEMPLATE</div>
          {TEMPLATES.map(tpl => (
            <button key={tpl.name} onClick={() => applyTemplate(tpl)}
              style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#c7d2fe', fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.12)')}
            >{tpl.name}</button>
          ))}
        </div>
      )}

      {showThemes && (
        <div style={{ position: 'absolute', top: 58, left: 310, zIndex: 200, background: '#13132a', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 12, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
          <div style={{ gridColumn: '1/-1', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>CHOISIR UN THÈME</div>
          {THEMES.map(theme => (
            <button key={theme.name} onClick={() => applyTheme(theme)}
              style={{ padding: '8px 14px', background: theme.bg, border: `2px solid ${theme.accent}`, borderRadius: 8, color: theme.text, fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}>
              <span style={{ fontWeight: 600 }}>{theme.name}</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SLIDE PANEL (left) ── */}
        <aside style={{ width: 180, background: 'rgba(10,10,20,0.98)', borderRight: '1px solid rgba(99,102,241,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px', fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>SLIDES ({slides.length})</span>
            <button onClick={addSlide} style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 6, color: '#a5b4fc', padding: '2px 6px', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>+</button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '0 8px 8px' }}>
            {slides.map((slide, idx) => (
              <div key={slide.id}
                onClick={() => { if (idx !== currentIdx) switchSlide(idx); }}
                style={{ position: 'relative', marginBottom: 8, borderRadius: 8, border: idx === currentIdx ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.06)', cursor: 'pointer', overflow: 'hidden', boxShadow: idx === currentIdx ? '0 0 12px rgba(99,102,241,0.4)' : 'none', transition: 'all .2s' }}>
                {/* Thumbnail or placeholder */}
                <div style={{ width: '100%', aspectRatio: '16/9', background: slide.background || '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(thumbnails.current[slide.id] || slide.thumbnail) ? (
                    <img src={thumbnails.current[slide.id] || slide.thumbnail!} alt={slide.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'center' }}>
                      <Presentation size={16} style={{ margin: '0 auto 4px' }} />
                      {slide.name}
                    </div>
                  )}
                </div>
                {/* Slide number */}
                <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 9, color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.5)', padding: '1px 4px', borderRadius: 3 }}>{idx + 1}</div>
                {/* Actions */}
                <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 2 }}
                  onClick={e => e.stopPropagation()}>
                  <MiniBtn onClick={() => duplicateSlide(idx)} title="Dupliquer"><Copy size={10} /></MiniBtn>
                  <MiniBtn onClick={() => deleteSlide(idx)} title="Delete" danger><Trash2 size={10} /></MiniBtn>
                </div>
              </div>
            ))}
            <button onClick={addSlide} style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(99,102,241,0.06)', border: '2px dashed rgba(99,102,241,0.25)', borderRadius: 8, color: '#6366f1', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11 }}>
              <Plus size={18} /> Nouvelle slide
            </button>
          </div>
        </aside>

        {/* ── CANVAS AREA ── */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at center, #12122a 0%, #080812 100%)', overflow: 'hidden', position: 'relative' }}>
          {/* Grid background */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', boxShadow: '0 30px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.2)', borderRadius: 4, overflow: 'hidden', transition: 'transform 0.2s ease' }}>
            <canvas ref={canvasRef} />
          </div>

          {/* Slide counter */}
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '4px 16px', borderRadius: 20, fontSize: 12, color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
            {currentIdx + 1} / {slides.length}
          </div>

          {/* Keyboard hint */}
          <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 10, color: '#374151' }}>
            Del: supprimer · Arrows: déplacer
          </div>
        </main>

        {/* ── RIGHT PANEL ── */}
        {isPanelOpen && (
          <aside style={{ width: 240, background: 'rgba(10,10,20,0.98)', borderLeft: '1px solid rgba(99,102,241,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              {(['insert', 'design', 'animate'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: '10px 0', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, background: 'none', border: 'none', color: activeTab === tab ? '#6366f1' : '#64748b', borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent', cursor: 'pointer', textTransform: 'uppercase', transition: 'color .2s' }}>
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: 14 }}>

              {/* INSERT TAB */}
              {activeTab === 'insert' && (
                <>
                  <SectionTitle>Add</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    <PanelBtn onClick={addText}><Type size={16} /> Texte</PanelBtn>
                    <PanelBtn onClick={addImage}><ImageIcon size={16} /> Image</PanelBtn>
                    <PanelBtn onClick={() => addShape('rect')}><Square size={16} /> Rectangle</PanelBtn>
                    <PanelBtn onClick={() => addShape('circle')}><Circle size={16} /> Cercle</PanelBtn>
                    <PanelBtn onClick={() => addShape('triangle')}><Triangle size={16} /> Triangle</PanelBtn>
                    <PanelBtn onClick={() => addShape('line')}><Minus size={16} /> Ligne</PanelBtn>
                  </div>

                  {selectedObj && (
                    <>
                      <SectionTitle>Objet sélectionné</SectionTitle>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        <PanelBtn onClick={duplicateSelected}><Copy size={14} /> Dupliquer</PanelBtn>
                        <PanelBtn onClick={deleteSelected} danger><Trash2 size={14} /> Suppr.</PanelBtn>
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                        <PanelBtn onClick={bringForward}><ChevronUp size={14} /> Avant</PanelBtn>
                        <PanelBtn onClick={sendBackward}><ChevronDown size={14} /> Arrière</PanelBtn>
                      </div>

                      {selectedObj instanceof fabric.Textbox && (
                        <>
                          <SectionTitle>Texte</SectionTitle>
                          {/* Font size */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <button onClick={() => applyTextProp({ fontSize: Math.max(8, (textStyle.fontSize || 24) - 2) })} style={miniStyle}><Minus size={12} /></button>
                            <span style={{ flex: 1, textAlign: 'center', fontSize: 13 }}>{textStyle.fontSize}px</span>
                            <button onClick={() => applyTextProp({ fontSize: (textStyle.fontSize || 24) + 2 })} style={miniStyle}><Plus size={12} /></button>
                          </div>
                          {/* Font family */}
                          <select value={textStyle.fontFamily} onChange={e => applyTextProp({ fontFamily: e.target.value })}
                            style={{ width: '100%', background: '#13132a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, color: '#c7d2fe', padding: '6px 8px', fontSize: 12, marginBottom: 8 }}>
                            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          {/* Style buttons */}
                          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                            <FmtBtn active={textStyle.bold} onClick={() => applyTextProp({ fontWeight: textStyle.bold ? 'normal' : 'bold' })}><Bold size={13} /></FmtBtn>
                            <FmtBtn active={textStyle.italic} onClick={() => applyTextProp({ fontStyle: textStyle.italic ? 'normal' : 'italic' })}><Italic size={13} /></FmtBtn>
                            <FmtBtn active={textStyle.underline} onClick={() => applyTextProp({ underline: !textStyle.underline })}><Underline size={13} /></FmtBtn>
                            <FmtBtn active={textStyle.align === 'left'} onClick={() => applyTextProp({ textAlign: 'left' })}><AlignLeft size={13} /></FmtBtn>
                            <FmtBtn active={textStyle.align === 'center'} onClick={() => applyTextProp({ textAlign: 'center' })}><AlignCenter size={13} /></FmtBtn>
                            <FmtBtn active={textStyle.align === 'right'} onClick={() => applyTextProp({ textAlign: 'right' })}><AlignRight size={13} /></FmtBtn>
                          </div>
                          {/* Color */}
                          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Couleur du texte</label>
                          <input type="color" value={typeof textStyle.fill === 'string' ? textStyle.fill : '#ffffff'} onChange={e => applyTextProp({ fill: e.target.value })}
                            style={{ width: '100%', height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                        </>
                      )}

                      {/* Shape color */}
                      {!(selectedObj instanceof fabric.Textbox) && !(selectedObj instanceof fabric.Image) && (
                        <>
                          <SectionTitle>Forme</SectionTitle>
                          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Couleur de remplissage</label>
                          <input type="color" defaultValue="#6366f1"
                            onChange={e => { selectedObj.set('fill', e.target.value); fabricRef.current?.renderAll(); }}
                            style={{ width: '100%', height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
                          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4, marginTop: 8 }}>Opacité</label>
                          <input type="range" min={0} max={1} step={0.05} defaultValue={1}
                            onChange={e => { selectedObj.set('opacity', parseFloat(e.target.value)); fabricRef.current?.renderAll(); }}
                            style={{ width: '100%' }} />
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {/* DESIGN TAB */}
              {activeTab === 'design' && (
                <>
                  <SectionTitle>Fond de slide</SectionTitle>
                  <input type="color" value={bgColor} onChange={e => changeBackground(e.target.value)}
                    style={{ width: '100%', height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none', marginBottom: 12 }} />
                  <SectionTitle>Couleurs rapides</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 16 }}>
                    {['#0f172a', '#064e3b', '#7f1d1d', '#2e1065', '#0c4a6e', '#ffffff', '#1a1a2e', '#18181b'].map(c => (
                      <button key={c} onClick={() => changeBackground(c)}
                        style={{ aspectRatio: '1', background: c, border: bgColor === c ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.15)', borderRadius: 6, cursor: 'pointer' }} />
                    ))}
                  </div>
                  <SectionTitle>Thèmes complets</SectionTitle>
                  {THEMES.map(theme => (
                    <button key={theme.name} onClick={() => applyTheme(theme)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: theme.bg, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: theme.text, fontSize: 12, cursor: 'pointer', marginBottom: 6, transition: 'all .2s' }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: theme.accent, flexShrink: 0 }} />
                      {theme.name}
                    </button>
                  ))}
                </>
              )}

              {/* ANIMATE TAB */}
              {activeTab === 'animate' && (
                <>
                  <SectionTitle>Transition des slides</SectionTitle>
                  {['none', 'fade', 'slide', 'zoom', 'flip'].map(tr => (
                    <button key={tr} onClick={() => setSlides(prev => prev.map((s, i) => i === currentIdx ? { ...s, transition: tr } : s))}
                      style={{ width: '100%', padding: '8px 12px', marginBottom: 6, background: slides[currentIdx]?.transition === tr ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#c7d2fe', fontSize: 12, cursor: 'pointer', textAlign: 'left', textTransform: 'capitalize' }}>
                      {tr === 'none' ? 'Aucune' : tr.charAt(0).toUpperCase() + tr.slice(1)}
                    </button>
                  ))}
                  <SectionTitle style={{ marginTop: 16 }}>Export</SectionTitle>
                  <PanelBtn onClick={exportPDF} style="full"><Download size={14} /> Exporter PDF</PanelBtn>
                  <div style={{ height: 6 }} />
                  <PanelBtn onClick={exportPNG} style="full"><FileDown size={14} /> Exporter PNG</PanelBtn>
                </>
              )}
            </div>
          </aside>
        )}

        {/* Toggle panel */}
        <button onClick={() => setIsPanelOpen(p => !p)}
          style={{ position: 'absolute', right: isPanelOpen ? 252 : 12, bottom: 60, zIndex: 40, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 8, color: '#6366f1', padding: '6px 8px', cursor: 'pointer', transition: 'right .3s' }}>
          {isPanelOpen ? <ChevronRight size={14} /> : <Layers size={14} />}
        </button>
      </div>

      {/* ═══ PRESENT MODE ═══ */}
      {showPresent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Render slide as image */}
          <div style={{ position: 'relative', width: '90vw', maxWidth: 1280, aspectRatio: '16/9', background: slides[presentIdx].background || '#0f172a', borderRadius: 8, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.9)' }}>
            {(thumbnails.current[slides[presentIdx].id] || slides[presentIdx].thumbnail) ? (
              <img src={thumbnails.current[slides[presentIdx].id] || slides[presentIdx].thumbnail!} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                <Presentation size={60} />
              </div>
            )}
          </div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: 16, marginTop: 24, alignItems: 'center' }}>
            <button onClick={() => setPresentIdx(i => Math.max(0, i - 1))} style={presentBtnStyle} disabled={presentIdx === 0}><ChevronLeft size={22} /></button>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>{presentIdx + 1} / {slides.length}</span>
            <button onClick={() => setPresentIdx(i => Math.min(slides.length - 1, i + 1))} style={presentBtnStyle} disabled={presentIdx === slides.length - 1}><ChevronRight size={22} /></button>
          </div>
          <button onClick={() => setShowPresent(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: 14 }}>✕ Quitter</button>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components & styles ────────────────────────────── */
const TopBtn = ({ children, onClick, title, disabled }: { children: React.ReactNode; onClick?: () => void; title?: string; disabled?: boolean }) => (
  <button onClick={onClick} title={title} disabled={disabled}
    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 7, color: disabled ? '#374151' : '#a5b4fc', fontSize: 12, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
    {children}
  </button>
);

const MiniBtn = ({ children, onClick, title, danger }: { children: React.ReactNode; onClick?: () => void; title?: string; danger?: boolean }) => (
  <button onClick={onClick} title={title}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, background: danger ? 'rgba(239,68,68,0.8)' : 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}>
    {children}
  </button>
);

const PanelBtn = ({ children, onClick, danger, style: _style }: { children: React.ReactNode; onClick?: () => void; danger?: boolean; style?: string }) => (
  <button onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '7px 10px', background: danger ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.1)', border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.25)'}`, borderRadius: 8, color: danger ? '#f87171' : '#a5b4fc', fontSize: 12, cursor: 'pointer', width: _style === 'full' ? '100%' : undefined, transition: 'all .2s', marginBottom: _style === 'full' ? 0 : undefined }}>
    {children}
  </button>
);

const FmtBtn = ({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px 6px', background: active ? 'rgba(99,102,241,0.35)' : 'rgba(99,102,241,0.08)', border: `1px solid ${active ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.2)'}`, borderRadius: 6, color: '#a5b4fc', cursor: 'pointer', flex: 1 }}>
    {children}
  </button>
);

const SectionTitle = ({ children, style: extra }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 1, marginBottom: 8, marginTop: 4, textTransform: 'uppercase', ...extra }}>{children}</div>
);

const miniStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 6, color: '#a5b4fc', cursor: 'pointer' };

const presentBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: 20 };
