import { useState } from 'react'
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { DataWarehouseSettings } from '../DataFlow'
import './PushDataSet.css'

type PushTab = 'fields' | 'security' | 'ai' | 'warehouse'

interface PushField {
  name: string
  type: string
  category: string
  description: string
}

const initialFields: PushField[] = [
  { name: 'id', type: 'String', category: 'None', description: '' },
  { name: 'name', type: 'String', category: 'None', description: '' },
  { name: 'date', type: 'DateTime', category: 'None', description: '' },
]

export function PushDataSet() {
  const [activeTab, setActiveTab] = useState<PushTab>('fields')
  const [fields, setFields] = useState(initialFields)
  const [token, setToken] = useState('')
  const [partitionField, setPartitionField] = useState('')
  const [partitionUnit, setPartitionUnit] = useState('Month')
  const [bucketField, setBucketField] = useState('CustomerID')
  const [bucketCount, setBucketCount] = useState('1')
  const [backupCount, setBackupCount] = useState('')

  const addField = () => setFields((current) => [...current, { name: `field${current.length + 1}`, type: 'String', category: 'None', description: '' }])
  const removeField = (index: number) => setFields((current) => current.filter((_, fieldIndex) => fieldIndex !== index))
  const updateField = (index: number, key: keyof PushField, value: string) => setFields((current) => current.map((field, fieldIndex) => fieldIndex === index ? { ...field, [key]: value } : field))

  return (
    <div className="push-dataset-page">
      <header className="push-toolbar">
        <div className="push-title">Push Dataset Designer</div>
        <button className="push-save" aria-label="Save"><SaveOutlined /> Save</button>
        <div className="push-name">push dataset</div>
        <button className="push-close" aria-label="Close">x</button>
      </header>
      <nav className="push-tabs">
        <button className={activeTab === 'fields' ? 'active' : ''} onClick={() => setActiveTab('fields')}>Fields</button>
        <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>Security Filters</button>
        <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>AI Settings</button>
        <button className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => setActiveTab('warehouse')}>DataWarehouse</button>
      </nav>
      <main className="push-content">
        {activeTab === 'fields' && (
          <section className="fields-view">
            <div className="fields-toolbar"><h2>Fields</h2><div className="token-controls"><label htmlFor="push-token">Push Data Token</label><input id="push-token" value={token} onChange={(e) => setToken(e.target.value)} /><button onClick={() => setToken(Math.random().toString(36).slice(2, 14))}>Random Generate</button></div></div>
            <div className="fields-table-wrap"><table className="fields-table"><thead><tr><th>Field Name</th><th>Field Type</th><th>Data Category</th><th>Description</th><th aria-label="Actions" /></tr></thead><tbody>{fields.map((field, index) => <tr key={`${field.name}-${index}`}><td><input aria-label={`Field name ${index + 1}`} value={field.name} onChange={(e) => updateField(index, 'name', e.target.value)} /></td><td><select aria-label={`Field type ${index + 1}`} value={field.type} onChange={(e) => updateField(index, 'type', e.target.value)}><option>String</option><option>DateTime</option><option>Number</option><option>Boolean</option></select></td><td><select aria-label={`Data category ${index + 1}`} value={field.category} onChange={(e) => updateField(index, 'category', e.target.value)}><option>None</option><option>Personal Data</option><option>Financial Data</option></select></td><td><input aria-label={`Description ${index + 1}`} value={field.description} onChange={(e) => updateField(index, 'description', e.target.value)} /></td><td><button className="field-delete" aria-label={`Delete field ${field.name}`} onClick={() => removeField(index)}><DeleteOutlined /></button></td></tr>)}</tbody></table></div>
            <button className="add-field" onClick={addField}><PlusOutlined /> Add Field</button>
          </section>
        )}
        {activeTab === 'security' && <section className="push-placeholder"><h2>Security Filters</h2></section>}
        {activeTab === 'ai' && <section className="push-placeholder"><h2>AI Settings</h2></section>}
        {activeTab === 'warehouse' && <DataWarehouseSettings partitionField={partitionField} setPartitionField={setPartitionField} partitionUnit={partitionUnit} setPartitionUnit={setPartitionUnit} bucketField={bucketField} setBucketField={setBucketField} bucketCount={bucketCount} setBucketCount={setBucketCount} backupCount={backupCount} setBackupCount={setBackupCount} />}
      </main>
    </div>
  )
}
