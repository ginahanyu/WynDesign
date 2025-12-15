import { useState, useEffect, useRef } from 'react'
import {
  PlusOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  TableOutlined,
  DownOutlined,
  UserOutlined,
  CloseCircleFilled,
} from '@ant-design/icons'
import { authorizationStore, AuthorizedUser } from '@/store/authorizationStore'
import './Task.css'

interface Dataset {
  id: string
  name: string
  type: 'table' | 'file'
  thumbnail?: string
}

// 模拟数据集数据
const mockDatasets: Dataset[] = [
  { id: '1', name: 'CategorySales', type: 'table' },
  { id: '2', name: 'DimCustomer', type: 'table' },
  { id: '3', name: 'DimDate', type: 'table' },
  { id: '4', name: 'DimProduct', type: 'table' },
  { id: '5', name: 'DimProductCategory', type: 'table' },
  { id: '6', name: 'DimProductSubcategory', type: 'table' },
  { id: '7', name: 'DimPromotion', type: 'table' },
  { id: '8', name: 'FactInternetSales', type: 'table' },
  { id: '9', name: 'FactProductInventory', type: 'table' },
  { id: '10', name: 'FactResellerSales', type: 'table' },
  { id: '11', name: 'FactSalesQuota', type: 'table' },
  { id: '12', name: 'Geography', type: 'table' },
  { id: '13', name: 'Organization', type: 'table' },
  { id: '14', name: 'SalesTerritory', type: 'table' },
  { id: '15', name: 'ProductModel', type: 'table' },
]

type PanelTab = 'info' | 'tasks' | 'revisions'
type TaskType = 'refresh' | 'cleanup'
type ExecutionType = 'one-time' | 'scheduled'

