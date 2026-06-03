import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../AdminLayout';
import Modal from '../components/Modal';
import { apiGet, apiPost, apiPatch, apiDel } from '../api';

const CATEGORIAS = [
  { value: 'ata',       label: 'Ata' },
  { value: 'contrato',  label: 'Contrato' },
  { value: 'mapa',      label: 'Mapa' },
  { value: 'relatorio', label: 'Relatório' },
  { value: 'outro',     label: 'Outro' },
];

const EMPTY = { titulo: '', categoria: 'outro', ordem: 0, arquivo: null };

export default function DocumentosAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('/documentos/?format=json');
      setItems(Array.isArray(data) ? data : data.results ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => setModal({ item: null, form: { ...EMPTY } });

  const openEdit = (item) =>
    setModal({
      item,
      form: { titulo: item.titulo, categoria: item.categoria, ordem: item.ordem, arquivo: null },
    });

  const closeModal = () => { setModal(null); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { form, item } = modal;
      const fd = new FormData();
      fd.append('titulo',    form.titulo);
      fd.append('categoria', form.categoria);
      fd.append('ordem',     form.ordem);
      if (form.arquivo) fd.append('arquivo', form.arquivo);

      if (item) {
        const updated = await apiPatch(`/documentos/${item.id}/`, fd, true);
        setItems(prev => prev.map(n => (n.id === item.id ? updated : n)));
      } else {
        const created = await apiPost('/documentos/', fd, true);
        setItems(prev => [...prev, created]);
      }
      closeModal();
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este documento?')) return;
    await apiDel(`/documentos/${id}/`);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const setField = (key, val) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Documentos</h1>
        <button className="btn-primary" onClick={openCreate}>+ Novo Documento</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Carregando…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Ordem</th>
                <th>Arquivo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Nenhum documento cadastrado</td></tr>
              )}
              {items.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.titulo}</strong></td>
                  <td>{CATEGORIAS.find(c => c.value === item.categoria)?.label ?? item.categoria}</td>
                  <td><span className="badge badge-blue">{item.tipo?.toUpperCase()}</span></td>
                  <td>{item.ordem}</td>
                  <td>
                    {item.arquivo
                      ? <a href={item.arquivo} target="_blank" rel="noreferrer" style={{ color: '#1565c0', fontSize: '0.8rem' }}>Abrir</a>
                      : '—'}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => openEdit(item)}>Editar</button>
                    <button className="btn-danger" onClick={() => handleDelete(item.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal.item ? 'Editar Documento' : 'Novo Documento'}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          {saveError && <div className="admin-error">{saveError}</div>}

          <div className="form-group">
            <label>Título *</label>
            <input className="form-control" value={modal.form.titulo}
              onChange={e => setField('titulo', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Categoria</label>
              <select className="form-control" value={modal.form.categoria}
                onChange={e => setField('categoria', e.target.value)}>
                {CATEGORIAS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ordem</label>
              <input className="form-control" type="number" min={0} value={modal.form.ordem}
                onChange={e => setField('ordem', Number(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label>Arquivo {!modal.item && '*'}</label>
            <input className="form-control" type="file"
              onChange={e => setField('arquivo', e.target.files[0] ?? null)} />
            {modal.item?.arquivo && (
              <p className="form-hint">
                Arquivo atual: <a href={modal.item.arquivo} target="_blank" rel="noreferrer">abrir</a>. Selecione um arquivo para substituir.
              </p>
            )}
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
