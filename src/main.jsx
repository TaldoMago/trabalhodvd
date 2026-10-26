import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, AlertTriangle, ArrowDownLeft, ArrowLeftRight, ArrowUpRight,
  Bell, Boxes, ChartNoAxesCombined, ChevronDown, CircleDollarSign,
  Clock3, LayoutDashboard, Lightbulb, LogOut, Menu, Package, Search,
  Settings, ShieldCheck, Truck, Users, X
} from 'lucide-react';
import './styles.css';

const initialProducts = [
  { id: 1, name: 'Mouse Gamer RGB', category: 'Informática', sku: 'INF-001', stock: 3, min: 10, price: 89.9, supplier: 'Tech Solutions', icon: '🖱️', daily: 5, lead: 4 },
  { id: 2, name: 'Teclado Mecânico', category: 'Informática', sku: 'INF-002', stock: 5, min: 15, price: 219.9, supplier: 'Tech Solutions', icon: '⌨️', daily: 3, lead: 5 },
  { id: 3, name: 'Papel A4 (Resma)', category: 'Escritório', sku: 'ESC-001', stock: 8, min: 20, price: 29.9, supplier: 'Papelaria Forte', icon: '📄', daily: 8, lead: 6 },
  { id: 4, name: 'Café em Pó 500g', category: 'Alimentos', sku: 'ALI-001', stock: 6, min: 15, price: 18.5, supplier: 'Distribuidora Alfa', icon: '☕', daily: 4, lead: 3 },
  { id: 5, name: 'Água Mineral 500ml', category: 'Alimentos', sku: 'ALI-002', stock: 4, min: 10, price: 2.5, supplier: 'Distribuidora Alfa', icon: '🧴', daily: 15, lead: 2 },
  { id: 6, name: 'Camiseta Básica', category: 'Vestuário', sku: 'VES-001', stock: 62, min: 20, price: 39.9, supplier: 'Moda Center', icon: '👕', daily: 12, lead: 5 },
  { id: 7, name: 'Caderno Universitário', category: 'Escritório', sku: 'ESC-002', stock: 34, min: 12, price: 16.9, supplier: 'Papelaria Forte', icon: '📓', daily: 2, lead: 4 },
  { id: 8, name: 'Detergente 500ml', category: 'Limpeza', sku: 'LIM-001', stock: 18, min: 10, price: 3.99, supplier: 'Casa Limpa', icon: '🧼', daily: 3, lead: 3 }
];

const movements = [
  { date: '26/10/2026 09:12', product: 'Mouse Gamer RGB', type: 'Entrada', qty: '+ 20', supplier: 'Tech Solutions', user: 'Eduardo' },
  { date: '26/10/2026 08:45', product: 'Teclado Mecânico', type: 'Saída', qty: '- 5', supplier: '—', user: 'Eduardo' },
  { date: '25/10/2026 16:32', product: 'Papel A4 (Resma)', type: 'Entrada', qty: '+ 50', supplier: 'Papelaria Forte', user: 'Lucas Silva' },
  { date: '25/10/2026 14:21', product: 'Água Mineral 500ml', type: 'Saída', qty: '- 10', supplier: '—', user: 'Mariana Costa' },
  { date: '25/10/2026 11:05', product: 'Café em Pó 500g', type: 'Entrada', qty: '+ 15', supplier: 'Distribuidora Alfa', user: 'Eduardo' }
];

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Produtos', icon: Package },
  { label: 'Fornecedores', icon: Users },
  { label: 'Movimentações', icon: ArrowLeftRight },
  { label: 'Alertas', icon: Bell },
  { label: 'Relatórios', icon: ChartNoAxesCombined },
  { label: 'Previsão de Reposição', icon: Lightbulb }
];

