import { useState, ReactNode, useRef, useEffect } from 'react'
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  PlusOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  SearchOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { authorizationStore } from '@/store/authorizationStore'
import './Security.css'

interface MenuItem {
  key: string
  label: string
  icon: ReactNode
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
  { key: 'personal-information', label: 'Personal Information', icon: <UserOutlined /> },
  { key: 'preference', label: 'Preference', icon: <TeamOutlined /> },
  { key: 'change-password', label: 'Change Password', icon: <TeamOutlined /> },
  { key: 'security', label: 'Security', icon: <SafetyOutlined /> },
]

// 模拟组织树数据
const orgTree: OrgNode[] = [
  {
    id: 'grapecity',
    name: 'GrapeCity',
    type: 'org',
    children: [
      {
        id: 'xian',
        name: 'Xi\'an Branch',
        type: 'org',
        children: [
          { id: 'user-xian-1', name: 'Zhang Wei', type: 'user' },
          { id: 'user-xian-2', name: 'Li Ming', type: 'user' },
          { id: 'user-xian-3', name: 'Wang Fang', type: 'user' },
          {
            id: 'dd1',
            name: 'Development Dept 1',
            type: 'org',
            children: [
              { id: 'user-dd1-1', name: 'Chen Yang', type: 'user' },
              { id: 'user-dd1-2', name: 'Liu Xiao', type: 'user' },
              { id: 'user-dd1-3', name: 'Zhao Jun', type: 'user' },
              { id: 'user-dd1-4', name: 'Sun Lei', type: 'user' },
              { id: 'user-dd1-5', name: 'Zhou Ping', type: 'user' },
              { id: 'user-dd1-6', name: 'Qian Wei', type: 'user' },
              { id: 'user-dd1-7', name: 'Wang Jian', type: 'user' },
              { id: 'user-dd1-8', name: 'Li Qiang', type: 'user' },
              { id: 'user-dd1-9', name: 'Zhang Hui', type: 'user' },
              { id: 'user-dd1-10', name: 'Xu Dong', type: 'user' },
              { id: 'user-dd1-11', name: 'He Fang', type: 'user' },
              { id: 'user-dd1-12', name: 'Gao Ming', type: 'user' },
              { id: 'user-dd1-13', name: 'Lin Tao', type: 'user' },
              { id: 'user-dd1-14', name: 'Huang Lei', type: 'user' },
              { id: 'user-dd1-15', name: 'Wu Yong', type: 'user' },
            ],
          },
          {
            id: 'dd2',
            name: 'Development Dept 2',
            type: 'org',
            children: [
              { id: 'user-dd2-1', name: 'Wu Hua', type: 'user' },
              { id: 'user-dd2-2', name: 'Zheng Kai', type: 'user' },
              { id: 'user-dd2-3', name: 'Huang Tao', type: 'user' },
            ],
          },
          {
            id: 'dd3',
            name: 'Development Dept 3',
            type: 'org',
            children: [
              { id: 'user-dd3-1', name: 'Lin Jie', type: 'user' },
              { id: 'user-dd3-2', name: 'He Ying', type: 'user' },
              { id: 'user-dd3-3', name: 'Guo Qiang', type: 'user' },
              { id: 'user-dd3-4', name: 'Ma Li', type: 'user' },
            ],
          },
          {
            id: 'qa',
            name: 'QA Team',
            type: 'org',
            children: [
              { id: 'user-qa-1', name: 'Xu Mei', type: 'user' },
              { id: 'user-qa-2', name: 'Luo Dan', type: 'user' },
              { id: 'user-qa-3', name: 'Jiang Bo', type: 'user' },
              { id: 'user-qa-4', name: 'Cao Yu', type: 'user' },
              { id: 'user-qa-5', name: 'Tang Xin', type: 'user' },
              { id: 'user-qa-6', name: 'Deng Hui', type: 'user' },
            ],
          },
        ],
      },
      {
        id: 'beijing',
        name: 'Beijing Branch',
        type: 'org',
        children: [
          { id: 'user-bj-1', name: 'Feng Chao', type: 'user' },
          { id: 'user-bj-2', name: 'Song Yan', type: 'user' },
          {
            id: 'bj-sales',
            name: 'Sales Team',
            type: 'org',
            children: [
              { id: 'user-bj-sales-1', name: 'Pan Wei', type: 'user' },
              { id: 'user-bj-sales-2', name: 'Ye Ting', type: 'user' },
              { id: 'user-bj-sales-3', name: 'Han Dong', type: 'user' },
              { id: 'user-bj-sales-4', name: 'Shen Li', type: 'user' },
            ],
          },
          {
            id: 'bj-marketing',
            name: 'Marketing Team',
            type: 'org',
            children: [
              { id: 'user-bj-mkt-1', name: 'Du Fei', type: 'user' },
              { id: 'user-bj-mkt-2', name: 'Xie Jing', type: 'user' },
              { id: 'user-bj-mkt-3', name: 'Zhu Rui', type: 'user' },
            ],
          },
        ],
      },
      {
        id: 'shanghai',
        name: 'Shanghai Branch',
        type: 'org',
        children: [
          { id: 'user-sh-1', name: 'Qian Hao', type: 'user' },
          {
            id: 'sh-support',
            name: 'Support Team',
            type: 'org',
            children: [
              { id: 'user-sh-sup-1', name: 'Gu Fang', type: 'user' },
              { id: 'user-sh-sup-2', name: 'Meng Jia', type: 'user' },
              { id: 'user-sh-sup-3', name: 'Bai Xue', type: 'user' },
              { id: 'user-sh-sup-4', name: 'Shi Tong', type: 'user' },
              { id: 'user-sh-sup-5', name: 'Ren Yi', type: 'user' },
            ],
          },
          {
            id: 'sh-finance',
            name: 'Finance Team',
            type: 'org',
            children: [
              { id: 'user-sh-fin-1', name: 'Hou Min', type: 'user' },
              { id: 'user-sh-fin-2', name: 'Kong Ling', type: 'user' },
            ],
          },
        ],
      },
      {
        id: 'hangzhou',
        name: 'Hangzhou Branch',
        type: 'org',
        children: [
          { id: 'user-hz-1', name: 'Wan Jun', type: 'user' },
          { id: 'user-hz-2', name: 'Yan Fei', type: 'user' },
          { id: 'user-hz-3', name: 'Lu Chen', type: 'user' },
          {
            id: 'hz-rd',
            name: 'R&D Center',
            type: 'org',
            children: [
              { id: 'user-hz-rd-1', name: 'Cui Gang', type: 'user' },
              { id: 'user-hz-rd-2', name: 'Fan Hua', type: 'user' },
              { id: 'user-hz-rd-3', name: 'Yin Jie', type: 'user' },
              { id: 'user-hz-rd-4', name: 'Qiu Lan', type: 'user' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mescius',
    name: 'MESCIUS',
    type: 'org',
    children: [
      {
        id: 'mescius-us',
        name: 'US Office',
        type: 'org',
        children: [
          { id: 'user-us-1', name: 'John Smith', type: 'user' },
          { id: 'user-us-2', name: 'Emily Davis', type: 'user' },
          { id: 'user-us-3', name: 'Michael Johnson', type: 'user' },
          { id: 'user-us-4', name: 'Sarah Wilson', type: 'user' },
        ],
      },
      {
        id: 'mescius-jp',
        name: 'Japan Office',
        type: 'org',
        children: [
          { id: 'user-jp-1', name: 'Tanaka Yuki', type: 'user' },
          { id: 'user-jp-2', name: 'Suzuki Hana', type: 'user' },
          { id: 'user-jp-3', name: 'Yamamoto Ken', type: 'user' },
        ],
      },
    ],
  },
]

// 树形节点组件（仅组织节点，不包含用户）
function OrgTreeNode({
  node,
  level,
  expandedNodes,
  selectedOrgId,
  onToggle,
  onSelectOrg,
}: {
  node: OrgNode
  level: number
  expandedNodes: Set<string>
  selectedOrgId: string
  onToggle: (id: string) => void
  onSelectOrg: (org: OrgNode) => void
}) {
  const hasOrgChildren = node.children?.some(child => child.type === 'org')
  const isExpanded = expandedNodes.has(node.id)
  const isSelected = selectedOrgId === node.id

  return (
    <div className="org-tree-node">
      <div
        className={`org-tree-item org-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasOrgChildren && (
          <span
            className="org-tree-arrow"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
          </span>
        )}
        {!hasOrgChildren && <span className="org-tree-arrow-placeholder" />}
        <span
          className="org-tree-content"
          onClick={() => onSelectOrg(node)}
        >
          <span className="org-tree-icon">
            <ApartmentOutlined />
          </span>
          <span className="org-tree-label">{node.name}</span>
        </span>
      </div>
      {hasOrgChildren && isExpanded && (
        <div className="org-tree-children">
          {node.children!
            .filter(child => child.type === 'org')
            .map((child) => (
              <OrgTreeNode
                key={child.id}
                node={child}
                level={level + 1}
                expandedNodes={expandedNodes}
                selectedOrgId={selectedOrgId}
                onToggle={onToggle}
                onSelectOrg={onSelectOrg}
              />
            ))}
        </div>
      )}
    </div>
  )
}

// 过滤组织树（仅保留组织节点）
function filterOrgTreeByKeyword(nodes: OrgNode[], keyword: string): OrgNode[] {
  if (!keyword.trim()) return nodes

  const lowerKeyword = keyword.toLowerCase()

  const filterNode = (node: OrgNode): OrgNode | null => {
    if (node.type !== 'org') return null

    // 检查当前组织名称是否匹配
    const nameMatches = node.name.toLowerCase().includes(lowerKeyword)

    // 递归过滤子组织节点
    const filteredChildren = node.children
      ?.map(child => filterNode(child))
      .filter((child): child is OrgNode => child !== null) || []

    // 如果名称匹配或有匹配的子节点，则保留
    if (nameMatches || filteredChildren.length > 0) {
      return {
        ...node,
        children: nameMatches ? node.children : filteredChildren
      }
    }

    return null
  }

  return nodes.map(node => filterNode(node)).filter((node): node is OrgNode => node !== null)
}

// 获取组织下的直接用户（不包括子组织的用户）
function getUsersFromOrg(org: OrgNode): OrgNode[] {
  return org.children?.filter(child => child.type === 'user') || []
}

// 获取所有组织节点ID
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

// 用户选择器组件 - 左右两栏布局
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
  const [orgSearchKeyword, setOrgSearchKeyword] = useState('')
  const [userSearchKeyword, setUserSearchKeyword] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['grapecity', 'xian']))
  const [selectedOrg, setSelectedOrg] = useState<OrgNode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 搜索组织时展开所有匹配的节点
  useEffect(() => {
    if (orgSearchKeyword.trim()) {
      const filteredTree = filterOrgTreeByKeyword(orgTree, orgSearchKeyword)
      const allIds = getAllOrgIds(filteredTree)
      setExpandedNodes(new Set(allIds))
    }
  }, [orgSearchKeyword])

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

  const handleSelectOrg = (org: OrgNode) => {
    setSelectedOrg(org)
    setUserSearchKeyword('')
  }

  const handleSelectUser = (userId: string, userName: string) => {
    onChange(userId, userName)
    setIsOpen(false)
    setOrgSearchKeyword('')
    setUserSearchKeyword('')
    setSelectedOrg(null)
  }

  // 过滤组织树
  const filteredOrgTree = filterOrgTreeByKeyword(orgTree, orgSearchKeyword)

  // 获取选中组织下的用户
  const usersInOrg = selectedOrg ? getUsersFromOrg(selectedOrg) : []

  // 过滤用户列表
  const filteredUsers = userSearchKeyword.trim()
    ? usersInOrg.filter(user => user.name.toLowerCase().includes(userSearchKeyword.toLowerCase()))
    : usersInOrg

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
          <div className="user-select-panels">
            {/* 左侧：组织树 */}
            <div className="user-select-panel org-panel">
              <div className="panel-header">Organizations</div>
              <div className="panel-search">
                <SearchOutlined className="panel-search-icon" />
                <input
                  type="text"
                  className="panel-search-input"
                  placeholder="Search organization..."
                  value={orgSearchKeyword}
                  onChange={(e) => setOrgSearchKeyword(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="panel-content">
                {filteredOrgTree.length === 0 ? (
                  <div className="panel-empty">No organizations found</div>
                ) : (
                  filteredOrgTree.map((node) => (
                    <OrgTreeNode
                      key={node.id}
                      node={node}
                      level={0}
                      expandedNodes={expandedNodes}
                      selectedOrgId={selectedOrg?.id || ''}
                      onToggle={handleToggle}
                      onSelectOrg={handleSelectOrg}
                    />
                  ))
                )}
              </div>
            </div>

            {/* 右侧：用户列表 */}
            <div className="user-select-panel user-panel">
              <div className="panel-header">Users</div>
              <div className="panel-search">
                <SearchOutlined className="panel-search-icon" />
                <input
                  type="text"
                  className="panel-search-input"
                  placeholder="Search user..."
                  value={userSearchKeyword}
                  onChange={(e) => setUserSearchKeyword(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="panel-content">
                {!selectedOrg ? (
                  <div className="panel-empty">Select an organization first</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="panel-empty">No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="user-list-item"
                      onClick={() => handleSelectUser(user.id, user.name)}
                    >
                      <UserOutlined className="user-list-icon" />
                      <span className="user-list-name">{user.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
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
          <PlusOutlined /> Add Delegation
        </button>
      </div>
      <table className="security-authorization-table">
        <thead>
          <tr>
            <th>Delegate To</th>
            <th>Operations</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {authorizations.length === 0 ? (
            <tr>
              <td colSpan={3} className="security-table-empty">
                No delegation records. Click "Add Delegation" to add.
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
                    <span className="security-info-tooltip">
                      <InfoCircleOutlined className="security-info-icon" />
                      <span className="security-tooltip-content">
                        When enabled, the delegated user can create tasks on your behalf. You will remain the owner of all tasks they create.
                      </span>
                    </span>
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

  return (
    <div className="security-page">
      {/* Top Header */}
      <div className="security-header">Profile Setting</div>

      {/* Main Content */}
      <div className="security-main">
        {/* Left Sidebar */}
        <div className="security-sidebar">
          <ul className="security-menu">
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={`security-menu-item ${activeMenu === item.key ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.key)}
              >
                <span className="security-menu-icon">{item.icon}</span>
                <span className="security-menu-label">{item.label}</span>
                <span className="security-menu-arrow"><RightOutlined /></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content */}
        <div className="security-content">
          <div className="security-content-title">Security</div>
          {activeMenu === 'security' && <SecurityContent />}
        </div>
      </div>
    </div>
  )
}
