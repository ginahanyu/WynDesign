import { useState } from 'react'
import './JsonDataSourceDialogDesign.css'
import deleteIcon from '@/resource/delete.png'
import filterIcon from '@/resource/filter.svg'
import validateAllIcon from '@/resource/validateAll.png'
import duplicateIcon from '@/resource/duplicate.png'
import dateIcon from '@/resource/date.svg'
import booleanIcon from '@/resource/boolean.svg'

interface PreRequest {
  name: string
  url: string
}

interface BaseAddress {
  name: string
  url: string
}

interface Endpoint {
  name: string
  baseAddress: string
  apiUrl: string
  validated: boolean
}

interface PreviewData {
  userId: number
  id: number
  title: string
  body: string
  date: string
  teamsLink: string
  content: string
  version: string
  owner: number | null
  duration: number | null
  remark: string | null
}

type ColumnType = 'Number' | 'Text' | 'Date' | 'DateTime' | 'Boolean'

interface ColumnConfig {
  key: string
  label: string
  type: ColumnType
}

const columnTypeIcons: Record<ColumnType, string> = {
  Number: '#',
  Text: 'T',
  Date: '📅',
  DateTime: '📅',
  Boolean: '✓/✗',
}

export function JsonDataSourceDialogDesign() {
  const [name, setName] = useState('json-demo')
  const [sourceType, setSourceType] = useState('Web')
  const [queryTimeout, setQueryTimeout] = useState('')
  const [bypassSSL, setBypassSSL] = useState(false)
  const [preRequestExpanded, setPreRequestExpanded] = useState(true)
  const [baseAddressExpanded, setBaseAddressExpanded] = useState(true)
  const [endpointExpanded, setEndpointExpanded] = useState(true)

  const [preRequests, setPreRequests] = useState<PreRequest[]>([
    { name: 'user', url: 'http://172.16.10.30:3000/users?name=@name' }
  ])

  const [baseAddresses, setBaseAddresses] = useState<BaseAddress[]>([
    { name: 'json-place-holder', url: 'http://172.16.10.30:3000/' }
  ])

  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    { name: 'posts', baseAddress: 'json-place-hol...', apiUrl: 'posts?userId=${userId}', validated: true },
    { name: 'posts1', baseAddress: 'json-place-hol...', apiUrl: 'posts?userId=${userId}', validated: true },
    { name: 'posts2', baseAddress: 'json-place-hol...', apiUrl: 'posts?userId=${userId}', validated: true },
    { name: 'posts3', baseAddress: 'json-place-hol...', apiUrl: 'posts?userId=${userId}', validated: true },
  ])

  // Add row handlers
  const handleAddPreRequest = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newPreRequest: PreRequest = { name: '', url: '' }
    setPreRequests([...preRequests, newPreRequest])
    setSelectedTable('preRequest')
    setSelectedIndex(preRequests.length)
  }

  const handleAddBaseAddress = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newBaseAddress: BaseAddress = { name: '', url: '' }
    setBaseAddresses([...baseAddresses, newBaseAddress])
    setSelectedTable('baseAddress')
    setSelectedIndex(baseAddresses.length)
  }

  const handleAddEndpoint = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newEndpoint: Endpoint = { name: '', baseAddress: '', apiUrl: '', validated: false }
    setEndpoints([...endpoints, newEndpoint])
    setSelectedTable('endpoint')
    setSelectedIndex(endpoints.length)
  }

  // Update handlers for Pre-Request
  const updatePreRequest = (index: number, field: keyof PreRequest, value: string) => {
    const updated = [...preRequests]
    updated[index] = { ...updated[index], [field]: value }
    setPreRequests(updated)
  }

  // Update handlers for Base Address
  const updateBaseAddress = (index: number, field: keyof BaseAddress, value: string) => {
    const updated = [...baseAddresses]
    updated[index] = { ...updated[index], [field]: value }
    setBaseAddresses(updated)
  }

  // Update handlers for Endpoint
  const updateEndpoint = (index: number, field: keyof Endpoint, value: string | boolean) => {
    const updated = [...endpoints]
    updated[index] = { ...updated[index], [field]: value }
    setEndpoints(updated)
  }

  // Unified selection state for all three tables
  const [selectedTable, setSelectedTable] = useState<'preRequest' | 'baseAddress' | 'endpoint'>('endpoint')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Validation function for required fields
  const validateCurrentSelection = (): boolean => {
    if (selectedTable === 'preRequest') {
      const current = preRequests[selectedIndex]
      if (!current) return true
      return !!(current.name && current.url)
    }
    if (selectedTable === 'baseAddress') {
      const current = baseAddresses[selectedIndex]
      if (!current) return true
      return !!(current.name && current.url)
    }
    if (selectedTable === 'endpoint') {
      const current = endpoints[selectedIndex]
      if (!current) return true
      return !!(current.name && current.apiUrl)
    }
    return true
  }

  // Check if specific field is invalid (empty required field)
  const isFieldInvalid = (table: string, index: number, field: string): boolean => {
    if (table === 'preRequest' && selectedTable === 'preRequest' && selectedIndex === index) {
      const current = preRequests[index]
      if (!current) return false
      if (field === 'name') return !current.name
      if (field === 'url') return !current.url
    }
    if (table === 'baseAddress' && selectedTable === 'baseAddress' && selectedIndex === index) {
      const current = baseAddresses[index]
      if (!current) return false
      if (field === 'name') return !current.name
      if (field === 'url') return !current.url
    }
    if (table === 'endpoint' && selectedTable === 'endpoint' && selectedIndex === index) {
      const current = endpoints[index]
      if (!current) return false
      if (field === 'name') return !current.name
      if (field === 'apiUrl') return !current.apiUrl
    }
    return false
  }

  // Get validation error message for a field
  const getFieldErrorMessage = (table: string, field: string): string => {
    if (table === 'preRequest') {
      if (field === 'name') return "The name of the pre-request can not be empty, 'None' or 'All'"
      if (field === 'url') return "The URL of the pre-request can not be empty"
    }
    if (table === 'baseAddress') {
      if (field === 'name') return "The name of the base address can not be empty, 'None' or 'All'"
      if (field === 'url') return "The URL of the base address can not be empty"
    }
    if (table === 'endpoint') {
      if (field === 'name') return "The name of the endpoint can not be empty, 'None' or 'All'"
      if (field === 'apiUrl') return "The API URL of the endpoint can not be empty"
    }
    return ""
  }

  const handleRowSelect = (table: 'preRequest' | 'baseAddress' | 'endpoint', index: number) => {
    // If selecting the same row, do nothing
    if (table === selectedTable && index === selectedIndex) return

    // Validate current selection before switching
    if (!validateCurrentSelection()) {
      setErrorToast("The operation failed: There are mandatory fields left unfilled. Please complete the required information or delete the incomplete items.")
      return // Prevent switching if validation fails
    }

    setSelectedTable(table)
    setSelectedIndex(index)
  }

  const handleDeletePreRequest = (index: number) => {
    const updated = preRequests.filter((_, i) => i !== index)
    setPreRequests(updated)
    if (selectedTable === 'preRequest' && selectedIndex >= updated.length) {
      setSelectedIndex(Math.max(0, updated.length - 1))
    }
  }

  // Endpoint action dropdown state
  const [endpointActionDropdown, setEndpointActionDropdown] = useState<number | null>(null)

  const handleEndpointMoreClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    if (endpointActionDropdown === index) {
      setEndpointActionDropdown(null)
    } else {
      setEndpointActionDropdown(index)
    }
  }

  const handleDuplicateEndpoint = (index: number) => {
    const original = endpoints[index]
    const duplicated: Endpoint = { ...original, name: `${original.name}_copy` }
    const updated = [...endpoints]
    updated.splice(index + 1, 0, duplicated)
    setEndpoints(updated)
    setEndpointActionDropdown(null)
  }

  const handleDeleteEndpoint = (index: number) => {
    const updated = endpoints.filter((_, i) => i !== index)
    setEndpoints(updated)
    setEndpointActionDropdown(null)
    if (selectedTable === 'endpoint' && selectedIndex >= updated.length) {
      setSelectedIndex(Math.max(0, updated.length - 1))
    }
  }

  const [activeTab, setActiveTab] = useState<'setting' | 'preview'>('setting')

  // Error toast state
  const [errorToast, setErrorToast] = useState<string | null>(null)

  // Pre-Request Preview Dialog state
  const [preRequestPreviewOpen, setPreRequestPreviewOpen] = useState(false)

  // Right panel settings
  const [requestMethod, setRequestMethod] = useState('GET')
  const [authorization, setAuthorization] = useState('None')
  const [preQueryType, setPreQueryType] = useState<'jsonPath' | 'sql'>('jsonPath')
  const [jsonPath, setJsonPath] = useState('$.[*]')
  const [advancedSettingExpanded, setAdvancedSettingExpanded] = useState(true)

  // Pre-Request setting states
  const [preRequestParamExpanded, setPreRequestParamExpanded] = useState(true)
  const [preRequestHeaderExpanded, setPreRequestHeaderExpanded] = useState(true)
  const [preRequestVariableExpanded, setPreRequestVariableExpanded] = useState(true)
  const [preRequestAdvancedExpanded, setPreRequestAdvancedExpanded] = useState(true)
  const [preRequestSettingPreRequest, setPreRequestSettingPreRequest] = useState('None')
  const [preRequestSettingMethod, setPreRequestSettingMethod] = useState('GET')
  const [preRequestSettingAuth, setPreRequestSettingAuth] = useState('None')

  // Pre-Request parameters data
  const [preRequestParams] = useState([
    { name: 'name', dataType: 'String', multivalued: 'False', delimiter: '', defaultValue: 'Leanne Graham' }
  ])

  // Pre-Request headers data
  const [preRequestHeaders] = useState([
    { key: 'Key1', value: 'test' }
  ])

  // Pre-Request variables data
  const [preRequestVariables] = useState([
    { name: 'userId', jsonPath: '$[0].id' }
  ])

  // Base Address setting states
  const [baseAddressPreRequest, setBaseAddressPreRequest] = useState('None')
  const [baseAddressParamExpanded, setBaseAddressParamExpanded] = useState(true)
  const [baseAddressAdvancedExpanded, setBaseAddressAdvancedExpanded] = useState(true)
  const [baseAddressHeaderExpanded, setBaseAddressHeaderExpanded] = useState(true)

  // Base Address parameters data
  const [baseAddressParams] = useState([
    { name: 'Parameter1', dataType: 'String', multivalued: 'False', delimiter: '', defaultValue: '' }
  ])

  // Base Address headers data
  const [baseAddressHeaders] = useState([
    { key: 'Key1', value: 'test' }
  ])

  // Column configurations
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'userId', label: 'userId', type: 'Number' },
    { key: 'id', label: 'id', type: 'Number' },
    { key: 'title', label: 'title', type: 'Text' },
    { key: 'body', label: 'body', type: 'Text' },
    { key: 'date', label: 'date', type: 'DateTime' },
    { key: 'teamsLink', label: 'teamsLink', type: 'Text' },
    { key: 'content', label: 'content', type: 'Text' },
    { key: 'version', label: 'version', type: 'Text' },
    { key: 'owner', label: 'owner', type: 'Number' },
    { key: 'duration', label: 'duration', type: 'Number' },
    { key: 'remark', label: 'remark', type: 'Text' },
  ])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleColumnTypeChange = (columnKey: string, newType: ColumnType) => {
    setColumns(columns.map(col =>
      col.key === columnKey ? { ...col, type: newType } : col
    ))
    setOpenDropdown(null)
  }

  // Preview data
  const [previewData] = useState<PreviewData[]>([
    { userId: 1, id: 1, title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', body: 'quia et suscipit suscipit recusandae consequuntur expedita...', date: '2025-11-21T00:00:00', teamsLink: 'Shang Qiangfei(Grayson) (??): 11.0.4 Filepreview?PDF?????? | ...', content: '????FilePreview?PDF?????? ? ?????File Preview??', version: '11.0.102.110.0.102.110.0.2.1', owner: 1, duration: 13.5, remark: '1.6875' },
    { userId: 1, id: 2, title: 'qui est esse', body: 'est rerum tempore vitae sequi sint nihil reprehenderit...', date: '2025-11-20T00:00:00', teamsLink: 'Zhang Hongyu(Gerald) (??): ????????????? | GrapeCity Softwar...', content: '??????????????????????????????????????????????????? ?...', version: '11.0.2.10', owner: 8, duration: null, remark: null },
    { userId: 1, id: 3, title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut', body: 'et iusto sed quo iure voluptatem occaecati omnis eligendi...', date: '2025-11-25T00:00:00', teamsLink: 'Shang Qiangfei(Grayson) (??): ?????? | GrapeCity Software > ??...', content: '?????????????????????????????????????????linux serve...', version: '11.0.102.2', owner: 1, duration: null, remark: null },
    { userId: 1, id: 4, title: 'eum et est occaecati', body: 'ullam et saepe reiciendis voluptatem adipisci sit amet...', date: '2025-11-19T00:00:00', teamsLink: 'Xu Jun(Joe) (??): 11.0.102??????????? | GrapeCity Software > ?????...', content: '????????,???????Forguncy Server& Forguncy buil...', version: '11.0.102.1', owner: 0.5, duration: null, remark: null },
    { userId: 1, id: 5, title: 'nesciunt quas odio', body: 'repudiandae veniam quaerat sunt sed alias aut fugiat sit...', date: '2025-11-27T00:00:00', teamsLink: 'Xue Yukun(Erik) (??): ?EL-??????????? | GrapeCity Software > ???...', content: 'EL_Selector????????designer? server?linux server', version: '11.0.2.2', owner: 1, duration: null, remark: null },
    { userId: 1, id: 6, title: 'dolorem eum magni eos aperiam quia', body: 'ut aspernatur corporis harum nihil quis provident sequi...', date: '2025-11-28T00:00:00', teamsLink: 'Shang Qiangfei(Grayson) (??): k8s OEM | GrapeCity Software ...', content: 'ARM OEM ???', version: '1.0.102.0', owner: 0.5, duration: null, remark: null },
    { userId: 1, id: 7, title: 'magnam facilis autem', body: 'dolore placeat quibusdam ea quo vitae magni quis enim...', date: '2025-11-18T00:00:00', teamsLink: 'Cheng Jie(Jack) (??): EL-???? ????????? | GrapeCity Software > ??...', content: 'EL????????????????????', version: '11.0.102.1', owner: 1, duration: null, remark: null },
    { userId: 1, id: 8, title: 'dolorem dolore est ipsam', body: 'dignissimos aperiam dolorem qui eum facilis quibusdam...', date: '2025-12-02T00:00:00', teamsLink: 'Sun Meng(Simon) (External): 11.0.102.0 ???????Failed to conve...', content: '??GUID???????????Designer?Server', version: '11.0.102.3', owner: 0.5, duration: null, remark: null },
    { userId: 1, id: 9, title: 'nesciunt iure omnis dolorem tempora et accusantium', body: 'consectetur animi nesciunt iure dolore enim quia ad...', date: 'null', teamsLink: 'null', content: 'null', version: 'null', owner: null, duration: null, remark: null },
  ])

  return (
    <div className="json-datasource-dialog">
      <div className="dialog-main">
        {/* Left Panel */}
        <div className="dialog-left-panel">
        {/* Name Field */}
        <div className="form-row">
          <label className="form-label required">Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Source Type */}
        <div className="form-row">
          <label className="form-label">Source Type</label>
          <select
            className="form-select"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
          >
            <option value="Web">Web</option>
            <option value="File">File</option>
          </select>
        </div>

        {/* Query Timeout */}
        <div className="form-row">
          <label className="form-label">Query Timeout(s)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Empty means use the database default query timeout"
            value={queryTimeout}
            onChange={(e) => setQueryTimeout(e.target.value)}
          />
        </div>

        {/* Bypass SSL Validation */}
        <div className="form-row">
          <label className="form-label">Bypass SSL Validation</label>
          <div className="toggle-wrapper">
            <span className="toggle-label">False</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={bypassSSL}
                onChange={(e) => setBypassSSL(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Pre-Request Section */}
        <div className="section-container">
          <div className="section-header" onClick={() => setPreRequestExpanded(!preRequestExpanded)}>
            <div className="section-title">
              <span className="required">Pre-Request</span>
              <span className="help-icon">?</span>
            </div>
            <div className="section-divider" />
            <div className="section-actions">
              <button className="icon-btn" onClick={handleAddPreRequest}>+</button>
              <span className={`section-arrow ${preRequestExpanded ? 'expanded' : ''}`} />
            </div>
          </div>
          {preRequestExpanded && (
            <div className="section-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {preRequests.map((item, index) => (
                    <tr
                      key={index}
                      className={selectedTable === 'preRequest' && selectedIndex === index ? 'selected-row' : ''}
                      onClick={() => handleRowSelect('preRequest', index)}
                    >
                      <td>{item.name || <span className="empty-cell">-</span>}</td>
                      <td>{item.url || <span className="empty-cell">-</span>}</td>
                      <td className="action-cell">
                        <button
                          className="icon-btn small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePreRequest(index)
                          }}
                        >
                          <img src={deleteIcon} alt="Delete" className="action-icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Base Address Section */}
        <div className="section-container">
          <div className="section-header" onClick={() => setBaseAddressExpanded(!baseAddressExpanded)}>
            <div className="section-title">Base Address</div>
            <div className="section-divider" />
            <div className="section-actions">
              <button className="icon-btn" onClick={handleAddBaseAddress}>+</button>
              <span className={`section-arrow ${baseAddressExpanded ? 'expanded' : ''}`} />
            </div>
          </div>
          {baseAddressExpanded && (
            <div className="section-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {baseAddresses.map((item, index) => (
                    <tr
                      key={index}
                      className={selectedTable === 'baseAddress' && selectedIndex === index ? 'selected-row' : ''}
                      onClick={() => handleRowSelect('baseAddress', index)}
                    >
                      <td>{item.name || <span className="empty-cell">-</span>}</td>
                      <td>{item.url || <span className="empty-cell">-</span>}</td>
                      <td className="action-cell">
                        <button className="icon-btn small">
                          <img src={deleteIcon} alt="Delete" className="action-icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Endpoint Section */}
        <div className="section-container">
          <div className="section-header" onClick={() => setEndpointExpanded(!endpointExpanded)}>
            <div className="section-title">
              <span className="required">Endpoint</span>
            </div>
            <div className="section-divider" />
            <div className="section-actions">
              <button className="icon-btn"><img src={filterIcon} alt="Filter" className="action-icon" /></button>
              <button className="icon-btn"><img src={validateAllIcon} alt="Validate All" className="action-icon" /></button>
              <button className="icon-btn" onClick={handleAddEndpoint}>+</button>
              <span className={`section-arrow ${endpointExpanded ? 'expanded' : ''}`} />
            </div>
          </div>
          {endpointExpanded && (
            <div className="section-content">
              <table className="data-table endpoint-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Base Address</th>
                    <th>API Url</th>
                    <th>Validated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((item, index) => (
                    <tr
                      key={index}
                      className={selectedTable === 'endpoint' && selectedIndex === index ? 'selected-row' : ''}
                      onClick={() => handleRowSelect('endpoint', index)}
                    >
                      <td>{item.name || <span className="empty-cell">-</span>}</td>
                      <td>{item.baseAddress || <span className="empty-cell">-</span>}</td>
                      <td>{item.apiUrl || <span className="empty-cell">-</span>}</td>
                      <td>
                        {item.validated ? (
                          <span className="validated-badge">
                            <span className="check-icon">✓</span> Yes
                          </span>
                        ) : (
                          <span className="empty-cell">-</span>
                        )}
                      </td>
                      <td className="action-cell">
                        <div className="row-action-wrapper">
                          <button
                            className="icon-btn small"
                            onClick={(e) => handleEndpointMoreClick(e, index)}
                          >
                            ⋮
                          </button>
                          {endpointActionDropdown === index && (
                            <div className="row-action-dropdown">
                              <div
                                className="row-action-item"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDuplicateEndpoint(index)
                                }}
                              >
                                <img src={duplicateIcon} alt="Duplicate" className="row-action-icon-img" />
                                <span>Duplicate</span>
                              </div>
                              <div
                                className="row-action-item delete"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteEndpoint(index)
                                }}
                              >
                                <img src={deleteIcon} alt="Delete" className="row-action-icon-img" />
                                <span>Delete</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="dialog-right-panel">
        {/* Pre-Request selected - no tabs, show content directly */}
        {selectedTable === 'preRequest' && (
          <div className="right-panel-content pre-request-setting">
              {/* Basic Setting */}
              <div className="setting-section">
                <div className="setting-section-title">Basic Setting</div>

                {/* Name */}
                <div className="form-row">
                  <label className="form-label required">Name</label>
                  <div className="input-with-tooltip">
                    <input
                      type="text"
                      className={`form-input ${isFieldInvalid('preRequest', selectedIndex, 'name') ? 'invalid' : ''}`}
                      value={preRequests[selectedIndex]?.name || ''}
                      onChange={(e) => updatePreRequest(selectedIndex, 'name', e.target.value)}
                    />
                    {isFieldInvalid('preRequest', selectedIndex, 'name') && (
                      <div className="validation-tooltip">{getFieldErrorMessage('preRequest', 'name')}</div>
                    )}
                  </div>
                </div>

                {/* URL */}
                <div className="form-row">
                  <label className="form-label required">URL</label>
                  <div className="form-control-with-icon">
                    <div className="input-with-tooltip" style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={`form-input ${isFieldInvalid('preRequest', selectedIndex, 'url') ? 'invalid' : ''}`}
                        value={preRequests[selectedIndex]?.url || ''}
                        onChange={(e) => updatePreRequest(selectedIndex, 'url', e.target.value)}
                      />
                      {isFieldInvalid('preRequest', selectedIndex, 'url') && (
                        <div className="validation-tooltip">{getFieldErrorMessage('preRequest', 'url')}</div>
                      )}
                    </div>
                    <button className="icon-btn setting-icon">⇄</button>
                  </div>
                </div>

                {/* Parameter Section */}
                <div className="section-container">
                  <div className="section-header" onClick={() => setPreRequestParamExpanded(!preRequestParamExpanded)}>
                    <div className="section-title">
                      <span>Parameter</span>
                      <span className="help-icon">?</span>
                    </div>
                    <div className="section-divider" />
                    <div className="section-actions">
                      <button className="icon-btn">+</button>
                      <span className={`section-arrow ${preRequestParamExpanded ? 'expanded' : ''}`} />
                    </div>
                  </div>
                  {preRequestParamExpanded && (
                    <div className="section-content">
                      <table className="data-table param-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Data Type</th>
                            <th>Multivalued</th>
                            <th>Delimiter</th>
                            <th>Default value</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {preRequestParams.map((param, index) => (
                            <tr key={index}>
                              <td>{param.name}</td>
                              <td>
                                <div className="cell-with-dropdown">
                                  {param.dataType}
                                  <span className="cell-dropdown-arrow">∨</span>
                                </div>
                              </td>
                              <td>
                                <div className="cell-with-dropdown">
                                  {param.multivalued}
                                  <span className="cell-dropdown-arrow">∨</span>
                                </div>
                              </td>
                              <td>{param.delimiter}</td>
                              <td>{param.defaultValue}</td>
                              <td className="action-cell">
                                <button className="icon-btn small">🗑</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Request Method */}
                <div className="form-row">
                  <label className="form-label required">Request Method</label>
                  <select
                    className="form-select"
                    value={preRequestSettingMethod}
                    onChange={(e) => setPreRequestSettingMethod(e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                {/* Variable Section */}
                <div className="section-container">
                  <div className="section-header" onClick={() => setPreRequestVariableExpanded(!preRequestVariableExpanded)}>
                    <div className="section-title">
                      <span className="required">Variable</span>
                      <span className="help-icon">?</span>
                    </div>
                    <div className="section-divider" />
                    <div className="section-actions">
                      <button className="icon-btn">+</button>
                      <span className={`section-arrow ${preRequestVariableExpanded ? 'expanded' : ''}`} />
                    </div>
                  </div>
                  {preRequestVariableExpanded && (
                    <div className="section-content">
                      <table className="data-table variable-table">
                        <thead>
                          <tr>
                            <th>Variable Name</th>
                            <th>Json Path</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {preRequestVariables.map((variable, index) => (
                            <tr key={index}>
                              <td>{variable.name}</td>
                              <td>{variable.jsonPath}</td>
                              <td className="action-cell">
                                <button className="icon-btn small">🗑</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Setting */}
              <div className="setting-section">
                <div
                  className="setting-section-header"
                  onClick={() => setPreRequestAdvancedExpanded(!preRequestAdvancedExpanded)}
                >
                  <div className="setting-section-title">Advanced Setting</div>
                  <div className="section-divider" />
                  <span className={`section-arrow ${preRequestAdvancedExpanded ? 'expanded' : ''}`} />
                </div>

                {preRequestAdvancedExpanded && (
                  <div className="setting-section-content">
                    {/* Request Header Section */}
                    <div className="section-container">
                      <div className="section-header" onClick={() => setPreRequestHeaderExpanded(!preRequestHeaderExpanded)}>
                        <div className="section-title">Request Header</div>
                        <div className="section-divider" />
                        <div className="section-actions">
                          <button className="icon-btn">+</button>
                          <span className={`section-arrow ${preRequestHeaderExpanded ? 'expanded' : ''}`} />
                        </div>
                      </div>
                      {preRequestHeaderExpanded && (
                        <div className="section-content">
                          <table className="data-table header-table">
                            <thead>
                              <tr>
                                <th>Header Key</th>
                                <th>Header Value</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {preRequestHeaders.map((header, index) => (
                                <tr key={index}>
                                  <td>{header.key}</td>
                                  <td>{header.value}</td>
                                  <td className="action-cell">
                                    <button className="icon-btn small">🗑</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Authorization */}
                    <div className="form-row">
                      <label className="form-label">Authorization</label>
                      <div className="authorization-row">
                        <select
                          className="form-select"
                          value={preRequestSettingAuth}
                          onChange={(e) => setPreRequestSettingAuth(e.target.value)}
                        >
                          <option value="None">None</option>
                          <option value="Basic">Basic</option>
                          <option value="Bearer">Bearer</option>
                        </select>
                        <button className="icon-btn">+</button>
                      </div>
                    </div>

                    {/* Pre-Request Dropdown */}
                    <div className="form-row">
                      <label className="form-label">
                        <span>Pre-Request</span>
                        <span className="help-icon">?</span>
                      </label>
                      <div className="form-control-with-icon">
                        <select
                          className="form-select"
                          value={preRequestSettingPreRequest}
                          onChange={(e) => setPreRequestSettingPreRequest(e.target.value)}
                        >
                          <option value="None">None</option>
                        </select>
                        <button className="icon-btn setting-icon">⇄</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => setPreRequestPreviewOpen(true)}>Preview</button>
              </div>
          </div>
        )}

        {/* Pre-Request Preview Dialog */}
        {preRequestPreviewOpen && (
          <div className="modal-overlay" onClick={() => setPreRequestPreviewOpen(false)}>
            <div className="modal-dialog pre-request-preview-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Preview Pre-Request</span>
                <button className="modal-close-btn" onClick={() => setPreRequestPreviewOpen(false)}>×</button>
              </div>
              <div className="modal-body">
                <table className="preview-request-table">
                  <thead>
                    <tr>
                      <th>Pre-Request</th>
                      <th>Variable Name</th>
                      <th>Variable Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>user</td>
                      <td>userId</td>
                      <td>1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setPreRequestPreviewOpen(false)}>OK</button>
              </div>
            </div>
          </div>
        )}

        {/* Base Address selected - no tabs, show content directly */}
        {selectedTable === 'baseAddress' && (
          <div className="right-panel-content base-address-setting">
            {/* Basic Setting */}
            <div className="setting-section">
              <div className="setting-section-title">Basic Setting</div>

              {/* Name */}
              <div className="form-row">
                <label className="form-label required">Name</label>
                <div className="input-with-tooltip">
                  <input
                    type="text"
                    className={`form-input ${isFieldInvalid('baseAddress', selectedIndex, 'name') ? 'invalid' : ''}`}
                    value={baseAddresses[selectedIndex]?.name || ''}
                    onChange={(e) => updateBaseAddress(selectedIndex, 'name', e.target.value)}
                  />
                  {isFieldInvalid('baseAddress', selectedIndex, 'name') && (
                    <div className="validation-tooltip">{getFieldErrorMessage('baseAddress', 'name')}</div>
                  )}
                </div>
              </div>

              {/* URL */}
              <div className="form-row">
                <label className="form-label required">URL</label>
                <div className="form-control-with-icon">
                  <div className="input-with-tooltip" style={{ flex: 1 }}>
                    <input
                      type="text"
                      className={`form-input ${isFieldInvalid('baseAddress', selectedIndex, 'url') ? 'invalid' : ''}`}
                      value={baseAddresses[selectedIndex]?.url || ''}
                      onChange={(e) => updateBaseAddress(selectedIndex, 'url', e.target.value)}
                    />
                    {isFieldInvalid('baseAddress', selectedIndex, 'url') && (
                      <div className="validation-tooltip">{getFieldErrorMessage('baseAddress', 'url')}</div>
                    )}
                  </div>
                  <button className="icon-btn setting-icon">⇄</button>
                </div>
              </div>

              {/* Pre-Request */}
              <div className="form-row">
                <label className="form-label">Pre-Request</label>
                <select
                  className="form-select"
                  value={baseAddressPreRequest}
                  onChange={(e) => setBaseAddressPreRequest(e.target.value)}
                >
                  <option value="None">None</option>
                </select>
              </div>

              {/* Parameter Section */}
              <div className="section-container">
                <div className="section-header" onClick={() => setBaseAddressParamExpanded(!baseAddressParamExpanded)}>
                  <div className="section-title">
                    <span>Parameter</span>
                    <span className="help-icon">?</span>
                  </div>
                  <div className="section-divider" />
                  <div className="section-actions">
                    <button className="icon-btn">+</button>
                    <span className={`section-arrow ${baseAddressParamExpanded ? 'expanded' : ''}`} />
                  </div>
                </div>
                {baseAddressParamExpanded && (
                  <div className="section-content">
                    <table className="data-table param-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Data Type</th>
                          <th>Multivalued</th>
                          <th>Delimiter</th>
                          <th>Default value</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {baseAddressParams.map((param, index) => (
                          <tr key={index}>
                            <td>{param.name}</td>
                            <td>
                              <div className="cell-with-dropdown">
                                {param.dataType}
                                <span className="cell-dropdown-arrow">∨</span>
                              </div>
                            </td>
                            <td>
                              <div className="cell-with-dropdown">
                                {param.multivalued}
                                <span className="cell-dropdown-arrow">∨</span>
                              </div>
                            </td>
                            <td>{param.delimiter}</td>
                            <td>{param.defaultValue}</td>
                            <td className="action-cell">
                              <button className="icon-btn small">🗑</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Setting */}
            <div className="setting-section">
              <div
                className="setting-section-header"
                onClick={() => setBaseAddressAdvancedExpanded(!baseAddressAdvancedExpanded)}
              >
                <div className="setting-section-title">Advanced Setting</div>
                <div className="section-divider" />
                <span className={`section-arrow ${baseAddressAdvancedExpanded ? 'expanded' : ''}`} />
              </div>

              {baseAddressAdvancedExpanded && (
                <div className="setting-section-content">
                  {/* Request Header Section */}
                  <div className="section-container">
                    <div className="section-header" onClick={() => setBaseAddressHeaderExpanded(!baseAddressHeaderExpanded)}>
                      <div className="section-title">Request Header</div>
                      <div className="section-divider" />
                      <div className="section-actions">
                        <button className="icon-btn">+</button>
                        <span className={`section-arrow ${baseAddressHeaderExpanded ? 'expanded' : ''}`} />
                      </div>
                    </div>
                    {baseAddressHeaderExpanded && (
                      <div className="section-content">
                        <table className="data-table header-table">
                          <thead>
                            <tr>
                              <th>Header Key</th>
                              <th>Header Value</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {baseAddressHeaders.map((header, index) => (
                              <tr key={index}>
                                <td>{header.key}</td>
                                <td>{header.value}</td>
                                <td className="action-cell">
                                  <button className="icon-btn small">🗑</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Endpoint - with tabs */}
        {selectedTable === 'endpoint' && (
          <>
            {/* Tabs */}
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'setting' ? 'active' : ''}`}
                onClick={() => setActiveTab('setting')}
              >
                Setting
              </button>
              <button
                className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                PreviewAndSchema
              </button>
            </div>

            <div className="tabs-content">

              {activeTab === 'setting' && selectedTable === 'endpoint' && (
            <div className="setting-tab">
              {/* Basic Setting */}
              <div className="setting-section">
                <div className="setting-section-title">Basic Setting</div>

                {/* Name */}
                <div className="form-row">
                  <label className="form-label required">Name</label>
                  <div className="input-with-tooltip">
                    <input
                      type="text"
                      className={`form-input ${isFieldInvalid('endpoint', selectedIndex, 'name') ? 'invalid' : ''}`}
                      value={endpoints[selectedIndex]?.name || ''}
                      onChange={(e) => updateEndpoint(selectedIndex, 'name', e.target.value)}
                    />
                    {isFieldInvalid('endpoint', selectedIndex, 'name') && (
                      <div className="validation-tooltip">{getFieldErrorMessage('endpoint', 'name')}</div>
                    )}
                  </div>
                </div>

                {/* Base Address */}
                <div className="form-row">
                  <label className="form-label">Base Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={endpoints[selectedIndex]?.baseAddress || ''}
                    onChange={(e) => updateEndpoint(selectedIndex, 'baseAddress', e.target.value)}
                  />
                </div>

                {/* API Url */}
                <div className="form-row">
                  <label className="form-label required">API Url</label>
                  <div className="input-with-tooltip">
                    <input
                      type="text"
                      className={`form-input ${isFieldInvalid('endpoint', selectedIndex, 'apiUrl') ? 'invalid' : ''}`}
                      value={endpoints[selectedIndex]?.apiUrl || ''}
                      onChange={(e) => updateEndpoint(selectedIndex, 'apiUrl', e.target.value)}
                    />
                    {isFieldInvalid('endpoint', selectedIndex, 'apiUrl') && (
                      <div className="validation-tooltip">{getFieldErrorMessage('endpoint', 'apiUrl')}</div>
                    )}
                  </div>
                </div>

                {/* Request Method */}
                <div className="form-row">
                  <label className="form-label required">Request Method</label>
                  <select
                    className="form-select"
                    value={requestMethod}
                    onChange={(e) => setRequestMethod(e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                {/* Endpoint Parameter */}
                <div className="form-row">
                  <label className="form-label">
                    Endpoint Parameter
                    <span className="help-icon">?</span>
                  </label>
                  <div className="section-actions-inline">
                    <button className="icon-btn">+</button>
                    <span className="nav-arrow">›</span>
                  </div>
                </div>

                {/* Pre-Query */}
                <div className="form-row">
                  <label className="form-label required">Pre-Query</label>
                  <div className="pre-query-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="preQuery"
                        checked={preQueryType === 'jsonPath'}
                        onChange={() => setPreQueryType('jsonPath')}
                      />
                      <span className="radio-custom"></span>
                      Json Path
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="preQuery"
                        checked={preQueryType === 'sql'}
                        onChange={() => setPreQueryType('sql')}
                      />
                      <span className="radio-custom"></span>
                      SQL statement with Json functions
                    </label>
                  </div>
                </div>

                {/* Json Path Input */}
                <div className="form-row json-path-row">
                  <input
                    type="text"
                    className="form-input"
                    value={jsonPath}
                    onChange={(e) => setJsonPath(e.target.value)}
                  />
                </div>
              </div>

              {/* Advanced Setting */}
              <div className="setting-section">
                <div
                  className="setting-section-header"
                  onClick={() => setAdvancedSettingExpanded(!advancedSettingExpanded)}
                >
                  <div className="setting-section-title">Advanced Setting</div>
                  <div className="section-divider" />
                  <span className={`section-arrow ${advancedSettingExpanded ? 'expanded' : ''}`} />
                </div>

                {advancedSettingExpanded && (
                  <div className="setting-section-content">
                    {/* Authorization */}
                    <div className="form-row">
                      <label className="form-label">Authorization</label>
                      <div className="authorization-row">
                        <select
                          className="form-select"
                          value={authorization}
                          onChange={(e) => setAuthorization(e.target.value)}
                        >
                          <option value="None">None</option>
                          <option value="Basic">Basic</option>
                          <option value="Bearer">Bearer</option>
                        </select>
                        <button className="icon-btn">+</button>
                      </div>
                    </div>

                    {/* Endpoint Header */}
                    <div className="form-row">
                      <label className="form-label">Endpoint Header</label>
                      <div className="section-actions-inline">
                        <button className="icon-btn">+</button>
                        <span className="nav-arrow">›</span>
                      </div>
                    </div>

                    {/* Pre-Request */}
                    <div className="form-row">
                      <label className="form-label">Pre-Request</label>
                      <div className="section-actions-inline">
                        <button className="icon-btn">+</button>
                        <span className="nav-arrow">›</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn btn-primary">Validate</button>
                <button className="btn btn-primary">Preview Requ...</button>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="preview-tab">
              <div className="preview-table-wrapper">
                <table className="preview-table">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key}>
                          <div className="column-header">
                            <div
                              className="column-type-selector"
                              onClick={() => setOpenDropdown(openDropdown === col.key ? null : col.key)}
                            >
                              {(col.type === 'Date' || col.type === 'DateTime') ? (
                                <img src={dateIcon} alt={col.type} className="column-type-icon-img" />
                              ) : col.type === 'Boolean' ? (
                                <img src={booleanIcon} alt="Boolean" className="column-type-icon-img" />
                              ) : (
                                <span className={`column-type-icon ${col.type.toLowerCase()}`}>
                                  {columnTypeIcons[col.type]}
                                </span>
                              )}
                              <span className="column-type-arrow"></span>
                            </div>
                            <span className="column-label">{col.label}</span>
                            {openDropdown === col.key && (
                              <div className="column-type-dropdown">
                                <div
                                  className={`dropdown-item ${col.type === 'Number' ? 'active' : ''}`}
                                  onClick={() => handleColumnTypeChange(col.key, 'Number')}
                                >
                                  <span className="dropdown-icon number">#</span>
                                  <span>Number</span>
                                </div>
                                <div
                                  className={`dropdown-item ${col.type === 'Text' ? 'active' : ''}`}
                                  onClick={() => handleColumnTypeChange(col.key, 'Text')}
                                >
                                  <span className="dropdown-icon text">T</span>
                                  <span>Text</span>
                                </div>
                                <div
                                  className={`dropdown-item ${col.type === 'Date' ? 'active' : ''}`}
                                  onClick={() => handleColumnTypeChange(col.key, 'Date')}
                                >
                                  <span className="dropdown-icon-wrapper"><img src={dateIcon} alt="Date" className="dropdown-icon-img" /></span>
                                  <span>Date</span>
                                </div>
                                <div
                                  className={`dropdown-item ${col.type === 'DateTime' ? 'active' : ''}`}
                                  onClick={() => handleColumnTypeChange(col.key, 'DateTime')}
                                >
                                  <span className="dropdown-icon-wrapper"><img src={dateIcon} alt="DateTime" className="dropdown-icon-img" /></span>
                                  <span>DateTime</span>
                                </div>
                                <div
                                  className={`dropdown-item ${col.type === 'Boolean' ? 'active' : ''}`}
                                  onClick={() => handleColumnTypeChange(col.key, 'Boolean')}
                                >
                                  <span className="dropdown-icon-wrapper"><img src={booleanIcon} alt="Boolean" className="dropdown-icon-img" /></span>
                                  <span>Boolean</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.userId}</td>
                        <td>{row.id}</td>
                        <td>{row.title}</td>
                        <td>{row.body}</td>
                        <td>{row.date}</td>
                        <td>{row.teamsLink}</td>
                        <td>{row.content}</td>
                        <td>{row.version}</td>
                        <td>{row.owner ?? 'null'}</td>
                        <td>{row.duration ?? 'null'}</td>
                        <td>{row.remark ?? 'null'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
            </div>
          </>
        )}
      </div>
      </div>

      {/* Error Toast */}
      {errorToast && (
        <div className="error-toast">
          <div className="error-toast-icon">
            <span className="error-check">✓</span>
          </div>
          <div className="error-toast-content">
            <div className="error-toast-message">{errorToast}</div>
            <div className="error-toast-actions">
              <button className="error-toast-btn" onClick={() => setErrorToast(null)}>Show Details</button>
              <button className="error-toast-btn" onClick={() => setErrorToast(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="dialog-footer">
        <button className="btn btn-secondary">Previous</button>
        <button className="btn btn-primary">Update</button>
      </div>
    </div>
  )
}
