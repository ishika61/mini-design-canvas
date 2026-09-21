'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DesignStage = dynamic(() => import('./DesignStage'), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const blankCanvas = () => ({ name: 'Untitled canvas', elements: [] });
const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export default function CanvasEditor() {
  const [canvas, setCanvas] = useState(blankCanvas);
  const [canvasId, setCanvasId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [savedCanvases, setSavedCanvases] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [token, setToken] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [notice, setNotice] = useState('Create an account or sign in to save your work.');
  const [stage, setStage] = useState(null);
  const firstRender = useRef(true);

  const selected = useMemo(
    () => canvas.elements.find((element) => element.id === selectedId) || null,
    [canvas.elements, selectedId]
  );

  const commitCanvas = useCallback((nextCanvas, { record = true } = {}) => {
    setCanvas((current) => {
      if (record) {
        setHistory((items) => [...items.slice(-49), current]);
        setFuture([]);
      }
      return typeof nextCanvas === 'function' ? nextCanvas(current) : nextCanvas;
    });
  }, []);

  const loadCanvasList = useCallback(async () => {
    if (!token) return;
    try {
      setSavedCanvases(await request('/canvases', { token }));
    } catch (error) {
      setNotice(error.message);
    }
  }, [token]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('canvas-token');
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    loadCanvasList();
  }, [loadCanvasList]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!canvasId || !token) return;
    const timer = window.setTimeout(async () => {
      try {
        await request(`/canvases/${canvasId}`, { token, method: 'PUT', body: JSON.stringify(canvas) });
        setNotice('Autosaved');
        loadCanvasList();
      } catch (error) {
        setNotice(`Autosave failed: ${error.message}`);
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [canvas, canvasId, token, loadCanvasList]);

  const addElement = (type) => {
    const offset = 70 + canvas.elements.length * 12;
    const base = { id: newId(), type, x: offset, y: offset, rotation: 0, fill: type === 'text' ? '#202939' : '#5b7cfa', zIndex: canvas.elements.length };
    const element = type === 'circle'
      ? { ...base, radius: 55, fill: '#ec6a5c' }
      : type === 'text'
        ? { ...base, text: 'Double click me', fontSize: 24, width: 220, height: 40 }
        : { ...base, width: 150, height: 100 };
    commitCanvas((current) => ({ ...current, elements: [...current.elements, element] }));
    setSelectedId(element.id);
  };

  const updateElement = (id, changes) => {
    commitCanvas((current) => ({
      ...current,
      elements: current.elements.map((element) => element.id === id ? { ...element, ...changes } : element),
    }));
  };

  const updateSelected = (field, value) => {
    if (!selected) return;
    const numeric = ['x', 'y', 'width', 'height', 'radius', 'rotation', 'fontSize'].includes(field);
    updateElement(selected.id, { [field]: numeric ? Number(value) || 0 : value });
  };

  const deleteSelected = () => {
    if (!selected) return;
    commitCanvas((current) => ({ ...current, elements: current.elements.filter((element) => element.id !== selected.id) }));
    setSelectedId(null);
  };

  const moveLayer = (direction) => {
    if (!selected) return;
    const index = canvas.elements.findIndex((element) => element.id === selected.id);
    const target = index + direction;
    if (target < 0 || target >= canvas.elements.length) return;
    const reordered = [...canvas.elements];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    commitCanvas({ ...canvas, elements: reordered.map((element, zIndex) => ({ ...element, zIndex })) });
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [canvas, ...items]);
    setHistory((items) => items.slice(0, -1));
    setCanvas(previous);
    setSelectedId(null);
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items, canvas]);
    setFuture((items) => items.slice(1));
    setCanvas(next);
    setSelectedId(null);
  };

  const createNew = () => {
    setCanvas(blankCanvas());
    setCanvasId(null);
    setSelectedId(null);
    setHistory([]);
    setFuture([]);
    setNotice('New canvas ready');
  };

  const saveCanvas = async () => {
    if (!token) return setNotice('Please sign in before saving.');
    try {
      const saved = await request(canvasId ? `/canvases/${canvasId}` : '/canvases', {
        token,
        method: canvasId ? 'PUT' : 'POST',
        body: JSON.stringify(canvas),
      });
      setCanvasId(saved._id);
      setCanvas({ name: saved.name, elements: saved.elements });
      setNotice('Canvas saved');
      loadCanvasList();
    } catch (error) {
      setNotice(`Save failed: ${error.message}`);
    }
  };

  const openCanvas = async (id) => {
    try {
      const saved = await request(`/canvases/${id}`, { token });
      setCanvas({ name: saved.name, elements: saved.elements });
      setCanvasId(saved._id);
      setSelectedId(null);
      setHistory([]);
      setFuture([]);
      setNotice(`Opened ${saved.name}`);
    } catch (error) {
      setNotice(error.message);
    }
  };

  const removeCanvas = async (id) => {
    try {
      await request(`/canvases/${id}`, { token, method: 'DELETE' });
      if (id === canvasId) createNew();
      setNotice('Canvas deleted');
      loadCanvasList();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const authenticate = async (mode) => {
    try {
      const result = await request(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(credentials) });
      window.localStorage.setItem('canvas-token', result.token);
      setToken(result.token);
      setNotice(mode === 'register' ? 'Account created' : 'Signed in');
    } catch (error) {
      setNotice(error.message);
    }
  };

  const exportPng = () => {
    if (!stage) return;
    const link = document.createElement('a');
    link.download = `${canvas.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'canvas'}.png`;
    link.href = stage.toDataURL({ pixelRatio: 2 });
    link.click();
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><strong>Canvas Lab</strong><span>Mini Design Canvas</span></div>
        <div className="actions">
          <button onClick={createNew}>New</button>
          <button onClick={undo} disabled={!history.length}>Undo</button>
          <button onClick={redo} disabled={!future.length}>Redo</button>
          <button onClick={exportPng}>Export PNG</button>
          <button className="primary" onClick={saveCanvas}>Save</button>
        </div>
      </header>

      <section className="workspace">
        <aside className="left-panel">
          <h2>Add element</h2>
          <button onClick={() => addElement('rect')}>▭ Rectangle</button>
          <button onClick={() => addElement('circle')}>○ Circle</button>
          <button onClick={() => addElement('text')}>T Text</button>
          <hr />
          <h2>Account</h2>
          <input placeholder="Email" type="email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
          <input placeholder="Password" type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
          <div className="split-actions"><button onClick={() => authenticate('login')}>Sign in</button><button onClick={() => authenticate('register')}>Register</button></div>
          {token && <button onClick={() => { localStorage.removeItem('canvas-token'); setToken(''); setSavedCanvases([]); }}>Sign out</button>}
          <hr />
          <h2>Saved canvases</h2>
          <div className="saved-list">
            {savedCanvases.map((item) => <div className="saved-item" key={item._id}><button onClick={() => openCanvas(item._id)}>{item.name}</button><button aria-label={`Delete ${item.name}`} onClick={() => removeCanvas(item._id)}>×</button></div>)}
            {!savedCanvases.length && <p>Nothing saved yet.</p>}
          </div>
        </aside>

        <section className="editor">
          <div className="canvas-title"><input value={canvas.name} aria-label="Canvas name" onChange={(e) => commitCanvas({ ...canvas, name: e.target.value })} /><span>{notice}</span></div>
          <DesignStage elements={canvas.elements} selectedId={selectedId} onSelect={setSelectedId} onChange={updateElement} onStageReady={setStage} />
        </section>

        <aside className="right-panel">
          <h2>Properties</h2>
          {!selected && <p>Select an element to edit it.</p>}
          {selected && <>
            <label>Position</label><div className="number-pair"><input type="number" value={selected.x} onChange={(e) => updateSelected('x', e.target.value)} /><input type="number" value={selected.y} onChange={(e) => updateSelected('y', e.target.value)} /></div>
            {selected.type === 'circle' ? <Field label="Radius" type="number" value={selected.radius} onChange={(value) => updateSelected('radius', value)} /> : <><Field label="Width" type="number" value={selected.width} onChange={(value) => updateSelected('width', value)} /><Field label="Height" type="number" value={selected.height} onChange={(value) => updateSelected('height', value)} /></>}
            <Field label="Rotation" type="number" value={selected.rotation || 0} onChange={(value) => updateSelected('rotation', value)} />
            <label>Color<input type="color" value={selected.fill} onChange={(e) => updateSelected('fill', e.target.value)} /></label>
            {selected.type === 'text' && <><label>Text<textarea value={selected.text || ''} onChange={(e) => updateSelected('text', e.target.value)} /></label><Field label="Font size" type="number" value={selected.fontSize || 24} onChange={(value) => updateSelected('fontSize', value)} /></>}
            <div className="split-actions"><button onClick={() => moveLayer(-1)}>Move back</button><button onClick={() => moveLayer(1)}>Move forward</button></div>
            <button className="danger" onClick={deleteSelected}>Delete selected</button>
          </>}
        </aside>
      </section>
    </main>
  );
}

function Field({ label, type, value, onChange }) {
  const requiresPositiveValue = ['Width', 'Height', 'Radius', 'Font size'].includes(label);
  return <label>{label}<input type={type} min={requiresPositiveValue ? 1 : undefined} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
