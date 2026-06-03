import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../AdminLayout';
import Modal from '../components/Modal';
import { apiGet, apiPost, apiPatch, apiDel } from '../api';

const STATUS = [
  { value: 'planejado',    label: 'Planejado',    badge: 'badge-gray' },
  { value: 'em_andamento', label: 'Em Andamento', badge: 'badge-blue' },
  { value: 'concluido',    label: 'Concluído',    badge: 'badge-green' },
];

const EMPTY = {
  projeto: '', descricao: '',
  valor_aprovado: '', valor_executado: '',
  status: 'planejado',
};

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function LinhasAdmin() {
  const [items, setItems] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [linhas, projs] = await Promise.all([
        apiGet('/linhas/?format=json'),
        apiGet('/projetos/?format=json'),
      ]);
      setItems(Array.isArray(linhas) ? linhas : linhas.results ?? []);
      setProjetos(Array.isArray(projs) ? projs : projs.results ?? []);
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
        projeto:         item.projeto,
        descricao:       item.descricao,
        valor_aprovado:  item.valor_aprovado,
        valor_executado: item.valor_executado,
        status:          item.status,
      },
    });

  const closeModal = () => { setModal(null); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { form, item } = modal;
      if (item) {
        const updated = await apiPatch(`/linhas/${item.id}/`, form);
        setItems(prev => prev.map(n => (n.id === item.id ? updated : n)));
      } else {
        const created = await apiPost('/linhas/', form);
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
    if (!confirm('Excluir esta linha orçamentária?')) return;
    await apiDel(`/linhas/${id}/`);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const setField = (key, val) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Linhas Orçamentárias</h1>
        <button className="btn-primary" onClick={openCreate}>+ Nova Linha</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Carregando…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Descrição</th>
                <th>Val. Aprovado</th>
                <th>Val. Executado</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Nenhuma linha cadastrada</td></tr>
              )}
              {items.map(item => {
                const s = STATUS.find(x => x.value === item.status) ?? STATUS[0];
                return (
                  <tr key={item.id}>
                    <td>{item.projeto_nome ?? item.projeto}</td>
                    <td>{item.descricao}</td>
                    <td>{fmt(item.valor_aprovado)}</td>
                    <td>{fmt(item.valor_executado)}</td>
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
          title={modal.item ? 'Editar Linha Orçamentária' : 'Nova Linha Orçamentária'}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
        >
          {saveError && <div className="admin-error">{saveError}</div>}

          <div className="form-group">
            <label>Projeto *</label>
            <select className="form-control" value={modal.form.projeto}
              onChange={e => setField('projeto', Number(e.target.value))}>
              <option value="">Selecione um projeto…</option>
              {projetos.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Descrição *</label>
            <input className="form-control" value={modal.form.descricao}
              onChange={e => setField('descricao', e.target.value)} />
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
              <label>Status</label>
              <select className="form-control" value={modal.form.status}
                onChange={e => setField('status', e.target.value)}>
                {STATUS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
