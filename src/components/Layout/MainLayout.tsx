import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import './MainLayout.css'

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className="main-layout">
      <Sidebar collapsed={collapsed} onToggleCollapse={handleToggleCollapse} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
