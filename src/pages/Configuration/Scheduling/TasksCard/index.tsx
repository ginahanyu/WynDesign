import { useState } from 'react'
import {
  MoreOutlined,
  CaretRightOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import './TasksCard.css'
import schedularIcon from '@/resource/schedular.png'

// Document card data
interface DocumentCard {
  id: string
  name: string
  thumbnail: string
  icon: 'report' | 'dashboard'
}

// Task data
interface ScheduledTask {
  id: string
  name: string
  nextRun: string
  createdBy: string
}

// Mock document cards data
const mockDocuments: DocumentCard[] = [
  {
    id: '1',
    name: '公司财务分析综合看板',
    thumbnail: '/thumbnails/finance-dashboard.png',
    icon: 'dashboard',
  },
  {
    id: '2',
    name: '智慧车间生产制造大屏',
    thumbnail: '/thumbnails/production-dashboard.png',
    icon: 'dashboard',
  },
  {
    id: '3',
    name: '供应链管理指挥中心',
    thumbnail: '/thumbnails/supply-chain-dashboard.png',
    icon: 'dashboard',
  },
]

// Mock tasks data
const mockTasks: ScheduledTask[] = [
  { id: '1', name: 'ginatest2', nextRun: 'Manually', createdBy: 'gina' },
  { id: '2', name: 'ginatest', nextRun: 'Manually', createdBy: 'gina' },
]

type PanelTab = 'info' | 'tasks' | 'history' | 'revisions'

export function TasksCard() {
  const [selectedDocument, setSelectedDocument] = useState<string>('1')
  const [activeTab, setActiveTab] = useState<PanelTab>('tasks')

  return (
    <div className="tasks-card-page">
      <div className="tasks-card-main">
        {/* Left: Document Cards */}
        <div className="tasks-card-documents">
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`tasks-card-document ${selectedDocument === doc.id ? 'selected' : ''}`}
              onClick={() => setSelectedDocument(doc.id)}
            >
              <div className="tasks-card-document-thumbnail">
                <div className="tasks-card-thumbnail-placeholder">
                  {/* Placeholder with dark background to simulate dashboard thumbnails */}
                  <div className="tasks-card-thumbnail-bg" />
                </div>
              </div>
              <div className="tasks-card-document-info">
                <span className="tasks-card-document-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#f47321">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </span>
                <span className="tasks-card-document-name">{doc.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Panel */}
        <div className="tasks-card-panel">
          <div className="tasks-card-panel-tabs">
            <button
              className={`tasks-card-panel-tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <span>Info</span>
            </button>
            <button
              className={`tasks-card-panel-tab ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <span>Tasks</span>
            </button>
            <button
              className={`tasks-card-panel-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
              <span>History</span>
            </button>
            <button
              className={`tasks-card-panel-tab ${activeTab === 'revisions' ? 'active' : ''}`}
              onClick={() => setActiveTab('revisions')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
              </svg>
              <span>Revisions</span>
            </button>
          </div>

          <div className="tasks-card-panel-content">
            {activeTab === 'tasks' && (
              <>
                <div className="tasks-card-panel-header">
                  <span className="tasks-card-panel-title">SCHEDULED TASKS</span>
                  <button className="tasks-card-add-btn">
                    <PlusOutlined /> Add Task
                  </button>
                </div>
                <div className="tasks-card-task-list">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="tasks-card-task-item">
                      <div className="tasks-card-task-icon">
                        <img src={schedularIcon} alt="schedule" width="24" height="24" />
                      </div>
                      <div className="tasks-card-task-info">
                        <span className="tasks-card-task-name">{task.name}</span>
                        <span className="tasks-card-task-next-run">Next run: <span className="tasks-card-task-value">{task.nextRun}</span></span>
                        <span className="tasks-card-task-created-by">Create By: {task.createdBy}</span>
                      </div>
                      <div className="tasks-card-task-actions">
                        <button className="tasks-card-task-play-btn">
                          <CaretRightOutlined />
                        </button>
                        <button className="tasks-card-task-more-btn">
                          <MoreOutlined />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'info' && (
              <div className="tasks-card-panel-placeholder">
                <p>Select a document to view its information.</p>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="tasks-card-panel-placeholder">
                <p>No history available.</p>
              </div>
            )}

            {activeTab === 'revisions' && (
              <div className="tasks-card-panel-placeholder">
                <p>No revisions available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
