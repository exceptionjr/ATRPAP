import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../AdminLayout';
import Modal from '../components/Modal';
import { apiGet, apiPost, apiPatch, apiDel } from '../api';

const EMPTY = { legenda: '', ordem: 0, ativo: true, imagem: null };

export default function GaleriaAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('/galeria/?format=json');
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
      form: { legenda: item.legenda, ordem: item.ordem, ativo: item.ativo, imagem: null },
    });

  const closeModal = () => { setModal(null); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { form, item } = modal;
      const fd = new FormData();
      fd.append('legenda', form.legenda);
      fd.append('ordem',   form.ordem);
      fd.append('ativo',   form.ativo ? 'true' : 'false');
      if (form.imagem) fd.append('imagem', form.imagem);

      if (item) {
        const updated = await apiPatch(`/galeria/${item.id}/`, fd, true);
        setItems(prev => prev.map(n => (n.id === item.id ? updated : n)));
      } else {
        const created = await apiPost('/galeria/', fd, true);
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
    if (!confirm('Excluir esta foto?')) return;
    await apiDel(`/galeria/${id}/`);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const setField = (key, val) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Galeria</h1>
        <button className="btn-primary" onClick={openCreate}>+ Nova Foto</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Carregando…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Legenda</th>
                <th>Ordem</th>
                <th>Visível</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Nenhuma foto cadastrada</td></tr>
              )}
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.imagem
                      ? <img src={item.imagem} alt={item.legenda} />
                      : <span style={{ color: '#aaa' }}>—</span>}
                  </td>
                  <td>{item.legenda || <span style={{ color: '#aaa' }}>Sem legenda</span>}</td>
                  <td>{item.ordem}</td>
                  <td>
                    {item.ativo
                      ? <span className="badge badge-green">Sim</span>
                      : <span className="badge badge-gray">Não</span>}
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
          title={modal.item ? 'Editar Foto' : 'Nova Foto'}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          {saveError && <div className="admin-error">{saveError}</div>}

          <div className="form-group">
            <label>Imagem {!modal.item && '*'}</label>
            <input className="form-control" type="file" accept="image/*"
              onChange={e => setField('imagem', e.target.files[0] ?? null)} />
            {modal.item?.imagem && (
              <div style={{ marginTop: '8px' }}>
                <img src={modal.item.imagem} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <p className="form-hint">Selecione um arquivo para substituir a imagem atual.</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Legenda / Alt text</label>
            <input className="form-control" value={modal.form.legenda}
              onChange={e => setField('legenda', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Ordem de exibição</label>
            <input className="form-control" type="number" min={0} value={modal.form.ordem}
              onChange={e => setField('ordem', Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label className="form-check">
              <input type="checkbox" checked={modal.form.ativo}
                onChange={e => setField('ativo', e.target.checked)} />
              Visível no site
            </label>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
