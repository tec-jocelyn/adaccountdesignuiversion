import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, Plus, FileText } from 'lucide-react';
import type { TreeNode } from '../App';

interface AssetTreeProps {
  treeData: TreeNode[];
  onSelectItem: (item: { type: 'folder' | 'account'; data: any }) => void;
}

export function AssetTree({ treeData, onSelectItem }: AssetTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['tiktok', 'tiktok-ad-accounts']));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (node: TreeNode) => {
    setSelectedNodeId(node.id);
    
    if (node.type === 'account' && node.data) {
      onSelectItem({ type: 'account', data: node.data });
    } else if ((node.type === 'folder' || node.type === 'asset-type') && node.children) {
      // 递归获取文件夹下所有账户
      const getAllAccounts = (nodes: TreeNode[]): any[] => {
        let accounts: any[] = [];
        nodes.forEach(n => {
          if (n.type === 'account' && n.data) {
            accounts.push(n.data);
          } else if (n.children) {
            accounts = [...accounts, ...getAllAccounts(n.children)];
          }
        });
        return accounts;
      };
      
      const accounts = getAllAccounts(node.children);
      
      onSelectItem({
        type: 'folder',
        data: {
          name: node.name,
          accounts,
        },
      });
    }
  };

  // 将营业执照节点从主列表中分离
  const platformNodes = treeData.filter(node => node.type !== 'license');
  const licenseNode = treeData.find(node => node.type === 'license');

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors ${
            isSelected ? 'bg-zinc-800' : ''
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => {
            if (hasChildren && node.type !== 'license-file') {
              toggleNode(node.id);
            }
            if (node.type === 'folder' || node.type === 'account' || node.type === 'asset-type') {
              handleNodeClick(node);
            }
          }}
        >
          {hasChildren && node.type !== 'license' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="text-zinc-500 hover:text-zinc-300"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-4" />
          )}
          
          {node.type === 'platform' && (
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-xs">
              {node.name[0]}
            </div>
          )}
          {node.type === 'asset-type' && (
            <Folder size={16} className="text-blue-400" />
          )}
          {node.type === 'folder' && (
            <Folder size={16} className="text-yellow-500" />
          )}
          {node.type === 'account' && (
            <File size={16} className="text-zinc-400" />
          )}
          {node.type === 'license' && (
            <Folder size={16} className="text-orange-500" />
          )}
          {node.type === 'license-file' && (
            <FileText size={16} className="text-orange-400" />
          )}
          
          <span className="text-sm flex-1">{node.name}</span>
          
          {(node.type === 'folder' || node.type === 'asset-type') && node.children && node.children.length > 0 && (
            <span className="text-xs text-zinc-500">
              {node.children.length}
            </span>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2>资产管理</h2>
          <p className="text-zinc-500 text-xs mt-1">账户资产树状视图</p>
        </div>
        <button className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
          <Plus size={16} />
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto">
        {/* 平台节点 */}
        {platformNodes.map((node) => renderNode(node))}
        
        {/* 营业执照节点（固定在底部） */}
        {licenseNode && (
          <div className="mt-4 border-t border-zinc-800 pt-2">
            {renderNode(licenseNode)}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-zinc-800">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl">29</div>
            <div className="text-xs text-zinc-500">总账户数</div>
          </div>
          <div>
            <div className="text-2xl text-green-400">24</div>
            <div className="text-xs text-zinc-500">正常运行</div>
          </div>
        </div>
      </div>
    </div>
  );
}