const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function App() {
  const [active, setActive] = useState('Dashboard');
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [showAdd, setShowAdd] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', sku: '', category: 'Informática', stock: '', min: '', price: '' });

  const filtered = useMemo(() => products.filter(p =>
    `${p.name} ${p.sku} ${p.category} ${p.supplier}`.toLowerCase().includes(query.toLowerCase())
  ), [products, query]);

  const lowStock = products.filter(p => p.stock <= p.min);
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const forecasts = products.filter(p => p.daily > 0).map(p => ({
    ...p, days: Math.floor(p.stock / p.daily),
    recommend: Math.max(0, Math.ceil((p.daily * (p.lead + 3)) - p.stock))
  })).sort((a, b) => a.days - b.days);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function addProduct(e) {
    e.preventDefault();
    const newProduct = {
      id: Date.now(), name: form.name, sku: form.sku || `SKU-${products.length + 1}`,
      category: form.category, stock: Number(form.stock), min: Number(form.min),
      price: Number(form.price), supplier: 'Fornecedor a definir', icon: '📦', daily: 2, lead: 4
    };
    setProducts(old => [newProduct, ...old]);
    setForm({ name: '', sku: '', category: 'Informática', stock: '', min: '', price: '' });
    setShowAdd(false);
    setActive('Produtos');
    notify('Produto cadastrado na demonstração!');
  }

  function restock(product) {
    setProducts(old => old.map(p => p.id === product.id ? { ...p, stock: p.stock + Math.max(p.min - p.stock + 5, 10) } : p));
    notify(`Estoque de ${product.name} atualizado para a demonstração.`);
  }

  const pageTitle = active === 'Dashboard' ? 'Dashboard' : active;
  const pageSubtitle = active === 'Dashboard' ? 'Resumo do seu estoque em tempo real' : `Acompanhe e gerencie ${active.toLowerCase()} do seu negócio`;

  return (
    <div className="app-shell">
      {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Boxes size={27} strokeWidth={2.4} /></div>
          <div><div className="brand-name">Stock<span>Pro</span></div><div className="brand-sub">Sistema Inteligente de Estoque</div></div>
          <button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Fechar menu"><X size={19}/></button>
        </div>
        <nav className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.label} className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => { setActive(item.label); setMobileNav(false); }}>
              <Icon size={19}/><span>{item.label}</span>
              {item.label === 'Alertas' && <span className="nav-count">{lowStock.length}</span>}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => notify('Configurações disponíveis na versão completa.')}><Settings size={19}/><span>Configurações</span></button>
          <button className="nav-item" onClick={() => notify('Esta é uma demonstração visual.')}><LogOut size={19}/><span>Sair</span></button>
          <div className="sidebar-version"><span className="online-dot"/> Ambiente de demonstração</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Abrir menu"><Menu size={22}/></button>
          <label className="search-box">
            <Search size={19}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar produto, código ou fornecedor..." />
            {query && <button onClick={() => setQuery('')} aria-label="Limpar busca"><X size={16}/></button>}
          </label>
          <div className="top-actions">
            <button className="icon-button notification" onClick={() => setActive('Alertas')} aria-label="Notificações"><Bell size={20}/><span>{lowStock.length}</span></button>
            <div className="profile-avatar">E</div>
            <div className="profile-text"><strong>Eduardo Isaias</strong><span>Administrador</span></div>
            <ChevronDown size={16} className="profile-chevron"/>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow"><span className="online-dot"/> VISÃO GERAL</div><h1>{pageTitle}</h1><p>{pageSubtitle}</p></div>
            <div className="date-label"><div className="date-icon">▦</div><div><strong>26 de outubro de 2026</strong><span>Atualizado agora</span></div></div>
          </div>

          {active === 'Dashboard' && <>
            <section className="stats-grid">
              <StatCard icon={<Package/>} tone="blue" label="Total de Produtos" value={products.length.toString()} change="+12%" foot="em relação ao mês passado"/>
              <StatCard icon={<CircleDollarSign/>} tone="green" label="Valor do Estoque" value={money(totalValue)} change="+8%" foot="em relação ao mês passado"/>
              <StatCard icon={<AlertTriangle/>} tone="orange" label="Estoque Baixo" value={lowStock.length.toString()} change="Atenção" foot="precisam de reposição"/>
              <StatCard icon={<Clock3/>} tone="red" label="Produtos Parados" value="22" change="30+ dias" foot="sem movimentação registrada"/>
            </section>

            <section className="dashboard-grid">
              <div className="panel stock-chart-panel">
                <PanelHeader icon={<ChartNoAxesCombined/>} title="Nível de Estoque" subtitle="Visão por categoria"/>
                <div className="chart-legend"><span><i className="legend-dot green"/>Em estoque</span><span><i className="legend-dot orange"/>Estoque baixo</span><span><i className="legend-dot red"/>Crítico</span></div>
                <div className="chart">
                  <div className="y-labels"><span>50</span><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
                  <div className="chart-main">
                    {[{name:'Eletrônicos',a:42,b:24,c:12},{name:'Informática',a:30,b:17,c:10},{name:'Escritório',a:17,b:10,c:5},{name:'Limpeza',a:10,b:6,c:4},{name:'Alimentos',a:8,b:6,c:3}].map(d =>
                      <div className="bar-group" key={d.name}>
                        <div className="bar-set"><div className="bar green" style={{height:`${d.a*2.1}%`}}/><div className="bar orange" style={{height:`${d.b*2.1}%`}}/><div className="bar red" style={{height:`${d.c*2.1}%`}}/></div>
                        <span className="bar-label">{d.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="chart-footer"><span><Activity size={14}/> Dados ilustrativos para apresentação</span><button onClick={() => setActive('Relatórios')}>Ver relatório <ArrowUpRight size={14}/></button></div>
              </div>

              <div className="panel replenishment-panel">
                <PanelHeader icon={<Boxes/>} title="Reposição necessária" action="Ver todos" onAction={() => setActive('Alertas')}/>
                <div className="compact-list">
                  {lowStock.slice(0, 5).map(p => <div className="compact-product" key={p.id}>
                    <div className="product-emoji">{p.icon}</div><div className="product-info"><strong>{p.name}</strong><span>Estoque: {p.stock} <i/> Mínimo: {p.min}</span></div>
                    <button className="reorder-btn" onClick={() => restock(p)}>Repor</button>
                  </div>)}
                  {lowStock.length === 0 && <EmptyState text="Nenhum produto precisa de reposição."/>}
                </div>
                <button className="panel-bottom-link" onClick={() => setActive('Produtos')}>Gerenciar produtos <ArrowUpRight size={14}/></button>
              </div>

              <div className="panel forecast-panel">
                <PanelHeader icon={<Lightbulb/>} title="Previsão de Reposição" action="Ver todos" onAction={() => setActive('Previsão de Reposição')}/>
                <div className="forecast-list">
                  {forecasts.slice(0, 4).map(p => <div className="forecast-item" key={p.id}>
                    <div className="product-emoji large">{p.icon}</div><div className="product-info"><strong>{p.name}</strong><span>Consumo médio: {p.daily}/dia</span><span>Estoque para {p.days} dia(s)</span></div><div className="forecast-qty">{p.recommend} un.</div>
                  </div>)}
                </div>
                <div className="forecast-note"><Lightbulb size={15}/> Estimativas simuladas com base no consumo médio.</div>
              </div>
            </section>

            <section className="panel movements-panel">
              <PanelHeader icon={<ArrowLeftRight/>} title="Últimas Movimentações" action="Ver todas" onAction={() => setActive('Movimentações')}/>
              <MovementTable rows={movements}/>
            </section>
          </>}

          {active === 'Produtos' && <section className="panel full-panel">
            <div className="section-toolbar"><div><h2>Catálogo de produtos</h2><p>{filtered.length} produtos encontrados</p></div><button className="primary-btn" onClick={() => setShowAdd(true)}>＋ Novo produto</button></div>
            <div className="table-wrap"><table><thead><tr><th>Produto</th><th>SKU</th><th>Categoria</th><th>Estoque</th><th>Preço unitário</th><th>Status</th><th>Ação</th></tr></thead><tbody>
              {filtered.map(p => <tr key={p.id}><td><div className="table-product"><span className="product-emoji">{p.icon}</span><strong>{p.name}</strong></div></td><td className="muted">{p.sku}</td><td>{p.category}</td><td>{p.stock} un.</td><td>{money(p.price)}</td><td><span className={`status-pill ${p.stock <= p.min ? 'warning' : 'good'}`}>{p.stock <= p.min ? 'Estoque baixo' : 'Normal'}</span></td><td>{p.stock <= p.min && <button className="table-action" onClick={() => restock(p)}>Repor</button>}</td></tr>)}
            </tbody></table>{filtered.length === 0 && <EmptyState text="Nenhum produto encontrado para essa busca."/>}</div>
          </section>}

          {active === 'Fornecedores' && <section className="panel full-panel"><div className="section-toolbar"><div><h2>Fornecedores</h2><p>Parceiros vinculados aos produtos de demonstração</p></div><button className="primary-btn" onClick={() => notify('Cadastro de fornecedor na versão completa.')}>＋ Novo fornecedor</button></div><div className="supplier-grid">{[...new Set(products.map(p => p.supplier))].map((s,i)=><div className="supplier-card" key={s}><div className="supplier-icon"><Truck size={21}/></div><div><strong>{s}</strong><span>{products.filter(p=>p.supplier===s).length} produto(s) associado(s)</span><small>{['contato@techsolutions.com.br','vendas@papelariaforte.com.br','comercial@distribuidoraalfa.com.br','contato@modacenter.com.br','suporte@casalimpa.com.br'][i%5]}</small></div></div>)}</div></section>}

          {active === 'Movimentações' && <section className="panel full-panel"><div className="section-toolbar"><div><h2>Histórico de movimentações</h2><p>Entradas e saídas recentes do estoque</p></div><button className="primary-btn" onClick={() => notify('Registro de movimentação na versão completa.')}>＋ Nova movimentação</button></div><MovementTable rows={movements}/></section>}

          {active === 'Alertas' && <section className="panel full-panel"><div className="section-toolbar"><div><h2>Alertas de estoque</h2><p>{lowStock.length} produto(s) precisam de atenção</p></div><span className="status-pill warning">Ação recomendada</span></div><div className="alert-list">{lowStock.map(p=><div className="alert-card" key={p.id}><div className="alert-symbol"><AlertTriangle size={20}/></div><div className="alert-copy"><strong>{p.name}</strong><span>Estoque atual de {p.stock} unidades. O mínimo configurado é {p.min}.</span></div><button className="primary-btn" onClick={() => restock(p)}>Simular reposição</button></div>)}</div></section>}

          {active === 'Relatórios' && <section className="panel full-panel"><div className="section-toolbar"><div><h2>Relatórios de estoque</h2><p>Indicadores resumidos para a apresentação</p></div><button className="primary-btn" onClick={() => window.print()}>Exportar / Imprimir</button></div><div className="report-grid"><div className="report-tile"><span>Unidades em estoque</span><strong>{totalUnits}</strong><small>Somatório das quantidades cadastradas</small></div><div className="report-tile"><span>Valor estimado</span><strong>{money(totalValue)}</strong><small>Quantidade × preço unitário</small></div><div className="report-tile"><span>Produtos críticos</span><strong>{lowStock.length}</strong><small>Estoque atual menor ou igual ao mínimo</small></div></div><div className="report-callout"><ShieldCheck size={20}/><div><strong>Relatório demonstrativo</strong><span>Os dados são locais e fictícios. A versão completa pode incluir exportação CSV/PDF e filtros por período.</span></div></div></section>}

          {active === 'Previsão de Reposição' && <section className="panel full-panel"><div className="section-toolbar"><div><h2>Previsão inteligente de reposição</h2><p>Estimativas baseadas no consumo diário de cada produto</p></div><span className="status-pill info">Modelo demonstrativo</span></div><div className="forecast-table">{forecasts.map(p=><div className="forecast-row" key={p.id}><div className="table-product"><span className="product-emoji">{p.icon}</span><div><strong>{p.name}</strong><small>{p.sku}</small></div></div><div><span className="muted">Estoque atual</span><strong>{p.stock} un.</strong></div><div><span className="muted">Autonomia estimada</span><strong className={p.days <= p.lead ? 'text-red' : ''}>{p.days} dias</strong></div><div><span className="muted">Sugestão de compra</span><strong>{p.recommend} un.</strong></div></div>)}</div><div className="report-callout"><Lightbulb size={20}/><div><strong>Como a estimativa funciona</strong><span>Autonomia = estoque atual ÷ consumo médio diário. A sugestão considera o prazo de entrega e uma margem de segurança de 3 dias. Os dados são fictícios para a apresentação.</span></div></div></section>}
        </div>
        <footer className="footer"><span>© 2026 StockPro</span><span><span className="online-dot"/> Protótipo de apresentação · Dados fictícios</span></footer>
      </main>

      {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-heading"><div><h2>Novo produto</h2><p>Adicione um item à demonstração</p></div><button className="icon-button" onClick={() => setShowAdd(false)}><X size={19}/></button></div><form onSubmit={addProduct}><label>Nome do produto<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex.: Monitor 24 polegadas"/></label><div className="form-row"><label>Código SKU<input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} placeholder="Ex.: INF-003"/></label><label>Categoria<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Informática</option><option>Escritório</option><option>Alimentos</option><option>Limpeza</option><option>Vestuário</option></select></label></div><div className="form-row"><label>Quantidade<input type="number" min="0" required value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="0"/></label><label>Estoque mínimo<input type="number" min="0" required value={form.min} onChange={e=>setForm({...form,min:e.target.value})} placeholder="5"/></label></div><label>Preço unitário (R$)<input type="number" min="0" step="0.01" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="0,00"/></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowAdd(false)}>Cancelar</button><button type="submit" className="primary-btn">Cadastrar produto</button></div></form></div></div>}
      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  );
}

