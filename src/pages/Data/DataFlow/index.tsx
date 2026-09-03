import { useState } from 'react'
import {
  DatabaseOutlined,
  DownOutlined,
  EditOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
  CaretRightOutlined,
  RedoOutlined,
  SaveOutlined,
  SearchOutlined,
  TableOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import './DataFlow.css'

type OutputTab = 'configuration' | 'data' | 'dataWarehouse'

const commandGroups = [
  { title: 'Input/Output', commands: ['Input Source', 'Output Target'] },
  { title: 'Column Operation', commands: ['Select Columns', 'Combine Columns', 'Modify Column Type', 'Add Columns'] },
  { title: 'Row Operation', commands: ['Pivot', 'Unpivot', 'Aggregate', 'Filter Rows', 'Remove Duplicates', 'Split Rows'] },
  { title: 'Combine Data', commands: ['Union Data', 'Join Data'] },
]

const columns = ['CustomerID', 'AccountNumber', 'FirstName', 'MiddleInitial', 'LastName', 'Address1', 'Address2', 'City', 'Region', 'PostalCode']

export function DataFlow() {
  const [activeTab, setActiveTab] = useState<OutputTab>('data')
  const [partitionField, setPartitionField] = useState('')
  const [partitionUnit, setPartitionUnit] = useState('Month')
  const [bucketField, setBucketField] = useState('CustomerID')
  const [bucketCount, setBucketCount] = useState('1')
  const [backupCount, setBackupCount] = useState('')

  return (
    <div className="dataflow-page">
      <header className="dataflow-toolbar">
        <div className="dataflow-title">Data Flow Designer</div>
        <div className="dataflow-toolbar-actions">
          <button aria-label="Undo"><UndoOutlined /></button>
          <button aria-label="Redo"><RedoOutlined /></button>
          <button aria-label="Save"><SaveOutlined /></button>
          <span className="toolbar-divider" />
          <button className="execute-button"><CaretRightOutlined /> Execute <DownOutlined /></button>
          <span className="toolbar-divider" />
          <button className="row-limit">1000 row limit <DownOutlined /></button>
          <SearchOutlined className="toolbar-search" />
        </div>
        <div className="dataflow-name">dataflow <button aria-label="Close">x</button></div>
      </header>

      <div className="dataflow-main">
        <aside className="command-panel">
          <div className="command-search"><SearchOutlined /><input aria-label="Search for commands" placeholder="Search for commands" /></div>
          {commandGroups.map((group) => (
            <div className="command-group" key={group.title}>
              <div className="command-group-title"><span className="group-chevron">⌄</span>{group.title}</div>
              {group.commands.map((command, index) => (
                <button className="command-item" key={command}>
                  <span className={`command-icon icon-${index % 4}`} />
                  {command}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <section className="flow-canvas" aria-label="Data flow canvas">
          <div className="flow-node source-node">
            <div className="flow-node-icon"><DatabaseOutlined /></div>
            <span>CustomerOrders</span>
            <i className="node-port output-port" />
          </div>
          <div className="flow-connection" />
          <div className="flow-node target-node selected-node">
            <div className="flow-node-icon"><TableOutlined /></div>
            <span>Output Target</span>
            <i className="node-port input-port" />
          </div>
          <div className="canvas-minimap"><span /><span /></div>
        </section>
      </div>

      <section className="output-panel">
        <div className="output-heading" style={{ borderBottom: '1px solid #ececf0' }}>
          <TableOutlined /><strong>Output Target</strong>
          <button aria-label="Edit output target"><EditOutlined /></button>
          <div className="output-tabs" style={{ height: 42, marginLeft: 18, paddingLeft: 0, borderBottom: 'none' }}>
            <button style={{ height: 42, padding: '0 25px' }} className={activeTab === 'configuration' ? 'active' : ''} onClick={() => setActiveTab('configuration')}>Configuration</button>
            <button style={{ height: 42, padding: '0 25px' }} className={activeTab === 'data' ? 'active' : ''} onClick={() => setActiveTab('data')}>Data</button>
            <button style={{ height: 42, padding: '0 25px' }} className={activeTab === 'dataWarehouse' ? 'active' : ''} onClick={() => setActiveTab('dataWarehouse')}>DataWarehouse</button>
          </div>
        </div>
        <div className="output-content">
          {activeTab === 'configuration' && <div className="configuration-empty">Output target configuration</div>}
          {activeTab === 'data' && <DataPreview />}
          {activeTab === 'dataWarehouse' && (
            <DataWarehouseSettings
              partitionField={partitionField}
              setPartitionField={setPartitionField}
              partitionUnit={partitionUnit}
              setPartitionUnit={setPartitionUnit}
              bucketField={bucketField}
              setBucketField={setBucketField}
              bucketCount={bucketCount}
              setBucketCount={setBucketCount}
              backupCount={backupCount}
              setBackupCount={setBackupCount}
            />
          )}
        </div>
      </section>
    </div>
  )
}

function DataPreview() {
  return (
    <div className="data-preview">
      <div className="preview-table-wrap">
        <table>
          <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
          <tbody>{Array.from({ length: 10 }, (_, row) => <tr key={row}>{columns.map((column, index) => <td key={column}>{index === 0 ? '1000' : index === 1 ? '4546702505' : index === 2 ? 'Nathanael' : index === 3 ? 'R' : index === 4 ? 'Kennerly' : index === 5 ? '6124 Hardwood Street' : index === 7 ? 'Cliffside' : index === 8 ? 'BC' : index === 9 ? '10881' : ''}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="preview-footer"><span>1-100 of 1000</span><button disabled>‹</button><button className="current-page">1</button><button>2</button><button>3</button><button>4</button><span>...</span><button>10</button><button>›</button><label>Go to <input aria-label="Go to page" /></label></div>
    </div>
  )
}

export interface DataWarehouseSettingsProps {
  showType?: boolean
  partitionField: string
  setPartitionField: (value: string) => void
  partitionUnit: string
  setPartitionUnit: (value: string) => void
  bucketField: string
  setBucketField: (value: string) => void
  bucketCount: string
  setBucketCount: (value: string) => void
  backupCount: string
  setBackupCount: (value: string) => void
}

export function DataWarehouseSettings(props: DataWarehouseSettingsProps) {
  const [datePartitionEnabled, setDatePartitionEnabled] = useState(false)

  return (
    <>
      <style>{`.warehouse-settings .warehouse-section { border-top: none; padding-top: 12px; }.warehouse-type-row select,.warehouse-form-row select,.warehouse-form-row input,.backup-input-wrap input { width: 400px; min-width: 400px; background: #F2F2F2; }.date-partition-toggle { display: inline-flex; align-items: center; justify-content: space-between; width: 588px; margin-left: 0; margin-bottom: 16px; color: #41464f; }.toggle-switch { position: relative; width: 34px; height: 20px; padding: 0; border: 0; border-radius: 10px; background: #c7cbd2; cursor: pointer; transition: background .2s; }.toggle-switch.on { background: #f8663d; }.toggle-switch-thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .2s; }.toggle-switch.on .toggle-switch-thumb { transform: translateX(14px); }`}</style>
      <div className="warehouse-settings" style={{ width: '100%', maxWidth: 'none' }}>
      {props.showType !== false && <div className="warehouse-type-row"><label>DataWarehouse type</label><span>Doris</span></div>}
      <div className="warehouse-section"><h3>Partition</h3><div className="date-partition-toggle"><span>Enable Date Partition</span><button type="button" role="switch" aria-checked={datePartitionEnabled} aria-label="Enable Date Partition" className={`toggle-switch ${datePartitionEnabled ? 'on' : ''}`} onClick={() => setDatePartitionEnabled((enabled) => !enabled)}><span className="toggle-switch-thumb" /></button></div><div className="warehouse-form-row"><label htmlFor="partition-field">Partition date field</label><select id="partition-field" disabled={!datePartitionEnabled} value={props.partitionField} onChange={(e) => props.setPartitionField(e.target.value)}><option value="">Select a date field</option><option>OrderDate</option><option>CreatedDate</option><option>UpdatedDate</option></select></div><div className="warehouse-form-row"><label htmlFor="partition-unit">Partition by</label><select id="partition-unit" disabled={!datePartitionEnabled} value={props.partitionUnit} onChange={(e) => props.setPartitionUnit(e.target.value)}><option>Year</option><option>Month</option><option>Day</option></select></div></div>
      <div className="warehouse-section"><h3>Bucket</h3><div className="warehouse-form-row"><label htmlFor="bucket-field">Hash Column</label><select id="bucket-field" value={props.bucketField} onChange={(e) => props.setBucketField(e.target.value)}><option>CustomerID</option><option>AccountNumber</option><option>OrderID</option></select></div><div className="warehouse-form-row"><label htmlFor="bucket-count">Bucket count</label><input id="bucket-count" type="number" min="1" value={props.bucketCount} onChange={(e) => props.setBucketCount(e.target.value)} /></div></div>
      <div className="warehouse-section"><h3>Replication</h3><div className="warehouse-form-row"><label htmlFor="backup-count" style={{ alignSelf: 'flex-start', paddingTop: 8 }}>Replication Number <QuestionCircleOutlined title="Empty means default configured by the data warehouse service." style={{ marginLeft: 6, color: '#f8663d', cursor: 'help' }} /></label><div className="backup-input-wrap"><input id="backup-count" type="number" min="1" value={props.backupCount} onChange={(e) => props.setBackupCount(e.target.value)} /></div></div></div>
      <button className="warehouse-more" aria-label="More warehouse settings"><MoreOutlined /></button>
      </div>
    </>
  )
}
