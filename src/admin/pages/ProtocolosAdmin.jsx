import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../AdminLayout';
import Modal from '../components/Modal';
import { apiGet, apiPost, apiPatch, apiDel } from '../api';

const EMPTY = {
  numero: '', data: '', descricao: '', aprovado_por: '', valor: '',
};

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProtocolosAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('/protocolos/?format=json');
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
        numero:       item.numero,
        data:         item.data,
        descricao:    item.descricao,
        aprovado_por: item.aprovado_por,
        valor:        item.valor,
      },
    });

  const closeModal = () => { setModal(null); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { form, item } = modal;
      if (item) {
        const updated = await apiPatch(`/protocolos/${item.id}/`, form);
        setItems(prev => prev.map(n => (n.id === item.id ? updated : n)));
      } else {
        const created = await apiPost('/protocolos/', form);
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
    if (!confirm('Excluir este protocolo?')) return;
    await apiDel(`/protocolos/${id}/`);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const setField = (key, val) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Protocolos</h1>
        <button className="btn-primary" onClick={openCreate}>+ Novo Protocolo</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Carregando…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Data</th>
                <th>Aprovado por</th>
                <th>Valor</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Nenhum protocolo cadastrado</td></tr>
              )}
              {items.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.numero}</strong></td>
                  <td>{item.data}</td>
                  <td>{item.aprovado_por}</td>
                  <td>{fmt(item.valor)}</td>
                  <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.descricao}
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
          title={modal.item ? 'Editar Protocolo' : 'Novo Protocolo'}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          {saveError && <div className="admin-error">{saveError}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Número *</label>
              <input className="form-control" value={modal.form.numero}
                onChange={e => setField('numero', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data *</label>
              <input className="form-control" type="date" value={modal.form.data}
                onChange={e => setField('data', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Aprovado por *</label>
            <input className="form-control" value={modal.form.aprovado_por}
              onChange={e => setField('aprovado_por', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Valor (R$) *</label>
            <input className="form-control" type="number" step="0.01" min="0"
              value={modal.form.valor}
              onChange={e => setField('valor', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Descrição *</label>
            <textarea className="form-control" rows={3} value={modal.form.descricao}
              onChange={e => setField('descricao', e.target.value)} />
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
