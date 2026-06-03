import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../AdminLayout';
import Modal from '../components/Modal';
import { apiGet, apiPost, apiPatch, apiDel } from '../api';

const STATUS = [
  { value: 'em_andamento', label: 'Em Andamento', badge: 'badge-blue' },
  { value: 'concluido',    label: 'Concluído',    badge: 'badge-green' },
  { value: 'planejado',    label: 'Planejado',    badge: 'badge-gray' },
];

const EMPTY = {
  nome: '', periodo: '',
  valor_aprovado: '', valor_executado: '', saldo_disponivel: '',
  status: 'em_andamento',
};

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProjetosAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('/projetos/?format=json');
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
        nome:             item.nome,
        periodo:          item.periodo,
        valor_aprovado:   item.valor_aprovado,
        valor_executado:  item.valor_executado,
        saldo_disponivel: item.saldo_disponivel,
        status:           item.status,
      },
    });

  const closeModal = () => { setModal(null); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { form, item } = modal;
      const body = { ...form };

      if (item) {
        const updated = await apiPatch(`/projetos/${item.id}/`, body);
        setItems(prev => prev.map(n => (n.id === item.id ? updated : n)));
      } else {
        const created = await apiPost('/projetos/', body);
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
    if (!confirm('Excluir este projeto? As linhas orçamentárias associadas também serão removidas.')) return;
    await apiDel(`/projetos/${id}/`);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const setField = (key, val) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Projetos</h1>
        <button className="btn-primary" onClick={openCreate}>+ Novo Projeto</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Carregando…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Período</th>
                <th>Val. Aprovado</th>
                <th>Val. Executado</th>
                <th>Saldo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Nenhum projeto cadastrado</td></tr>
              )}
              {items.map(item => {
                const s = STATUS.find(x => x.value === item.status) ?? STATUS[0];
                return (
                  <tr key={item.id}>
                    <td><strong>{item.nome}</strong></td>
                    <td>{item.periodo}</td>
                    <td>{fmt(item.valor_aprovado)}</td>
                    <td>{fmt(item.valor_executado)}</td>
                    <td>{fmt(item.saldo_disponivel)}</td>
                    <td><span className={`badge ${s.badge}`}>{s.label}</span></td>
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
          title={modal.item ? 'Editar Projeto' : 'Novo Projeto'}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          {saveError && <div className="admin-error">{saveError}</div>}

          <div className="form-group">
            <label>Nome do Projeto *</label>
            <input className="form-control" value={modal.form.nome}
              onChange={e => setField('nome', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Período *</label>
              <input className="form-control" placeholder="Ex: 2024/2025" value={modal.form.periodo}
                onChange={e => setField('periodo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={modal.form.status}
                onChange={e => setField('status', e.target.value)}>
                {STATUS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Valor Aprovado (R$) *</label>
              <input className="form-control" type="number" step="0.01" min="0"
                value={modal.form.valor_aprovado}
                onChange={e => setField('valor_aprovado', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor Executado (R$) *</label>
              <input className="form-control" type="number" step="0.01" min="0"
                value={modal.form.valor_executado}
                onChange={e => setField('valor_executado', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Saldo Disponível (R$) *</label>
              <input className="form-control" type="number" step="0.01" min="0"
                value={modal.form.saldo_disponivel}
                onChange={e => setField('saldo_disponivel', e.target.value)} />
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