// Owner 用户选择器组件
function OwnerSelect({
  value,
  displayName,
  onChange,
}: {
  value: string
  displayName: string
  onChange: (userId: string, userName: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 初始化获取授权用户列表
    setAuthorizedUsers(authorizationStore.getUsers())

    // 订阅变化
    const unsubscribe = authorizationStore.subscribe(() => {
      setAuthorizedUsers(authorizationStore.getUsers())
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (userId: string, userName: string) => {
    onChange(userId, userName)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('', '')
  }

  return (
    <div className="owner-select" ref={containerRef}>
      <div
        className={`owner-select-input ${!value ? 'placeholder' : ''} ${authorizedUsers.length === 0 ? 'disabled' : ''}`}
        onClick={() => authorizedUsers.length > 0 && setIsOpen(!isOpen)}
      >
        {authorizedUsers.length === 0 ? (
          <span className="owner-select-text">No delegated users</span>
        ) : displayName ? (
          <span className="owner-select-text">
            <UserOutlined className="owner-select-user-icon" />
            {displayName}
          </span>
        ) : (
          <span className="owner-select-text">Select owner</span>
        )}
        <div className="owner-select-icons">
          {value && (
            <CloseCircleFilled
              className="owner-select-clear-icon"
              onClick={handleClear}
            />
          )}
          <DownOutlined className="owner-select-arrow" />
        </div>
      </div>
      {isOpen && authorizedUsers.length > 0 && (
        <div className="owner-select-dropdown">
          {authorizedUsers.map((user) => (
            <div
              key={user.userId}
              className={`owner-select-item ${value === user.userId ? 'selected' : ''}`}
              onClick={() => handleSelect(user.userId, user.userName)}
            >
              <UserOutlined className="owner-select-user-icon" />
              <span className="owner-select-item-name">{user.userName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Task() {
  const [selectedDataset, setSelectedDataset] = useState<string>('1')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState<PanelTab>('tasks')

  // Task form state
  const [taskDescription, setTaskDescription] = useState('')
  const [taskType, setTaskType] = useState<TaskType>('refresh')
  const [executionType, setExecutionType] = useState<ExecutionType>('one-time')
  // 获取当前时间的格式化字符串 (yyyy-MM-ddTHH:mm)
  const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
  const [startDateTime, setStartDateTime] = useState(getCurrentDateTime())
  const [timezone, setTimezone] = useState('(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi')
  const [emailNotification, setEmailNotification] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [ownerName, setOwnerName] = useState('')

  const handleCreateDataset = () => {
    // TODO: 实现创建数据集功能
  }

  const handleCreateTask = () => {
    // TODO: 实现创建任务功能
  }

  const handleCancel = () => {
    setTaskDescription('')
    setTaskType('refresh')
    setExecutionType('one-time')
    setStartDateTime(getCurrentDateTime())
    setEmailNotification('')
    setOwnerId('')
    setOwnerName('')
  }

  const handleOwnerChange = (userId: string, userName: string) => {
    setOwnerId(userId)
    setOwnerName(userName)
  }

  return (
    <div className="task-page">
      <div className="task-main">
        <div className="task-toolbar">
          <div className="task-toolbar-left">
            <button className="task-create-btn" onClick={handleCreateDataset}>
              <PlusOutlined /> Create Dataset
            </button>
          </div>
          <div className="task-toolbar-right">
            <button
              className={`task-toolbar-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <AppstoreOutlined />
            </button>
            <button
              className={`task-toolbar-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <UnorderedListOutlined />
            </button>
            <div className="task-toolbar-divider" />
            <button className="task-toolbar-btn" title="Filter">
              <FilterOutlined />
            </button>
            <button className="task-toolbar-btn" title="Search">
              <SearchOutlined />
            </button>
            <button className="task-toolbar-btn" title="Refresh">
              <ReloadOutlined />
            </button>
          </div>
        </div>

        <div className="task-grid">
          {mockDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className={`dataset-card ${selectedDataset === dataset.id ? 'selected' : ''}`}
              onClick={() => setSelectedDataset(dataset.id)}
            >
              <div className="dataset-card-thumbnail">
                {dataset.thumbnail ? (
                  <img src={dataset.thumbnail} alt={dataset.name} />
                ) : (
                  <span className="dataset-card-thumbnail-placeholder">
                    <TableOutlined />
                  </span>
                )}
              </div>
              <div className="dataset-card-info">
                <TableOutlined className="dataset-card-icon" />
                <span className="dataset-card-name">{dataset.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="task-pagination">
          <span className="task-pagination-info">1-15 of 15</span>
          <button className="task-pagination-btn" disabled>
            <DoubleLeftOutlined />
          </button>
          <button className="task-pagination-btn" disabled>
            <LeftOutlined />
          </button>
          <button className="task-pagination-btn active">1</button>
          <button className="task-pagination-btn" disabled>
            <RightOutlined />
          </button>
          <button className="task-pagination-btn" disabled>
            <DoubleRightOutlined />
          </button>
        </div>
      </div>

      <div className="task-panel">
        <div className="task-panel-tabs">
          <button
            className={`task-panel-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Info
          </button>
          <button
            className={`task-panel-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`task-panel-tab ${activeTab === 'revisions' ? 'active' : ''}`}
            onClick={() => setActiveTab('revisions')}
          >
            Revisions
          </button>
        </div>

        {activeTab === 'tasks' && (
          <>
            <div className="task-panel-content">
              <div className="task-panel-section">
                <div className="task-panel-section-title">DETAILS <span className="task-required">*</span></div>

                <div className="task-panel-field">
                  <label className="task-panel-label">Task description</label>
                  <input
                    type="text"
                    className="task-panel-input"
                    placeholder="Enter task description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>

                <div className="task-panel-field">
                  <label className="task-panel-label">Task Type</label>
                  <div className="task-panel-radio-group">
                    <label className="task-panel-radio">
                      <input
                        type="radio"
                        name="taskType"
                        checked={taskType === 'refresh'}
                        onChange={() => setTaskType('refresh')}
                      />
                      Refresh
                    </label>
                    <label className="task-panel-radio">
                      <input
                        type="radio"
                        name="taskType"
                        checked={taskType === 'cleanup'}
                        onChange={() => setTaskType('cleanup')}
                      />
                      Cleanup
                    </label>
                  </div>
                </div>

                <div className="task-panel-field">
                  <label className="task-panel-label">Execution</label>
                  <div className="task-panel-radio-group">
                    <label className="task-panel-radio">
                      <input
                        type="radio"
                        name="executionType"
                        checked={executionType === 'one-time'}
                        onChange={() => setExecutionType('one-time')}
                      />
                      One-Time
                    </label>
                    <label className="task-panel-radio">
                      <input
                        type="radio"
                        name="executionType"
                        checked={executionType === 'scheduled'}
                        onChange={() => setExecutionType('scheduled')}
                      />
                      Scheduled
                    </label>
                  </div>
                </div>

                <div className="task-panel-field">
                  <label className="task-panel-label">Start</label>
                  <input
                    type="datetime-local"
                    className="task-panel-datetime-input"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                  />
                </div>

                <div className="task-panel-field">
                  <label className="task-panel-label">Executing Timezone</label>
                  <select
                    className="task-panel-select"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi">
                      (UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi
                    </option>
                    <option value="(UTC+00:00) UTC">
                      (UTC+00:00) UTC
                    </option>
                    <option value="(UTC-08:00) Pacific Time (US & Canada)">
                      (UTC-08:00) Pacific Time (US & Canada)
                    </option>
                    <option value="(UTC-05:00) Eastern Time (US & Canada)">
                      (UTC-05:00) Eastern Time (US & Canada)
                    </option>
                  </select>
                </div>

                <div className="task-panel-field">
                  <label className="task-panel-label">Email Notification</label>
                  <input
                    type="email"
                    className="task-panel-input"
                    placeholder="Enter email address"
                    value={emailNotification}
                    onChange={(e) => setEmailNotification(e.target.value)}
                  />
                </div>

                <div className="task-panel-field">
                  <label className="task-panel-label">Owner</label>
                  <OwnerSelect
                    value={ownerId}
                    displayName={ownerName}
                    onChange={handleOwnerChange}
                  />
                </div>
              </div>
            </div>

            <div className="task-panel-footer">
              <button
                className="task-panel-btn task-panel-btn-primary"
                onClick={handleCreateTask}
              >
                Create Task
              </button>
              <button
                className="task-panel-btn task-panel-btn-default"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {activeTab === 'info' && (
          <div className="task-panel-content">
            <div className="task-panel-section">
              <div className="task-panel-section-title">INFO</div>
              <p style={{ color: '#666', fontSize: '13px' }}>
                Select a dataset to view its information.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'revisions' && (
          <div className="task-panel-content">
            <div className="task-panel-section">
              <div className="task-panel-section-title">REVISIONS</div>
              <p style={{ color: '#666', fontSize: '13px' }}>
                No revisions available.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
