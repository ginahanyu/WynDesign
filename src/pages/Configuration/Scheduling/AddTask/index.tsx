import { useState, useEffect, useRef } from 'react'
import { InfoCircleOutlined, UserOutlined, DownOutlined, CloseCircleFilled } from '@ant-design/icons'
import { authorizationStore, AuthorizedUser } from '@/store/authorizationStore'
import './AddTask.css'

type StepKey = 'basic' | 'export' | 'delivery'
type ExecutionType = 'manual' | 'one-time' | 'scheduled'

interface StepItem {
  key: StepKey
  label: string
}

const steps: StepItem[] = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'export', label: 'Export Settings' },
  { key: 'delivery', label: 'Delivery' },
]

export function AddTask() {
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
    // 初始化时获取用户列表
    setAuthorizedUsers(authorizationStore.getUsers())

    // 订阅变化
    const unsubscribe = authorizationStore.subscribe(() => {
      setAuthorizedUsers(authorizationStore.getUsers())
    })

    return unsubscribe
  }, [])

  // 点击外部关闭下拉列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target as Node)) {
        setOwnerDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedUser = authorizedUsers.find(u => u.userId === owner)

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

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
    <div className="add-task-page">
      <div className="add-task-dialog">
      {/* Header */}
      <div className="add-task-header">
        <span className="add-task-title">Add Task</span>
        <button className="add-task-close-btn">&times;</button>
      </div>

      {/* Content */}
      <div className="add-task-content">
        {/* Left Stepper */}
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

        {/* Right Form Area */}
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
                      name="execution"
                      checked={executionType === 'manual'}
                      onChange={() => setExecutionType('manual')}
                    />
                    <span className="radio-custom" />
                    <span className="radio-label">Manual</span>
                  </label>
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="execution"
                      checked={executionType === 'one-time'}
                      onChange={() => setExecutionType('one-time')}
                    />
                    <span className="radio-custom" />
                    <span className="radio-label">One-Time</span>
                  </label>
                  <label className="form-radio">
                    <input
                      type="radio"
                      name="execution"
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
                <label className="form-label">Owner</label>
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
                      <span className="owner-select-text">Select owner</span>
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

        {/* Footer */}
        <div className="add-task-footer">
          <button className="add-task-next-btn" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
