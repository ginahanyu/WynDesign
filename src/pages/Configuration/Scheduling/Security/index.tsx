import { useState, ReactNode, useRef, useEffect } from 'react'
import {
  ClockCircleOutlined,
  SnippetsOutlined,
  CloudServerOutlined,
  SafetyOutlined,
  PlusOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  UserOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { authorizationStore } from '@/store/authorizationStore'
import './Security.css'

interface MenuItem {
  key: string
  label: string
  icon: ReactNode
  count?: number
}

interface Authorization {
  id: string
  userId: string
  userName: string
  createTask: boolean
}

interface OrgNode {
  id: string
  name: string
  type: 'org' | 'user'
  children?: OrgNode[]
}

const menuItems: MenuItem[] = [
  { key: 'schedule-settings', label: 'Schedule Settings', icon: <ClockCircleOutlined /> },
  { key: 'task-templates', label: 'Task Templates', icon: <SnippetsOutlined />, count: 15 },
  { key: 'external-storage', label: 'External Storage', icon: <CloudServerOutlined />, count: 0 },
  { key: 'security', label: 'Security', icon: <SafetyOutlined /> },
]

// 模拟组织树数据
const orgTree: OrgNode[] = [
  {
    id: 'grapecity',
    name: 'grapecity',
    type: 'org',
    children: [
      {
        id: 'xian',
        name: 'Xian',
        type: 'org',
        children: [
          {
            id: 'dd1',
            name: 'DD1',
            type: 'org',
            children: [
              { id: 'user1', name: 'user1-DD1', type: 'user' },
            ],
          },
          {
            id: 'dd3',
            name: 'DD3',
            type: 'org',
            children: [
              { id: 'user2', name: 'user2-DD3', type: 'user' },
              { id: 'user3', name: 'user3-DD3', type: 'user' },
            ],
          },
        ],
      },
    ],
  },
]

// 树形节点组件
function OrgTreeNode({
  node,
  level,
  expandedNodes,
  onToggle,
  onSelect,
}: {
  node: OrgNode
  level: number
  expandedNodes: Set<string>
  onToggle: (id: string) => void
  onSelect: (id: string, name: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)
  const isOrg = node.type === 'org'

  return (
    <div className="org-tree-node">
      <div
        className={`org-tree-item ${isOrg ? 'org-item' : 'user-item'}`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => {
          if (isOrg && hasChildren) {
            onToggle(node.id)
          } else if (!isOrg) {
            onSelect(node.id, node.name)
          }
        }}
      >
        {isOrg && hasChildren && (
          <span className="org-tree-arrow">
            {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
          </span>
        )}
        {isOrg && !hasChildren && <span className="org-tree-arrow-placeholder" />}
        <span className="org-tree-icon">
          {isOrg ? <ApartmentOutlined /> : <UserOutlined />}
        </span>
        <span className="org-tree-label">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="org-tree-children">
          {node.children!.map((child) => (
            <OrgTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 搜索过滤树节点
function filterOrgTree(nodes: OrgNode[], keyword: string): OrgNode[] {
  if (!keyword.trim()) return nodes

  const lowerKeyword = keyword.toLowerCase()

  const filterNode = (node: OrgNode): OrgNode | null => {
    // 如果是用户节点，检查名称是否匹配
    if (node.type === 'user') {
      return node.name.toLowerCase().includes(lowerKeyword) ? node : null
    }

    // 如果是组织节点，递归过滤子节点
    if (node.children) {
      const filteredChildren = node.children
        .map((child) => filterNode(child))
        .filter((child): child is OrgNode => child !== null)

      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren }
      }
    }

    return null
  }

  return nodes.map((node) => filterNode(node)).filter((node): node is OrgNode => node !== null)
}

// 获取所有组织节点ID（用于搜索时展开所有节点）
function getAllOrgIds(nodes: OrgNode[]): string[] {
  const ids: string[] = []
  const traverse = (node: OrgNode) => {
    if (node.type === 'org') {
      ids.push(node.id)
    }
    node.children?.forEach(traverse)
  }
  nodes.forEach(traverse)
  return ids
}

// 用户选择器组件
function UserTreeSelect({
  value,
  displayName,
  onChange,
}: {
  value: string
  displayName: string
  onChange: (userId: string, userName: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['grapecity', 'xian']))
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // 搜索时展开所有匹配的节点
  useEffect(() => {
    if (searchKeyword.trim()) {
      const filteredTree = filterOrgTree(orgTree, searchKeyword)
      const allIds = getAllOrgIds(filteredTree)
      setExpandedNodes(new Set(allIds))
    }
  }, [searchKeyword])

  const handleToggle = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelect = (userId: string, userName: string) => {
    onChange(userId, userName)
    setIsOpen(false)
    setSearchKeyword('')
  }

  const filteredTree = filterOrgTree(orgTree, searchKeyword)

  return (
    <div className="user-tree-select" ref={containerRef}>
      <div className="user-tree-select-input" onClick={() => setIsOpen(!isOpen)}>
        <span className={displayName ? '' : 'placeholder'}>
          {displayName || '-- Select User --'}
        </span>
        <CaretDownOutlined className="user-tree-select-arrow" />
      </div>
      {isOpen && (
        <div className="user-tree-select-dropdown">
          <div className="user-tree-search">
            <SearchOutlined className="user-tree-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="user-tree-search-input"
              placeholder="Search user..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="user-tree-list">
            {filteredTree.length === 0 ? (
              <div className="user-tree-empty">No results found</div>
            ) : (
              filteredTree.map((node) => (
                <OrgTreeNode
                  key={node.id}
                  node={node}
                  level={0}
                  expandedNodes={expandedNodes}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SecurityContent() {
  const [authorizations, setAuthorizations] = useState<Authorization[]>([])

  // 同步授权用户到 store
  useEffect(() => {
    const usersWithNames = authorizations
      .filter(auth => auth.userId && auth.userName)
      .map(auth => ({ userId: auth.userId, userName: auth.userName }))
    authorizationStore.setUsers(usersWithNames)
  }, [authorizations])

  const handleAdd = () => {
    const newAuth: Authorization = {
      id: Date.now().toString(),
      userId: '',
      userName: '',
      createTask: false,
    }
    setAuthorizations([...authorizations, newAuth])
  }

  const handleDelete = (id: string) => {
    setAuthorizations(authorizations.filter((auth) => auth.id !== id))
  }

  const handleUserChange = (id: string, userId: string, userName: string) => {
    setAuthorizations(
      authorizations.map((auth) => (auth.id === id ? { ...auth, userId, userName } : auth))
    )
  }

  const handlePermissionChange = (id: string, checked: boolean) => {
    setAuthorizations(
      authorizations.map((auth) => (auth.id === id ? { ...auth, createTask: checked } : auth))
    )
  }

  return (
    <div className="security-authorization">
      <div className="security-authorization-toolbar">
        <button className="security-add-btn" onClick={handleAdd}>
          <PlusOutlined /> Add Authorization
        </button>
      </div>
      <table className="security-authorization-table">
        <thead>
          <tr>
            <th>Authorize To</th>
            <th>Operations</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {authorizations.length === 0 ? (
            <tr>
              <td colSpan={3} className="security-table-empty">
                No authorization records. Click "Add Authorization" to add.
              </td>
            </tr>
          ) : (
            authorizations.map((auth) => (
              <tr key={auth.id}>
                <td>
                  <UserTreeSelect
                    value={auth.userId}
                    displayName={auth.userName}
                    onChange={(userId, userName) => handleUserChange(auth.id, userId, userName)}
                  />
                </td>
                <td>
                  <label className="security-checkbox-label">
                    <input
                      type="checkbox"
                      checked={auth.createTask}
                      onChange={(e) => handlePermissionChange(auth.id, e.target.checked)}
                    />
                    Create Task
                  </label>
                </td>
                <td>
                  <button
                    className="security-delete-btn"
                    onClick={() => handleDelete(auth.id)}
                  >
                    <DeleteOutlined />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Security() {
  const [activeMenu, setActiveMenu] = useState('security')

  const getTitle = (key: string) => {
    switch (key) {
      case 'schedule-settings':
        return { title: 'SCHEDULE SETTINGS', subtitle: 'Schedule settings management' }
      case 'task-templates':
        return { title: 'TASK TEMPLATES', subtitle: 'Task templates management' }
      case 'external-storage':
        return { title: 'EXTERNAL STORAGE', subtitle: 'External storage management' }
      case 'security':
        return { title: 'SECURITY', subtitle: 'Security management' }
      default:
        return { title: '', subtitle: '' }
    }
  }

  const { title, subtitle } = getTitle(activeMenu)
  const activeItem = menuItems.find((item) => item.key === activeMenu)

  const renderContent = () => {
    switch (activeMenu) {
      case 'security':
        return <SecurityContent />
      default:
        return null
    }
  }

  return (
    <div className="security-page">
      <div className="security-sidebar">
        <div className="security-sidebar-title">Scheduling</div>
        <ul className="security-menu">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`security-menu-item ${activeMenu === item.key ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.key)}
            >
              <span className="security-menu-icon">{item.icon}</span>
              <span className="security-menu-label">{item.label}</span>
              {item.count !== undefined && (
                <span className="security-menu-count">{item.count}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="security-content">
        <div className="security-content-header">
          <span className="security-content-icon">{activeItem?.icon}</span>
          <span className="security-content-title">{title}</span>
          <span className="security-content-subtitle">{subtitle}</span>
        </div>
        <div className="security-content-body">{renderContent()}</div>
      </div>
    </div>
  )
}
