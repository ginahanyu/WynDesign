import { useState } from 'react'
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import './TaskManagement.css'
import stoprunIcon from '@/resource/stoprun.png'
import deleteOrgIcon from '@/resource/deleteOrag.png'

// Task data interface
interface TaskItem {
  id: string
  documentName: string
  taskName: string
  taskStatus: 'Enabled' | 'Expired Task'
  taskType: 'Compound Task' | 'Dashboard Export' | 'Report Export'
  executeType: 'Manual' | 'One-Time' | 'Scheduled'
  taskStartTime?: string
  createdBy: string
  runAs: string
}

// Mock task data based on the image
const mockTasks: TaskItem[] = [
  {
    id: '1',
    documentName: 'Json-EndPointSpecialName-jumpta...',
    taskName: '123456',
    taskStatus: 'Enabled',
    taskType: 'Compound Task',
    executeType: 'Manual',
    createdBy: 'admin',
    runAs: 'admin',
  },
  {
    id: '2',
    documentName: '',
    taskName: '123',
    taskStatus: 'Enabled',
    taskType: 'Dashboard Export',
    executeType: 'Manual',
    createdBy: 'gina',
    runAs: 'gina',
  },
  {
    id: '3',
    documentName: '',
    taskName: '666',
    taskStatus: 'Expired Task',
    taskType: 'Dashboard Export',
    executeType: 'One-Time',
    taskStartTime: 'September 21, 2022 12:28 PM',
    createdBy: 'john',
    runAs: 'john',
  },
  {
    id: '4',
    documentName: '',
    taskName: '123456',
    taskStatus: 'Enabled',
    taskType: 'Compound Task',
    executeType: 'Manual',
    createdBy: 'admin',
    runAs: 'mike',
  },
  {
    id: '5',
    documentName: '',
    taskName: 'attachment',
    taskStatus: 'Enabled',
    taskType: 'Dashboard Export',
    executeType: 'Manual',
    createdBy: 'gina',
    runAs: 'admin',
  },
  {
    id: '6',
    documentName: 'Json-jump',
    taskName: 'Download_link',
    taskStatus: 'Enabled',
    taskType: 'Dashboard Export',
    executeType: 'Manual',
    createdBy: 'admin',
    runAs: 'gina',
  },
  {
    id: '7',
    documentName: '',
    taskName: 'online_link',
    taskStatus: 'Enabled',
    taskType: 'Dashboard Export',
    executeType: 'Manual',
    createdBy: 'mike',
    runAs: 'mike',
  },
  {
    id: '8',
    documentName: 'JsonModelParameter-Org',
    taskName: '123456',
    taskStatus: 'Enabled',
    taskType: 'Compound Task',
    executeType: 'Manual',
    createdBy: 'john',
    runAs: 'admin',
  },
  {
    id: '9',
    documentName: 'Test dashboard',
    taskName: '123456',
    taskStatus: 'Enabled',
    taskType: 'Compound Task',
    executeType: 'Manual',
    createdBy: 'gina',
    runAs: 'gina',
  },
  {
    id: '10',
    documentName: 'Test dashboard-Copy',
    taskName: '123',
    taskStatus: 'Enabled',
    taskType: 'Dashboard Export',
    executeType: 'Manual',
    createdBy: 'admin',
    runAs: 'john',
  },
  {
    id: '11',
    documentName: '_DateTimeWithDefault',
    taskName: 'dq',
    taskStatus: 'Enabled',
    taskType: 'Report Export',
    executeType: 'Manual',
    createdBy: 'mike',
    runAs: 'admin',
  },
  {
    id: '12',
    documentName: '【演示用Demo_新】',
    taskName: 'fff',
    taskStatus: 'Enabled',
    taskType: 'Dashboard Export',
    executeType: 'Scheduled',
    taskStartTime: 'February 7, 2023 6:02 PM',
    createdBy: 'gina',
    runAs: 'mike',
  },
  {
    id: '13',
    documentName: '0-1-性能-无插件-缓存模型',
    taskName: 'export',
    taskStatus: 'Enabled',
    taskType: 'Dashboard Export',
    executeType: 'Manual',
    createdBy: 'admin',
    runAs: 'admin',
  },
  {
    id: '14',
    documentName: '',
    taskName: 'q',
    taskStatus: 'Enabled',
    taskType: 'Compound Task',
    executeType: 'Manual',
    createdBy: 'john',
    runAs: 'gina',
  },
]

export function TaskManagement() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="task-management-page">
      {/* Main Content */}
      <div className="task-management-content">
        {/* Header */}
        <div className="task-management-header">
          <div className="task-management-header-left">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#f47321">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <span className="task-management-header-title">TASK MANAGEMENT</span>
            <span className="task-management-header-breadcrumb">Task Management</span>
          </div>
          <div className="task-management-header-right">
            <div className="task-management-search">
              <SearchOutlined className="task-management-search-icon" />
              <input
                type="text"
                className="task-management-search-input"
                placeholder=""
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button className="task-management-header-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
              </svg>
            </button>
            <button className="task-management-header-btn">
              <FilterOutlined />
            </button>
            <button className="task-management-header-btn">
              <CloseOutlined />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="task-management-table-container">
          <table className="task-management-table">
            <thead>
              <tr>
                <th>
                  Document Name
                  <span className="task-management-sort-icon">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M7 14l5-5 5 5z"/>
                    </svg>
                  </span>
                </th>
                <th>Task Name</th>
                <th>Task Status</th>
                <th>Task Type</th>
                <th>Execute Type</th>
                <th>Task Start Time</th>
                <th>Create By</th>
                <th>Run As</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.documentName}</td>
                  <td>{task.taskName}</td>
                  <td>
                    <span className={`task-management-status ${task.taskStatus === 'Expired Task' ? 'expired' : ''}`}>
                      {task.taskStatus}
                    </span>
                  </td>
                  <td>{task.taskType}</td>
                  <td>{task.executeType}</td>
                  <td>{task.taskStartTime || ''}</td>
                  <td>{task.createdBy}</td>
                  <td>{task.runAs}</td>
                  <td>
                    <div className="task-management-actions">
                      <button className="task-management-action-btn run">
                        <img src={stoprunIcon} alt="run" width="16" height="20" />
                      </button>
                      <button className="task-management-action-btn delete">
                        <img src={deleteOrgIcon} alt="delete" width="16" height="20" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
