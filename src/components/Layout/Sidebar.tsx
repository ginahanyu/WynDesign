import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MenuItem } from '@/types/menu'
import { menuConfig } from '@/config/menuConfig'
import './Sidebar.css'

interface MenuItemProps {
  item: MenuItem
  level?: number
}

function MenuItemComponent({ item, level = 0 }: MenuItemProps) {
  const [expanded, setExpanded] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const hasChildren = item.children && item.children.length > 0
  const isActive = item.path === location.pathname

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded)
    } else if (item.path) {
      navigate(item.path)
    }
  }

  return (
    <div className="menu-item-wrapper">
      <div
        className={`menu-item ${isActive ? 'active' : ''} ${hasChildren ? 'has-children' : ''}`}
        style={{ paddingLeft: `${16 + level * 16}px` }}
        onClick={handleClick}
      >
        <span className="menu-label">{item.label}</span>
        {hasChildren && (
          <span className={`menu-arrow ${expanded ? 'expanded' : ''}`} />
        )}
      </div>
      {hasChildren && expanded && (
        <div className="menu-children">
          {item.children!.map((child) => (
            <MenuItemComponent key={child.key} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h1 className="sidebar-title">WynDesign</h1>}
        <button className="collapse-btn" onClick={onToggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? '»' : '«'}
        </button>
      </div>
      {!collapsed && (
        <nav className="sidebar-menu">
          {menuConfig.map((item) => (
            <MenuItemComponent key={item.key} item={item} />
          ))}
        </nav>
      )}
    </aside>
  )
}
