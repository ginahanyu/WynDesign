import { useState, useEffect, useRef } from 'react'
import {
  InfoCircleOutlined,
  UserOutlined,
  DownOutlined,
  CloseCircleFilled,
  ApartmentOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { authorizationStore, AuthorizedUser } from '@/store/authorizationStore'
import './AddTask.css'

type StepKey = 'basic' | 'export' | 'delivery'
type ExecutionType = 'manual' | 'one-time' | 'scheduled'

interface StepItem {
  key: StepKey
  label: string
}

interface OrgNode {
  id: string
  name: string
  type: 'org' | 'user'
  children?: OrgNode[]
}

const steps: StepItem[] = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'export', label: 'Export Settings' },
  { key: 'delivery', label: 'Delivery' },
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
        name: "Xi'an Branch",
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
            ],
          },
          {
            id: 'dd2',
            name: 'Development Dept 2',
            type: 'org',
            children: [
              { id: 'user-dd2-1', name: 'Wu Hua', type: 'user' },
              { id: 'user-dd2-2', name: 'Zheng Kai', type: 'user' },
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
        ],
      },
    ],
  },
]

// 树形节点组件（仅组织节点）
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
  const hasOrgChildren = node.children?.some((child) => child.type === 'org')
  const isExpanded = expandedNodes.has(node.id)
  const isSelected = selectedOrgId === node.id

  return (
    <div className="addtask-org-tree-node">
      <div
        className={`addtask-org-tree-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasOrgChildren && (
          <span
            className="addtask-org-tree-arrow"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
          </span>
        )}
        {!hasOrgChildren && <span className="addtask-org-tree-arrow-placeholder" />}
        <span className="addtask-org-tree-content" onClick={() => onSelectOrg(node)}>
          <span className="addtask-org-tree-icon">
            <ApartmentOutlined />
          </span>
          <span className="addtask-org-tree-label">{node.name}</span>
        </span>
      </div>
      {hasOrgChildren && isExpanded && (
        <div className="addtask-org-tree-children">
          {node.children!
            .filter((child) => child.type === 'org')
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

    const nameMatches = node.name.toLowerCase().includes(lowerKeyword)

    const filteredChildren =
      node.children?.map((child) => filterNode(child)).filter((child): child is OrgNode => child !== null) || []

    if (nameMatches || filteredChildren.length > 0) {
      return {
        ...node,
        children: nameMatches ? node.children : filteredChildren,
      }
    }

    return null
  }

  return nodes.map((node) => filterNode(node)).filter((node): node is OrgNode => node !== null)
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

// 获取组织下的直接用户
function getUsersFromOrg(org: OrgNode): OrgNode[] {
  return org.children?.filter((child) => child.type === 'user') || []
}

// 根据组织ID获取组织下的所有用户
function getUsersFromOrgById(orgId: string): OrgNode[] {
  const findOrgAndGetUsers = (nodes: OrgNode[]): OrgNode[] => {
    for (const node of nodes) {
      if (node.id === orgId && node.type === 'org') {
        return getUsersFromOrg(node)
      }
      if (node.children) {
        const result = findOrgAndGetUsers(node.children)
        if (result.length > 0 || node.children.some((c) => c.id === orgId)) {
          const found = node.children.find((c) => c.id === orgId)
          if (found && found.type === 'org') {
            return getUsersFromOrg(found)
          }
          return result
        }
      }
    }
    return []
  }
  return findOrgAndGetUsers(orgTree)
}

// 组织选择器组件
function OrganizationSelect({
  value,
  displayName,
  onChange,
}: {
  value: string
  displayName: string
  onChange: (orgId: string, orgName: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['grapecity', 'xian']))
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

  useEffect(() => {
    if (searchKeyword.trim()) {
      const filteredTree = filterOrgTreeByKeyword(orgTree, searchKeyword)
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

  const handleSelectOrg = (org: OrgNode) => {
    onChange(org.id, org.name)
    setIsOpen(false)
    setSearchKeyword('')
  }

  const filteredOrgTree = filterOrgTreeByKeyword(orgTree, searchKeyword)

  return (
    <div className="addtask-org-select" ref={containerRef}>
      <div className="addtask-org-select-input" onClick={() => setIsOpen(!isOpen)}>
        <span className={displayName ? '' : 'placeholder'}>
          {displayName || '-- Select Organization --'}
        </span>
        <DownOutlined className="addtask-org-select-arrow" />
      </div>
      {isOpen && (
        <div className="addtask-org-select-dropdown">
          <div className="addtask-org-select-search">
            <SearchOutlined className="addtask-org-select-search-icon" />
            <input
              type="text"
              className="addtask-org-select-search-input"
              placeholder="Search organization..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="addtask-org-select-content">
            {filteredOrgTree.length === 0 ? (
              <div className="addtask-org-select-empty">No organizations found</div>
            ) : (
              filteredOrgTree.map((node) => (
                <OrgTreeNode
                  key={node.id}
                  node={node}
                  level={0}
                  expandedNodes={expandedNodes}
                  selectedOrgId={value}
                  onToggle={handleToggle}
                  onSelectOrg={handleSelectOrg}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// 用户选择器组件
function UserSelect({
  value,
  displayName,
  orgId,
  onChange,
}: {
  value: string
  displayName: string
  orgId: string
  onChange: (userId: string, userName: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
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

  const handleSelectUser = (userId: string, userName: string) => {
    onChange(userId, userName)
    setIsOpen(false)
    setSearchKeyword('')
  }

  const usersInOrg = orgId ? getUsersFromOrgById(orgId) : []

  const filteredUsers = searchKeyword.trim()
    ? usersInOrg.filter((user) => user.name.toLowerCase().includes(searchKeyword.toLowerCase()))
    : usersInOrg

  const isDisabled = !orgId

  return (
    <div className="addtask-user-select" ref={containerRef}>
      <div
        className={`addtask-user-select-input ${isDisabled ? 'disabled' : ''}`}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
      >
        <span className={displayName ? '' : 'placeholder'}>
          {isDisabled ? '-- Select organization first --' : displayName || '-- Select User --'}
        </span>
        <DownOutlined className="addtask-user-select-arrow" />
      </div>
      {isOpen && !isDisabled && (
        <div className="addtask-user-select-dropdown">
          <div className="addtask-user-select-search">
            <SearchOutlined className="addtask-user-select-search-icon" />
            <input
              type="text"
              className="addtask-user-select-search-input"
              placeholder="Search user..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="addtask-user-select-content">
            {filteredUsers.length === 0 ? (
              <div className="addtask-user-select-empty">No users found</div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`addtask-user-select-item ${value === user.id ? 'selected' : ''}`}
                  onClick={() => handleSelectUser(user.id, user.name)}
                >
                  <UserOutlined className="addtask-user-select-item-icon" />
                  <span className="addtask-user-select-item-name">{user.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// 第一个对话框组件（原始版本 - Owner 单选）
function AddTaskDialog1() {
  const [currentStep, setCurrentStep] = useState<StepKey>('basic')
  const [taskDescription, setTaskDescription] = useState('')
  const [executionType, setExecutionType] = useState<ExecutionType>('manual')
  const [expirationCount, setExpirationCount] = useState('0')
  const [expirationUnit, setExpirationUnit] = useState('Never expire')
  const [owner, setOwner] = useState('')
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([])
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false)
  const ownerDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setAuthorizedUsers(authorizationStore.getUsers())
    const unsubscribe = authorizationStore.subscribe(() => {
      setAuthorizedUsers(authorizationStore.getUsers())
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target as Node)) {
        setOwnerDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedUser = authorizedUsers.find((u) => u.userId === owner)
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key)
    }
  }

  const handleStepClick = (stepKey: StepKey) => {
    setCurrentStep(stepKey)
  }

  const getStepStatus = (index: number): 'completed' | 'current' | 'pending' => {
    if (index < currentStepIndex) return 'completed'
    if (index === currentStepIndex) return 'current'
    return 'pending'
  }

  return (
    <div className="add-task-dialog">
      <div className="add-task-header">
        <span className="add-task-title">Add Task</span>
        <button className="add-task-close-btn">&times;</button>
      </div>

      <div className="add-task-content">
        <div className="add-task-stepper">
          {steps.map((step, index) => {
            const status = getStepStatus(index)
            return (
              <div
                key={step.key}
                className={`stepper-item ${status}`}
                onClick={() => handleStepClick(step.key)}
              >
                <div className="stepper-indicator">
                  <div className="stepper-dot" />
                  {index < steps.length - 1 && <div className="stepper-line" />}
                </div>
                <span className="stepper-label">{step.label}</span>
              </div>
            )
          })}
        </div>

        <div className="add-task-form">
          {currentStep === 'basic' && (
            <div className="form-section">
              <div className="form-section-title">DETAILS</div>

              <div className="form-field">
                <input
                  type="text"
                  className="form-input task-description-input"
                  placeholder="Task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Execution</label>
                <div className="form-radio-group">
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="execution1"
                      checked={executionType === 'manual'}
                      onChange={() => setExecutionType('manual')}
                    />
                    <span className="radio-custom" />
                    <span className="radio-label">Manual</span>
                  </label>
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="execution1"
                      checked={executionType === 'one-time'}
                      onChange={() => setExecutionType('one-time')}
                    />
                    <span className="radio-custom" />
                    <span className="radio-label">One-Time</span>
                  </label>
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="execution1"
                      checked={executionType === 'scheduled'}
                      onChange={() => setExecutionType('scheduled')}
                    />
                    <span className="radio-custom" />
                    <span className="radio-label">Scheduled</span>
                  </label>
                </div>
              </div>

              <div className="form-field">
                <div className="form-label-with-icon">
                  <label className="form-label">Task history expiration time</label>
                  <InfoCircleOutlined className="form-info-icon" />
                </div>
                <div className="form-expiration-row">
                  <select
                    className="form-select expiration-count-select"
                    value={expirationCount}
                    onChange={(e) => setExpirationCount(e.target.value)}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <select
                    className="form-select expiration-unit-select"
                    value={expirationUnit}
                    onChange={(e) => setExpirationUnit(e.target.value)}
                  >
                    <option value="Never expire">Never expire</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Run As</label>
                <div className="owner-select-wrapper" ref={ownerDropdownRef}>
                  <div
                    className={`owner-select-input ${!owner ? 'placeholder' : ''} ${authorizedUsers.length === 0 ? 'disabled' : ''}`}
                    onClick={() => authorizedUsers.length > 0 && setOwnerDropdownOpen(!ownerDropdownOpen)}
                  >
                    {authorizedUsers.length === 0 ? (
                      <span className="owner-select-text">No delegated users</span>
                    ) : selectedUser ? (
                      <span className="owner-select-text">
                        <UserOutlined className="owner-user-icon" />
                        {selectedUser.userName}
                      </span>
                    ) : (
                      <span className="owner-select-text">Select user</span>
                    )}
                    <div className="owner-select-icons">
                      {owner && (
                        <CloseCircleFilled
                          className="owner-clear-icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOwner('')
                          }}
                        />
                      )}
                      <DownOutlined className="owner-select-arrow" />
                    </div>
                  </div>
                  {ownerDropdownOpen && authorizedUsers.length > 0 && (
                    <div className="owner-dropdown">
                      {authorizedUsers.map((user) => (
                        <div
                          key={user.userId}
                          className={`owner-dropdown-item ${owner === user.userId ? 'selected' : ''}`}
                          onClick={() => {
                            setOwner(user.userId)
                            setOwnerDropdownOpen(false)
                          }}
                        >
                          <UserOutlined className="owner-user-icon" />
                          <span>{user.userName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'export' && (
            <div className="form-section">
              <div className="form-section-title">EXPORT SETTINGS</div>
              <p className="form-placeholder-text">Export settings content will be here.</p>
            </div>
          )}

          {currentStep === 'delivery' && (
            <div className="form-section">
              <div className="form-section-title">DELIVERY</div>
              <p className="form-placeholder-text">Delivery settings content will be here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="add-task-footer">
        <button className="add-task-next-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  )
}

// 第二个对话框组件（新版本 - Organization + User 双选）
function AddTaskDialog2() {
  const [currentStep, setCurrentStep] = useState<StepKey>('basic')
  const [taskDescription, setTaskDescription] = useState('')
  const [executionType, setExecutionType] = useState<ExecutionType>('manual')
  const [expirationCount, setExpirationCount] = useState('0')
  const [expirationUnit, setExpirationUnit] = useState('Never expire')
  const [orgId, setOrgId] = useState('')
  const [orgName, setOrgName] = useState('')
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key)
    }
  }

  const handleStepClick = (stepKey: StepKey) => {
    setCurrentStep(stepKey)
  }

  const getStepStatus = (index: number): 'completed' | 'current' | 'pending' => {
    if (index < currentStepIndex) return 'completed'
    if (index === currentStepIndex) return 'current'
    return 'pending'
  }

  const handleOrgChange = (newOrgId: string, newOrgName: string) => {
    setOrgId(newOrgId)
    setOrgName(newOrgName)
    // 组织改变时清空用户选择
    setUserId('')
    setUserName('')
  }

  const handleUserChange = (newUserId: string, newUserName: string) => {
    setUserId(newUserId)
    setUserName(newUserName)
  }

  return (
    <div className="add-task-dialog">
      <div className="add-task-header">
        <span className="add-task-title">Add Task</span>
        <button className="add-task-close-btn">&times;</button>
      </div>

      <div className="add-task-content">
        <div className="add-task-stepper">
          {steps.map((step, index) => {
            const status = getStepStatus(index)
            return (
              <div
                key={step.key}
                className={`stepper-item ${status}`}
                onClick={() => handleStepClick(step.key)}
              >
                <div className="stepper-indicator">
                  <div className="stepper-dot" />
                  {index < steps.length - 1 && <div className="stepper-line" />}
                </div>
                <span className="stepper-label">{step.label}</span>
              </div>
            )
          })}
        </div>

        <div className="add-task-form">
          {currentStep === 'basic' && (
            <div className="form-section">
              <div className="form-section-title">DETAILS</div>

              <div className="form-field">
                <input
                  type="text"
                  className="form-input task-description-input"
                  placeholder="Task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Execution</label>
                <div className="form-radio-group">
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="execution2"
                      checked={executionType === 'manual'}
                      onChange={() => setExecutionType('manual')}
                    />
                    <span className="radio-custom" />
                    <span className="radio-label">Manual</span>
                  </label>
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="execution2"
                      checked={executionType === 'one-time'}
                      onChange={() => setExecutionType('one-time')}
                    />
                    <span className="radio-custom" />
                    <span className="radio-label">One-Time</span>
                  </label>
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="execution2"
                      checked={executionType === 'scheduled'}
                      onChange={() => setExecutionType('scheduled')}
                    />
                    <span className="radio-custom" />
                    <span className="radio-label">Scheduled</span>
                  </label>
                </div>
              </div>

              <div className="form-field">
                <div className="form-label-with-icon">
                  <label className="form-label">Task history expiration time</label>
                  <InfoCircleOutlined className="form-info-icon" />
                </div>
                <div className="form-expiration-row">
                  <select
                    className="form-select expiration-count-select"
                    value={expirationCount}
                    onChange={(e) => setExpirationCount(e.target.value)}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <select
                    className="form-select expiration-unit-select"
                    value={expirationUnit}
                    onChange={(e) => setExpirationUnit(e.target.value)}
                  >
                    <option value="Never expire">Never expire</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
              </div>

              <div className="form-field-row">
                <div className="form-field form-field-half">
                  <label className="form-label">Run As</label>
                  <OrganizationSelect
                    value={orgId}
                    displayName={orgName}
                    onChange={handleOrgChange}
                  />
                </div>
                <div className="form-field form-field-half">
                  <label className="form-label">&nbsp;</label>
                  <UserSelect
                    value={userId}
                    displayName={userName}
                    orgId={orgId}
                    onChange={handleUserChange}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'export' && (
            <div className="form-section">
              <div className="form-section-title">EXPORT SETTINGS</div>
              <p className="form-placeholder-text">Export settings content will be here.</p>
            </div>
          )}

          {currentStep === 'delivery' && (
            <div className="form-section">
              <div className="form-section-title">DELIVERY</div>
              <p className="form-placeholder-text">Delivery settings content will be here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="add-task-footer">
        <button className="add-task-next-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  )
}

export function AddTask() {
  return (
    <div className="add-task-page">
      <div className="add-task-column">
        <div className="add-task-column-title">Normal User</div>
        <AddTaskDialog1 />
      </div>
      <div className="add-task-column">
        <div className="add-task-column-title">Admin or OrgAdmin</div>
        <AddTaskDialog2 />
      </div>
    </div>
  )
}
