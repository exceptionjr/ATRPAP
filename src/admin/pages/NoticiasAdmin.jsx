import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../AdminLayout';
import Modal from '../components/Modal';
import { apiGet, apiPost, apiPatch, apiDel } from '../api';

const CATEGORIAS = [
  { value: 'assinaturas', label: 'Assinaturas' },
  { value: 'construcao',  label: 'Construção' },
  { value: 'producao',    label: 'Produção' },
  { value: 'credito',     label: 'Crédito' },
  { value: 'eventos',     label: 'Eventos' },
  { value: 'geral',       label: 'Geral' },
];

const EMPTY = {
  titulo: '', resumo: '', conteudo: '', categoria: 'geral',
  data: '', publicado: true, imagem: null,
};

function statusBadge(pub) {
  return pub
    ? <span className="badge badge-green">Publicada</span>
    : <span className="badge badge-gray">Rascunho</span>;
}

export default function NoticiasAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { item, form }
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('/noticias/?format=json');
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
      form: {
        titulo:    item.titulo,
        resumo:    item.resumo,
        conteudo:  item.conteudo ?? '',
        categoria: item.categoria,
        data:      item.data,
        publicado: item.publicado ?? true,
        imagem:    null,
      },
    });

  const closeModal = () => { setModal(null); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { form, item } = modal;
      const fd = new FormData();
      fd.append('titulo',    form.titulo);
      fd.append('resumo',    form.resumo);
      fd.append('conteudo',  form.conteudo);
      fd.append('categoria', form.categoria);
      fd.append('data',      form.data);
      fd.append('publicado', form.publicado ? 'true' : 'false');
      if (form.imagem) fd.append('imagem', form.imagem);

      if (item) {
        const updated = await apiPatch(`/noticias/${item.id}/`, fd, true);
        setItems(prev => prev.map(n => (n.id === item.id ? updated : n)));
      } else {
        const created = await apiPost('/noticias/', fd, true);
        setItems(prev => [created, ...prev]);
      }
      closeModal();
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta notícia?')) return;
    await apiDel(`/noticias/${id}/`);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const setField = (key, val) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Notícias</h1>
        <button className="btn-primary" onClick={openCreate}>+ Nova Notícia</button>
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
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Nenhuma notícia cadastrada</td></tr>
              )}
              {items.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.titulo}</strong></td>
                  <td>{CATEGORIAS.find(c => c.value === item.categoria)?.label ?? item.categoria}</td>
                  <td>{item.data}</td>
                  <td>{statusBadge(item.publicado)}</td>
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
          title={modal.item ? 'Editar Notícia' : 'Nova Notícia'}
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

          <div className="form-group">
            <label>Resumo *</label>
            <textarea className="form-control" rows={2} value={modal.form.resumo}
              onChange={e => setField('resumo', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Conteúdo (HTML)</label>
            <textarea className="form-control" rows={5} value={modal.form.conteudo}
              onChange={e => setField('conteudo', e.target.value)} />
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
              <label>Data de Publicação *</label>
              <input className="form-control" type="date" value={modal.form.data}
                onChange={e => setField('data', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Imagem de Capa</label>
            <input className="form-control" type="file" accept="image/*"
              onChange={e => setField('imagem', e.target.files[0] ?? null)} />
            {modal.item?.imagem && (
              <p className="form-hint">Imagem atual já cadastrada. Selecione um arquivo para substituir.</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-check">
              <input type="checkbox" checked={modal.form.publicado}
                onChange={e => setField('publicado', e.target.checked)} />
              Publicar no site
            </label>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
