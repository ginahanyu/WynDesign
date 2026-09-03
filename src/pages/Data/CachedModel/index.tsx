import { useState } from 'react'
import { DatabaseOutlined, MenuOutlined, SaveOutlined, SearchOutlined, TableOutlined } from '@ant-design/icons'
import { DataWarehouseSettings } from '../DataFlow'
import './CachedModel.css'

type ModelTab = 'data' | 'relationships' | 'security' | 'incremental' | 'settings' | 'ai' | 'warehouse'
const entities = ['CustomerOrders', 'Products']

export function CachedModel() {
  const [activeTab, setActiveTab] = useState<ModelTab>('ai')
  const [selectedEntity, setSelectedEntity] = useState(entities[0])
  const [entitySearch, setEntitySearch] = useState('')
  const [partitionField, setPartitionField] = useState('')
  const [partitionUnit, setPartitionUnit] = useState('Month')
  const [bucketField, setBucketField] = useState('CustomerID')
  const [bucketCount, setBucketCount] = useState('1')
  const [backupCount, setBackupCount] = useState('')
  const tabs: Array<[ModelTab, string]> = [
    ['data', 'Data'], ['relationships', 'Relationship Management...'], ['security', 'Data Security'], ['incremental', 'Incremental Update En...'], ['settings', 'Settings'], ['ai', 'AI Settings'], ['warehouse', 'DataWarehouse'],
  ]
  const visibleEntities = entities.filter((entity) => entity.toLowerCase().includes(entitySearch.toLowerCase()))

  return (
    <div className="cached-model-page">
      <aside className="model-rail"><MenuOutlined /><DatabaseOutlined /><TableOutlined /><span className="rail-badge">1</span></aside>
      <div className="model-shell">
        <header className="model-toolbar"><div className="model-toolbar-actions"><button aria-label="Undo">↶</button><button aria-label="Redo">↷</button><button className="model-save"><SaveOutlined /> Save</button><button className="validate-button">▣ Validate</button></div><div className="model-name">cached model</div><button className="model-close" aria-label="Close">x</button></header>
        <nav className="model-tabs">{tabs.map(([key, label]) => <button key={key} className={activeTab === key ? 'active' : ''} onClick={() => setActiveTab(key)}>{label}</button>)}</nav>
        <main className="model-content">
          {activeTab === 'ai' && <AiSettings selectedEntity={selectedEntity} entitySearch={entitySearch} setEntitySearch={setEntitySearch} setSelectedEntity={setSelectedEntity} visibleEntities={visibleEntities} />}
          {activeTab === 'warehouse' && <div className="model-warehouse-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}><h2 style={{ margin: '18px 10px 8px', fontSize: 14, fontWeight: 500, color: '#111' }}>DataWarehouse type: Doris</h2><div className="model-warehouse-layout" style={{ display: 'flex', flex: 1, minHeight: 0 }}><EntityList selectedEntity={selectedEntity} entitySearch={entitySearch} setEntitySearch={setEntitySearch} setSelectedEntity={setSelectedEntity} visibleEntities={visibleEntities} /><div className="model-warehouse-panel"><DataWarehouseSettings showType={false} partitionField={partitionField} setPartitionField={setPartitionField} partitionUnit={partitionUnit} setPartitionUnit={setPartitionUnit} bucketField={bucketField} setBucketField={setBucketField} bucketCount={bucketCount} setBucketCount={setBucketCount} backupCount={backupCount} setBackupCount={setBackupCount} /></div></div></div>}
          {activeTab !== 'ai' && activeTab !== 'warehouse' && <div className="model-placeholder">{tabs.find(([key]) => key === activeTab)?.[1]}</div>}
        </main>
      </div>
    </div>
  )
}

interface EntityListProps { selectedEntity: string; entitySearch: string; setEntitySearch: (value: string) => void; setSelectedEntity: (value: string) => void; visibleEntities: string[] }
function EntityList({ selectedEntity, entitySearch, setEntitySearch, setSelectedEntity, visibleEntities }: EntityListProps) {
  return <div className="entity-list"><div className="entity-search"><SearchOutlined /><input aria-label="Search Entity" placeholder="Search Entity" value={entitySearch} onChange={(e) => setEntitySearch(e.target.value)} /></div>{visibleEntities.map((entity) => <button key={entity} className={selectedEntity === entity ? 'selected' : ''} onClick={() => setSelectedEntity(entity)}><TableOutlined /> {entity}</button>)}</div>
}

function AiSettings({ selectedEntity, entitySearch, setEntitySearch, setSelectedEntity, visibleEntities }: EntityListProps) {
  return <div className="ai-settings"><div className="ai-toggle-row"><span>For AI conversation analysis</span><span className="help-mark">?</span><span>False</span><span className="static-switch" /></div><label className="model-description-label">Model Description</label><textarea className="model-description" /><h3>AI Settings Detail</h3><div className="ai-detail"><EntityList selectedEntity={selectedEntity} entitySearch={entitySearch} setEntitySearch={setEntitySearch} setSelectedEntity={setSelectedEntity} visibleEntities={visibleEntities} /><div className="entity-detail"><label>Entity Description</label><textarea /><label>Field List</label><table><thead><tr><th>Field Name</th><th>Field Description</th></tr></thead><tbody>{['AccountNumber', 'Address1', 'Address2', 'City', 'Country', 'CustomerID', 'Discount', 'FirstName', 'LastName', 'MediaType', 'MiddleInitial', 'PostalCode'].map((field) => <tr key={field}><td>{field}</td><td /></tr>)}</tbody></table></div></div></div>
}
