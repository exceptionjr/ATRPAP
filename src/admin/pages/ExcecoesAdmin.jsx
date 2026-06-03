import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../AdminLayout';
import Modal from '../components/Modal';
import { apiGet, apiPost, apiPatch, apiDel } from '../api';

const TIPOS = [
  { value: 'realocacao', label: 'Realocação de Fundos' },
  { value: 'extensao',   label: 'Extensão de Prazo' },
  { value: 'aquisicao',  label: 'Aquisição Emergencial' },
];

const STATUS = [
  { value: 'pendente',  label: 'Pendente',  badge: 'badge-yellow' },
  { value: 'aprovada',  label: 'Aprovada',  badge: 'badge-green' },
  { value: 'reprovada', label: 'Reprovada', badge: 'badge-red' },
];

const EMPTY = {
  data: '', tipo: 'realocacao', valor: '',
  responsavel: '', justificativa: '',
  status: 'pendente', analisado_por: '',
};

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ExcecoesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('/excecoes/?format=json');
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
        data:          item.data,
        tipo:          item.tipo,
        valor:         item.valor,
        responsavel:   item.responsavel,
        justificativa: item.justificativa,
        status:        item.status,
        analisado_por: item.analisado_por ?? '',
      },
    });

  const closeModal = () => { setModal(null); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { form, item } = modal;
      if (item) {
        const updated = await apiPatch(`/excecoes/${item.id}/`, form);
        setItems(prev => prev.map(n => (n.id === item.id ? updated : n)));
      } else {
        const created = await apiPost('/excecoes/', form);
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
    if (!confirm('Excluir esta exceção?')) return;
    await apiDel(`/excecoes/${id}/`);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const setField = (key, val) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Exceções / Desvios</h1>
        <button className="btn-primary" onClick={openCreate}>+ Nova Exceção</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Carregando…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Responsável</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Analisado por</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Nenhuma exceção cadastrada</td></tr>
              )}
              {items.map(item => {
                const st = STATUS.find(x => x.value === item.status) ?? STATUS[0];
                const ti = TIPOS.find(x => x.value === item.tipo);
                return (
                  <tr key={item.id}>
                    <td>{item.data}</td>
                    <td>{ti?.label ?? item.tipo}</td>
                    <td>{item.responsavel}</td>
                    <td>{fmt(item.valor)}</td>
                    <td><span className={`badge ${st.badge}`}>{st.label}</span></td>
                    <td>{item.analisado_por || <span style={{ color: '#aaa' }}>—</span>}</td>
                    <td>
                      <button className="btn-edit" onClick={() => openEdit(item)}>Editar</button>
                      <button className="btn-danger" onClick={() => handleDelete(item.id)}>Excluir</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal.item ? 'Editar Exceção' : 'Nova Exceção'}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          {saveError && <div className="admin-error">{saveError}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Data *</label>
              <input className="form-control" type="date" value={modal.form.data}
                onChange={e => setField('data', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo *</label>
              <select className="form-control" value={modal.form.tipo}
                onChange={e => setField('tipo', e.target.value)}>
                {TIPOS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Valor (R$) *</label>
              <input className="form-control" type="number" step="0.01" min="0"
                value={modal.form.valor}
                onChange={e => setField('valor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Responsável *</label>
              <input className="form-control" value={modal.form.responsavel}
                onChange={e => setField('responsavel', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Justificativa *</label>
            <textarea className="form-control" rows={3} value={modal.form.justificativa}
              onChange={e => setField('justificativa', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={modal.form.status}
                onChange={e => setField('status', e.target.value)}>
                {STATUS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Analisado por</label>
              <input className="form-control" value={modal.form.analisado_por}
                onChange={e => setField('analisado_por', e.target.value)} />
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
