import React, { useState } from 'react';
import { Plus, DollarSign, Minus, RotateCcw, Link, Mail, Edit, Tag, Eye, MoreHorizontal, Settings2, ChevronDown, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import type { Account } from '../App';

interface DetailPanelProps {
  selectedItem: {
    type: 'folder' | 'account';
    data: any;
  } | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

type ActionType = 'recharge' | 'deduct' | 'clear' | 'bindBC' | 'bindEmail' | 'rename' | 'tag' | 'createView' | null;

interface ColumnConfig {
  key: keyof Account | 'select' | 'actions';
  label: string;
  visible: boolean;
}

export function DetailPanel({ selectedItem, isCollapsed, onToggleCollapse }: DetailPanelProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [filterIdOrName, setFilterIdOrName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [actionAmount, setActionAmount] = useState('');

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'select', label: '', visible: true },
    { key: 'id', label: '账户ID', visible: true },
    { key: 'name', label: '账户名称', visible: true },
    { key: 'applyStatus', label: '账户申请状态', visible: true },
    { key: 'status', label: '账户状态', visible: true },
    { key: 'balance', label: '账户余额', visible: true },
    { key: 'consumption', label: '账户消耗', visible: true },
    { key: 'giftAmount', label: '账户赠金', visible: true },
    { key: 'currency', label: '币种', visible: true },
    { key: 'timezone', label: '时区', visible: false },
    { key: 'companyName', label: '开户公司名称', visible: true },
    { key: 'actions', label: '操作', visible: true },
  ]);

  if (!selectedItem) {
    return (
      <div className="flex-1 bg-zinc-950 flex items-center justify-center">
        <div className="text-center text-zinc-500">
          <Plus size={48} className="mx-auto mb-4 opacity-50" />
          <p>请在左侧选择账户或文件夹</p>
          <p className="text-sm mt-2">查看详细信息或批量管理</p>
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'account') {
    const account: Account = selectedItem.data;
    
    return (
      <div className="flex-1 bg-zinc-950 flex flex-col">
        {/* Account Detail View - Keep existing implementation */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl mb-2">{account.name}</h1>
              <p className="text-zinc-500">{account.id}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-lg text-sm ${
                account.status === '正常'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-yellow-500/10 text-yellow-400'
              }`}
            >
              {account.status}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign size={20} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-zinc-500 text-sm">账户余额</div>
                    <div className="text-xl text-green-400">${account.balance}</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <RotateCcw size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-zinc-500 text-sm">账户消耗</div>
                    <div className="text-xl">${account.consumption || '0.00'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Tag size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-zinc-500 text-sm">账户赠金</div>
                    <div className="text-xl text-purple-400">${account.giftAmount || '0.00'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg mb-4">账户属性</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-zinc-500 text-sm">账户ID</label>
                  <div className="mt-1 text-blue-400">{account.id}</div>
                </div>
                <div>
                  <label className="text-zinc-500 text-sm">账户名称</label>
                  <div className="mt-1">{account.name}</div>
                </div>
                <div>
                  <label className="text-zinc-500 text-sm">账户申请状态</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 rounded text-xs ${
                      account.applyStatus === '已开通'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {account.applyStatus || '未知'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-zinc-500 text-sm">账户状态</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 rounded text-xs ${
                      account.status === '正常'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-zinc-500 text-sm">广告平台</label>
                  <div className="mt-1">{account.platform}</div>
                </div>
                <div>
                  <label className="text-zinc-500 text-sm">币种</label>
                  <div className="mt-1">{account.currency}</div>
                </div>
                <div>
                  <label className="text-zinc-500 text-sm">时区</label>
                  <div className="mt-1">{account.timezone}</div>
                </div>
                <div>
                  <label className="text-zinc-500 text-sm">开户公司名称</label>
                  <div className="mt-1">{account.companyName || '未设置'}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors">
                <DollarSign size={16} />
                充值
              </button>
              <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center gap-2 transition-colors">
                <Edit size={16} />
                编辑
              </button>
              <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center gap-2 transition-colors">
                <Link size={16} />
                绑定BC
              </button>
              <button className="px-6 py-3 bg-red-600/10 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors">
                删除账户
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Folder view with table
  const { name, accounts } = selectedItem.data;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccounts(new Set(filteredAccounts.map(acc => acc.id)));
    } else {
      setSelectedAccounts(new Set());
    }
  };

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    const newSet = new Set(selectedAccounts);
    if (checked) {
      newSet.add(accountId);
    } else {
      newSet.delete(accountId);
    }
    setSelectedAccounts(newSet);
  };

  const toggleColumnVisibility = (key: string) => {
    setColumns(columns.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((account: Account) => {
    const matchIdOrName = !filterIdOrName || 
      account.id.toLowerCase().includes(filterIdOrName.toLowerCase()) ||
      account.name.toLowerCase().includes(filterIdOrName.toLowerCase());
    
    const matchStatus = !filterStatus || account.status === filterStatus;
    
    return matchIdOrName && matchStatus;
  });

  const handleActionSubmit = () => {
    // Handle action submission
    console.log('Action:', activeAction, 'Amount:', actionAmount, 'Accounts:', selectedAccounts);
    setActiveAction(null);
    setActionAmount('');
  };

  // Action Form Modal
  const ActionModal = () => {
    if (!activeAction) return null;

    const actionTitles: Record<string, string> = {
      recharge: '充值',
      deduct: '减款',
      clear: '清零',
      bindBC: '绑定BC',
      bindEmail: '绑定邮箱',
      rename: '更名',
      tag: '贴标签',
      createView: '创建视图',
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-zinc-900 rounded-lg p-6 w-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">{actionTitles[activeAction]}</h3>
            <button onClick={() => setActiveAction(null)} className="text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-2">
                已选择 {selectedAccounts.size} 个账户
              </label>
            </div>

            {(activeAction === 'recharge' || activeAction === 'deduct') && (
              <div>
                <label className="text-sm text-zinc-400 block mb-2">金额</label>
                <input
                  type="number"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入金额"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeAction === 'bindBC' && (
              <div>
                <label className="text-sm text-zinc-400 block mb-2">BC账号</label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入BC账号"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeAction === 'bindEmail' && (
              <div>
                <label className="text-sm text-zinc-400 block mb-2">邮箱地址</label>
                <input
                  type="email"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入邮箱地址"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeAction === 'rename' && (
              <div>
                <label className="text-sm text-zinc-400 block mb-2">新名称</label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入新名称"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeAction === 'tag' && (
              <div>
                <label className="text-sm text-zinc-400 block mb-2">标签</label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入标签"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeAction === 'createView' && (
              <div>
                <label className="text-sm text-zinc-400 block mb-2">视图名称</label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="请输入视图名称"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleActionSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                确认
              </button>
              <button
                onClick={() => setActiveAction(null)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-zinc-950 flex flex-col relative">
      {/* Collapse/Expand Button for DetailPanel */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-4 left-2 z-20 w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded flex items-center justify-center transition-colors border border-zinc-700"
          title={isCollapsed ? '展开' : '收起'}
        >
          {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}

      {!isCollapsed && (
        <>
          {/* Header */}
          <div className="p-6 border-b border-zinc-800">
            <h1 className="text-2xl mb-2">{name}</h1>
            <p className="text-zinc-500">共 {accounts.length} 个账户</p>
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 border-b border-zinc-800 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveAction('recharge')}
              disabled={selectedAccounts.size === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <DollarSign size={16} />
              充值
            </button>
            <button
              onClick={() => setActiveAction('deduct')}
              disabled={selectedAccounts.size === 0}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:text-zinc-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Minus size={16} />
              减款
            </button>
            <button
              onClick={() => setActiveAction('clear')}
              disabled={selectedAccounts.size === 0}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:text-zinc-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RotateCcw size={16} />
              清零
            </button>
            <button
              onClick={() => setActiveAction('bindBC')}
              disabled={selectedAccounts.size === 0}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:text-zinc-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Link size={16} />
              绑定BC
            </button>
            <button
              onClick={() => setActiveAction('bindEmail')}
              disabled={selectedAccounts.size === 0}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:text-zinc-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Mail size={16} />
              绑定邮箱
            </button>
            <button
              onClick={() => setActiveAction('rename')}
              disabled={selectedAccounts.size === 0}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:text-zinc-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit size={16} />
              更名
            </button>
            <button
              onClick={() => setActiveAction('tag')}
              disabled={selectedAccounts.size === 0}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:text-zinc-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Tag size={16} />
              贴标签
            </button>
            <button
              onClick={() => setActiveAction('createView')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              创建视图
            </button>
          </div>

          {/* Filter Bar */}
          <div className="px-6 py-4 border-b border-zinc-800 space-y-3">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={filterIdOrName}
                onChange={(e) => setFilterIdOrName(e.target.value)}
                placeholder="搜索账户ID/名称"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">全部状态</option>
                <option value="正常">正常</option>
                <option value="暂停">暂停</option>
              </select>
              <button
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <Settings2 size={16} />
                高级筛选
                <ChevronDown size={16} className={`transition-transform ${showAdvancedFilter ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setShowColumnConfig(!showColumnConfig)}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <Eye size={16} />
                列设置
              </button>
            </div>

            {showColumnConfig && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400 mb-3">选择要显示的列</p>
                <div className="grid grid-cols-4 gap-3">
                  {columns.filter(col => col.key !== 'select' && col.key !== 'actions').map(col => (
                    <label key={col.key} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-400">
                      <input
                        type="checkbox"
                        checked={col.visible}
                        onChange={() => toggleColumnVisibility(col.key)}
                        className="rounded"
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-zinc-900 z-10">
                <tr className="border-b border-zinc-800">
                  {columns.filter(col => col.visible).map(col => (
                    <th key={col.key} className="text-left py-3 px-4 text-sm text-zinc-400">
                      {col.key === 'select' ? (
                        <input
                          type="checkbox"
                          checked={selectedAccounts.size === filteredAccounts.length && filteredAccounts.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded"
                        />
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account: Account) => (
                  <tr
                    key={account.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
                  >
                    {columns.filter(col => col.visible).map(col => {
                      if (col.key === 'select') {
                        return (
                          <td key="select" className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedAccounts.has(account.id)}
                              onChange={(e) => handleSelectAccount(account.id, e.target.checked)}
                              className="rounded"
                            />
                          </td>
                        );
                      }
                      
                      if (col.key === 'actions') {
                        return (
                          <td key="actions" className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedAccounts(new Set([account.id]));
                                  setActiveAction('recharge');
                                }}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                充值
                              </button>
                              <button className="text-zinc-400 hover:text-white text-sm">
                                详情
                              </button>
                              <button className="text-zinc-400 hover:text-white">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </td>
                        );
                      }

                      const value = account[col.key as keyof Account];
                      
                      if (col.key === 'id') {
                        return <td key={col.key} className="py-3 px-4 text-sm text-blue-400">{value}</td>;
                      }
                      
                      if (col.key === 'status') {
                        return (
                          <td key={col.key} className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-1 rounded text-xs ${
                                value === '正常'
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-yellow-500/10 text-yellow-400'
                              }`}
                            >
                              {value}
                            </span>
                          </td>
                        );
                      }

                      if (col.key === 'applyStatus') {
                        return (
                          <td key={col.key} className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-1 rounded text-xs ${
                                value === '已开通'
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-blue-500/10 text-blue-400'
                              }`}
                            >
                              {value || '未知'}
                            </span>
                          </td>
                        );
                      }

                      if (col.key === 'balance' || col.key === 'consumption' || col.key === 'giftAmount') {
                        return (
                          <td key={col.key} className="py-3 px-4 text-sm">
                            ${value || '0.00'}
                          </td>
                        );
                      }

                      return (
                        <td key={col.key} className="py-3 px-4 text-sm">
                          {value || '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="text-zinc-500 text-sm mb-1">总账户数</div>
                <div className="text-2xl">{filteredAccounts.length}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-sm mb-1">已选择</div>
                <div className="text-2xl text-blue-400">{selectedAccounts.size}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-sm mb-1">总余额</div>
                <div className="text-2xl text-green-400">
                  ${filteredAccounts.reduce((sum: number, acc: Account) => sum + parseFloat(acc.balance || '0'), 0).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-zinc-500 text-sm mb-1">正常账户</div>
                <div className="text-2xl text-green-400">
                  {filteredAccounts.filter((acc: Account) => acc.status === '正常').length}
                </div>
              </div>
            </div>
          </div>

          {/* Action Modal */}
          <ActionModal />
        </>
      )}
    </div>
  );
}