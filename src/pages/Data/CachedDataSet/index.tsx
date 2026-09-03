import { useState } from 'react'
import { DownOutlined, PlusOutlined, SaveOutlined, SearchOutlined, ApartmentOutlined, AppstoreOutlined } from '@ant-design/icons'
import { DataWarehouseSettings } from '../DataFlow'
import './CachedDataSet.css'

type CachedTab = 'relationships' | 'fields' | 'filters' | 'parameters' | 'views' | 'options' | 'ai' | 'warehouse'

export function CachedDataSet() {
  const [activeTab, setActiveTab] = useState<CachedTab>('relationships')
  const [partitionField, setPartitionField] = useState('')
  const [partitionUnit, setPartitionUnit] = useState('Month')
  const [bucketField, setBucketField] = useState('CustomerID')
  const [bucketCount, setBucketCount] = useState('1')
  const [backupCount, setBackupCount] = useState('')
  const tabs: Array<[CachedTab, string]> = [
    ['relationships', 'Relationships'], ['fields', 'Fields'], ['filters', 'Filters'], ['parameters', 'Parameters'],
    ['views', 'Views'], ['options', 'Options'], ['ai', 'AI Settings'], ['warehouse', 'DataWarehouse'],
  ]

  return (
    <div className="cached-dataset-page">
      <header className="cached-toolbar"><div className="cached-title">Dataset Designer (Cached Dataset)</div><button className="cached-save"><SaveOutlined /> Save</button><button className="cached-preview"><AppstoreOutlined /> Preview</button><div className="cached-name">ProcessTempsDataset</div><button className="cached-close" aria-label="Close">x</button></header>
      <div className="cached-body">
        <aside className="dataset-sidebar">
          <div className="dataset-selector">Data Sources and Datasets <DownOutlined /></div>
          <div className="dataset-search"><SearchOutlined /><input aria-label="Search for tables" placeholder="Search for tables" /></div>
          <div className="dataset-tree"><div className="tree-source"><span>⌄</span> ProcessTemperaturesDataSource</div><div className="tree-table"><span>›</span><ApartmentOutlined /> DefaultTable</div></div>
          <button className="add-sql-table"><PlusOutlined /> Add Custom SQL Table</button>
        </aside>
        <main className="cached-main">
          <nav className="cached-tabs">{tabs.map(([key, label]) => <button key={key} className={activeTab === key ? 'active' : ''} onClick={() => setActiveTab(key)}>{label}</button>)}</nav>
          <section className="cached-content">
            {activeTab === 'relationships' && <RelationshipsView />}
            {activeTab !== 'relationships' && activeTab !== 'warehouse' && <div className="cached-placeholder"><h2>{tabs.find(([key]) => key === activeTab)?.[1]}</h2></div>}
            {activeTab === 'warehouse' && <DataWarehouseSettings partitionField={partitionField} setPartitionField={setPartitionField} partitionUnit={partitionUnit} setPartitionUnit={setPartitionUnit} bucketField={bucketField} setBucketField={setBucketField} bucketCount={bucketCount} setBucketCount={setBucketCount} backupCount={backupCount} setBackupCount={setBackupCount} />}
          </section>
          <div className="cached-preview-bar"><span>Preview</span><span>⌃</span></div>
        </main>
      </div>
    </div>
  )
}

function RelationshipsView() {
  return <div className="relationship-canvas"><div className="relationship-card"><ApartmentOutlined /><span>DefaultTable(ProcessTemperat...</span></div></div>
}