function StatCard({icon,tone,label,value,change,foot}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-body"><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><div className={`stat-change ${tone === 'red' || tone === 'orange' ? 'negative' : ''}`}>{tone === 'green' || tone === 'blue' ? <ArrowUpRight size={14}/> : tone === 'orange' ? <AlertTriangle size={13}/> : <Clock3 size={13}/>} {change}</div><span className="stat-foot">{foot}</span></div></div>
}

function PanelHeader({icon,title,subtitle,action,onAction}) {
  return <div className="panel-header"><div className="panel-title-icon">{icon}</div><div className="panel-heading-text"><h2>{title}</h2>{subtitle && <span>{subtitle}</span>}</div>{action && <button className="text-link" onClick={onAction}>{action} <ArrowUpRight size={13}/></button>}</div>
}

function MovementTable({rows}) {
  return <div className="table-wrap"><table><thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Quantidade</th><th>Fornecedor</th><th>Usuário</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td className="muted nowrap">{r.date}</td><td><strong>{r.product}</strong></td><td><span className={`movement-pill ${r.type === 'Entrada' ? 'entry' : 'exit'}`}>{r.type === 'Entrada' ? <ArrowDownLeft size={13}/> : <ArrowUpRight size={13}/>} {r.type}</span></td><td className={r.type === 'Entrada' ? 'text-green' : 'text-red'}><strong>{r.qty}</strong></td><td>{r.supplier}</td><td>{r.user}</td></tr>)}</tbody></table></div>
}

function EmptyState({text}) { return <div className="empty-state"><Package size={24}/><span>{text}</span></div> }

createRoot(document.getElementById('root')).render(<App />);
