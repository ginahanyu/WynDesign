import { useState } from 'react'
import '../JsonDataSourceDialogDesign/JsonDataSourceDialogDesign.css'
import './JsonDataSourceDialogDesign2.css'
import deleteIcon from '@/resource/delete.png'
import filterIcon from '@/resource/filter.svg'
import validateAllIcon from '@/resource/validateAll.png'
import duplicateIcon from '@/resource/duplicate.png'
import dateIcon from '@/resource/date.svg'
import booleanIcon from '@/resource/boolean.svg'

interface PreRequest {
  name: string
  url: string
  requestMethod: string
  parameters: PreRequestParameter[]
  variables: PreRequestVariable[]
  headers: PreRequestHeader[]
  authorization: string
  preRequest: string
}

interface PreRequestParameter {
  name: string
  dataType: string
  multivalued: string
  delimiter: string
  defaultValue: string
}

interface PreRequestVariable {
  variableName: string
  jsonPath: string
}

interface PreRequestHeader {
  key: string
  value: string
}

interface PreRequestPreviewData {
  preRequest: string
  variableName: string
  variableValue: string
}

interface BaseAddressParameter {
  name: string
  dataType: string
  multivalued: string
  delimiter: string
  defaultValue: string
}

interface BaseAddressHeader {
  key: string
  value: string
}

interface BaseAddress {
  name: string
  url: string
  preRequest: string
  parameters: BaseAddressParameter[]
  headers: BaseAddressHeader[]
}

interface EndpointHeader {
  key: string
  value: string
}

interface Endpoint {
  name: string
  baseAddress: string
  apiUrl: string
  validated: boolean
  requestMethod: string
  parameters: EndpointParameter[]
  headers: EndpointHeader[]
  authorization: string
  preRequest: string
  preQueryType: 'jsonPath' | 'sql'
  jsonPath: string
}

interface EndpointParameter {
  name: string
  dataType: string
  multivalued: string
  delimiter: string
  defaultValue: string
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

export function JsonDataSourceDialogDesign2() {
  const [name, setName] = useState('json-demo')
  const [sourceType, setSourceType] = useState('Web')
  const [queryTimeout, setQueryTimeout] = useState('')
  const [bypassSSL, setBypassSSL] = useState(false)
  const [preRequestExpanded, setPreRequestExpanded] = useState(true)
  const [baseAddressExpanded, setBaseAddressExpanded] = useState(true)
  const [endpointExpanded, setEndpointExpanded] = useState(true)

  const [preRequests, setPreRequests] = useState<PreRequest[]>([
    {
      name: 'user',
      url: 'http://172.16.10.30:3000/users?name=@name',
      requestMethod: 'GET',
      parameters: [
        { name: 'name', dataType: 'String', multivalued: 'False', delimiter: '', defaultValue: 'Leanne Graham' }
      ],
      variables: [
        { variableName: 'userId', jsonPath: '$[0].id' }
      ],
      headers: [
        { key: 'Key1', value: 'test' }
      ],
      authorization: 'None',
      preRequest: 'None'
    }
  ])

  const [baseAddresses, setBaseAddresses] = useState<BaseAddress[]>([
    {
      name: 'json-place-holder',
      url: 'http://172.16.10.30:3000/',
      preRequest: 'None',
      parameters: [
        { name: 'Parameter1', dataType: 'String', multivalued: 'False', delimiter: '', defaultValue: '' }
      ],
      headers: [
        { key: 'Key1', value: 'test' }
      ]
    }
  ])

  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    {
      name: 'posts',
      baseAddress: 'json-place-holder',
      apiUrl: 'posts?userId=${userId}',
      validated: true,
      requestMethod: 'GET',
      parameters: [
        { name: 'Parameter2', dataType: 'String', multivalued: 'False', delimiter: '', defaultValue: '' }
      ],
      headers: [
        { key: 'Key1', value: 'aaaa' }
      ],
      authorization: 'None',
      preRequest: 'user',
      preQueryType: 'jsonPath',
      jsonPath: '$.[*]'
    },
    {
      name: 'posts1',
      baseAddress: 'json-place-holder',
      apiUrl: 'posts?userId=${userId}',
      validated: true,
      requestMethod: 'GET',
      parameters: [],
      headers: [],
      authorization: 'None',
      preRequest: 'None',
      preQueryType: 'jsonPath',
      jsonPath: '$.[*]'
    },
    {
      name: 'posts2',
      baseAddress: 'json-place-holder',
      apiUrl: 'posts?userId=${userId}',
      validated: true,
      requestMethod: 'GET',
      parameters: [],
      headers: [],
      authorization: 'None',
      preRequest: 'None',
      preQueryType: 'jsonPath',
      jsonPath: '$.[*]'
    },
    {
      name: 'posts3',
      baseAddress: 'json-place-holder',
      apiUrl: 'posts?userId=${userId}',
      validated: true,
      requestMethod: 'GET',
      parameters: [],
      headers: [],
      authorization: 'None',
      preRequest: 'None',
      preQueryType: 'jsonPath',
      jsonPath: '$.[*]'
    },
  ])

  // Add row handlers
  const handleAddPreRequest = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newPreRequest: PreRequest = {
      name: '',
      url: '',
      requestMethod: 'GET',
      parameters: [],
      variables: [],
      headers: [],
      authorization: 'None',
      preRequest: 'None'
    }
    setPreRequests([...preRequests, newPreRequest])
    setSelectedTable('preRequest')
    setSelectedIndex(preRequests.length)
  }

  const handleAddBaseAddress = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newBaseAddress: BaseAddress = {
      name: '',
      url: '',
      preRequest: 'None',
      parameters: [],
      headers: []
    }
    setBaseAddresses([...baseAddresses, newBaseAddress])
    setSelectedTable('baseAddress')
    setSelectedIndex(baseAddresses.length)
  }

  const handleAddEndpoint = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newEndpoint: Endpoint = {
      name: '',
      baseAddress: '',
      apiUrl: '',
      validated: false,
      requestMethod: 'GET',
      parameters: [],
      headers: [],
      authorization: 'None',
      preRequest: 'None',
      preQueryType: 'jsonPath',
      jsonPath: '$.[*]'
    }
    setEndpoints([...endpoints, newEndpoint])
    setSelectedTable('endpoint')
    setSelectedIndex(endpoints.length)
  }

  // Unified selection state for all three tables
  const [selectedTable, setSelectedTable] = useState<'preRequest' | 'baseAddress' | 'endpoint'>('endpoint')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Error toast state
  const [errorToast, setErrorToast] = useState<string | null>(null)

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

  const handleDeleteBaseAddress = (index: number) => {
    const updated = baseAddresses.filter((_, i) => i !== index)
    setBaseAddresses(updated)
    if (selectedTable === 'baseAddress' && selectedIndex >= updated.length) {
      setSelectedIndex(Math.max(0, updated.length - 1))
    }
  }

  const handleDuplicateEndpoint = (index: number) => {
    const original = endpoints[index]
    const duplicated: Endpoint = { ...original, name: `${original.name}_copy` }
    const updated = [...endpoints]
    updated.splice(index + 1, 0, duplicated)
    setEndpoints(updated)
  }

  const handleDeleteEndpoint = (index: number) => {
    const updated = endpoints.filter((_, i) => i !== index)
    setEndpoints(updated)
    if (selectedTable === 'endpoint' && selectedIndex >= updated.length) {
      setSelectedIndex(Math.max(0, updated.length - 1))
    }
  }

  // ========== Postman-style Right Panel States ==========
  // Endpoint panel state
  const [endpointNameError, setEndpointNameError] = useState(false)
  const [activeTab, setActiveTab] = useState<'params' | 'authorization' | 'headers' | 'other'>('params')

  // Pre-Request panel state
  const [prReqNameError, setPrReqNameError] = useState(false)
  const [prReqActiveTab, setPrReqActiveTab] = useState<'params' | 'authorization' | 'headers' | 'other'>('params')
  const [prReqPreviewExpanded, setPrReqPreviewExpanded] = useState(true)
  const [prReqPreviewData] = useState<PreRequestPreviewData[]>([
    { preRequest: 'user', variableName: 'userId', variableValue: '1' }
  ])

  // Base Address panel state
  const [baNameError, setBaNameError] = useState(false)
  const [baActiveTab, setBaActiveTab] = useState<'params' | 'headers' | 'other'>('params')

  // Preview section
  const [previewExpanded, setPreviewExpanded] = useState(true)
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

  const [previewData] = useState<PreviewData[]>([
    { userId: 1, id: 1, title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', body: 'quia et suscipit suscipit recusandae consequuntur expedita...', date: '2025-11-21T00:00:00', teamsLink: 'Shang Qiangfei(Grayson) (??): 11.0.4 Filepreview?PDF?????? | ...', content: '????FilePreview?PDF?????? ? ?????File Preview??', version: '11.0.102.110.0.102.110.0.2.1', owner: 1, duration: 13.5, remark: '1.6875' },
    { userId: 1, id: 2, title: 'qui est esse', body: 'est rerum tempore vitae sequi sint nihil reprehenderit...', date: '2025-11-20T00:00:00', teamsLink: 'Zhang Hongyu(Gerald) (??): ????????????? | GrapeCity Softwar...', content: '??????????????????????????????????????????????????? ?...', version: '11.0.2.10', owner: 8, duration: null, remark: null },
    { userId: 1, id: 3, title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut', body: 'et iusto sed quo iure voluptatem occaecati omnis eligendi...', date: '2025-11-25T00:00:00', teamsLink: 'Shang Qiangfei(Grayson) (??): ?????? | GrapeCity Software > ??...', content: '?????????????????????????????????????????linux serve...', version: '11.0.102.2', owner: 1, duration: null, remark: null },
    { userId: 1, id: 4, title: 'eum et est occaecati', body: 'ullam et saepe reiciendis voluptatem adipisci sit amet...', date: '2025-11-19T00:00:00', teamsLink: 'Xu Jun(Joe) (??): 11.0.102??????????? | GrapeCity Software > ?????...', content: '????????,???????Forguncy Server& Forguncy buil...', version: '11.0.102.1', owner: 0.5, duration: null, remark: null },
    { userId: 1, id: 5, title: 'nesciunt quas odio', body: 'repudiandae veniam quaerat sunt sed alias aut fugiat sit...', date: '2025-11-27T00:00:00', teamsLink: 'Xue Yukun(Erik) (??): ?EL-??????????? | GrapeCity Software > ???...', content: 'EL_Selector????????designer? server?linux server', version: '11.0.2.2', owner: 1, duration: null, remark: null },
  ])

  return (
    <div className="json-datasource-dialog json-datasource-dialog-design2">
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
                      <td className="endpoint-action-cell">
                        <button
                          className="endpoint-action-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePreRequest(index)
                          }}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
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
                      <td className="endpoint-action-cell">
                        <button
                          className="endpoint-action-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteBaseAddress(index)
                          }}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
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
                      <td className="endpoint-action-cell">
                        <button
                          className="endpoint-action-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicateEndpoint(index)
                          }}
                          title="Duplicate"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                        <button
                          className="endpoint-action-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteEndpoint(index)
                          }}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Postman Style */}
      <div className="dialog-right-panel">
        {selectedTable === 'endpoint' && endpoints[selectedIndex] && (
          <div className="postman-panel">
            {/* Endpoint Name */}
            <div className="postman-name-row">
              <label className="postman-name-label">
                <span className="required-star">*</span> Name
              </label>
              <div className="postman-name-input-wrapper">
                <input
                  key={`endpoint-name-${selectedIndex}`}
                  type="text"
                  className={`postman-name-input ${endpointNameError ? 'invalid' : ''}`}
                  placeholder="Name"
                  defaultValue={endpoints[selectedIndex].name}
                  onBlur={(e) => {
                    const updated = [...endpoints]
                    updated[selectedIndex].name = e.target.value
                    setEndpoints(updated)
                    if (!e.target.value.trim()) setEndpointNameError(true)
                    else setEndpointNameError(false)
                  }}
                />
                {endpointNameError && (
                  <div className="postman-name-error-tooltip">
                    The name of the endpoint can not be empty, 'None' or 'All'
                  </div>
                )}
              </div>
            </div>

            {/* URL Bar */}
            <div className="postman-url-bar">
              <select
                className="postman-method-select"
                value={endpoints[selectedIndex].requestMethod}
                onChange={(e) => {
                  const updated = [...endpoints]
                  updated[selectedIndex].requestMethod = e.target.value
                  setEndpoints(updated)
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <select
                className={`postman-baseaddress-select ${!endpoints[selectedIndex].baseAddress ? 'placeholder' : ''}`}
                value={endpoints[selectedIndex].baseAddress || ''}
                onChange={(e) => {
                  const updated = [...endpoints]
                  updated[selectedIndex].baseAddress = e.target.value
                  setEndpoints(updated)
                }}
              >
                <option value="">Base Address</option>
                {baseAddresses.map((ba, index) => (
                  <option key={index} value={ba.name}>{ba.name}</option>
                ))}
              </select>
              <input
                key={`endpoint-url-${selectedIndex}`}
                type="text"
                className="postman-url-input"
                placeholder="Enter URL or paste text"
                defaultValue={endpoints[selectedIndex].apiUrl}
                onBlur={(e) => {
                  const updated = [...endpoints]
                  updated[selectedIndex].apiUrl = e.target.value
                  setEndpoints(updated)
                }}
              />
              <button className="postman-validate-btn">
                Validate
              </button>
            </div>

            {/* Tabs */}
            <div className="postman-tabs">
              <div className="postman-tabs-left">
                <button
                  className={`postman-tab ${activeTab === 'params' ? 'active' : ''}`}
                  onClick={() => setActiveTab('params')}
                >
                  Params
                </button>
                <button
                  className={`postman-tab ${activeTab === 'authorization' ? 'active' : ''}`}
                  onClick={() => setActiveTab('authorization')}
                >
                  Authorization
                </button>
                <button
                  className={`postman-tab ${activeTab === 'headers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('headers')}
                >
                  Headers
                </button>
                <button
                  className={`postman-tab ${activeTab === 'other' ? 'active' : ''}`}
                  onClick={() => setActiveTab('other')}
                >
                  Other
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="postman-tab-content">
              {/* Params Tab */}
              {activeTab === 'params' && (
                <div className="postman-params-tab">
                  {/* Parameter Section */}
                  <div className="param-section">
                    <div className="param-section-header">
                      <div className="param-section-title">
                        <span>Parameter</span>
                        <span className="help-icon">?</span>
                      </div>
                      <div className="param-section-line"></div>
                      <div className="param-section-actions">
                        <button className="icon-btn" onClick={() => {
                          const updated = [...endpoints]
                          updated[selectedIndex].parameters.push({ name: '', dataType: 'String', multivalued: 'False', delimiter: '', defaultValue: '' })
                          setEndpoints(updated)
                        }}>+</button>
                      </div>
                    </div>
                    <table className="param-table">
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
                        {endpoints[selectedIndex].parameters.map((param, pIndex) => (
                          <tr key={pIndex}>
                            <td>
                              <input
                                key={`ep-param-name-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.name}
                                onBlur={(e) => {
                                  const updated = [...endpoints]
                                  updated[selectedIndex].parameters[pIndex].name = e.target.value
                                  setEndpoints(updated)
                                }}
                              />
                            </td>
                            <td>
                              <div className="param-select-wrapper">
                                <select
                                  className="param-select"
                                  value={param.dataType}
                                  onChange={(e) => {
                                    const updated = [...endpoints]
                                    updated[selectedIndex].parameters[pIndex].dataType = e.target.value
                                    setEndpoints(updated)
                                  }}
                                >
                                  <option value="String">String</option>
                                  <option value="Integer">Integer</option>
                                  <option value="Float">Float</option>
                                  <option value="Boolean">Boolean</option>
                                  <option value="DateTime">DateTime</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className="param-select-wrapper">
                                <select
                                  className="param-select"
                                  value={param.multivalued}
                                  onChange={(e) => {
                                    const updated = [...endpoints]
                                    updated[selectedIndex].parameters[pIndex].multivalued = e.target.value
                                    setEndpoints(updated)
                                  }}
                                >
                                  <option value="False">False</option>
                                  <option value="True">True</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <input
                                key={`ep-param-delimiter-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.delimiter}
                                onBlur={(e) => {
                                  const updated = [...endpoints]
                                  updated[selectedIndex].parameters[pIndex].delimiter = e.target.value
                                  setEndpoints(updated)
                                }}
                              />
                            </td>
                            <td>
                              <input
                                key={`ep-param-default-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.defaultValue}
                                onBlur={(e) => {
                                  const updated = [...endpoints]
                                  updated[selectedIndex].parameters[pIndex].defaultValue = e.target.value
                                  setEndpoints(updated)
                                }}
                              />
                            </td>
                            <td className="param-action-cell">
                              <button
                                className="param-delete-btn"
                                onClick={() => {
                                  const updated = [...endpoints]
                                  updated[selectedIndex].parameters = updated[selectedIndex].parameters.filter((_, i) => i !== pIndex)
                                  setEndpoints(updated)
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Authorization Tab */}
              {activeTab === 'authorization' && (
                <div className="postman-auth-tab">
                  <div className="auth-row">
                    <label className="auth-label">Authorization</label>
                    <div className="auth-select-wrapper">
                      <select
                        className="auth-select"
                        value={endpoints[selectedIndex].authorization}
                        onChange={(e) => {
                          const updated = [...endpoints]
                          updated[selectedIndex].authorization = e.target.value
                          setEndpoints(updated)
                        }}
                      >
                        <option value="None">None</option>
                        <option value="Basic">Basic Auth</option>
                        <option value="Bearer">Bearer Token</option>
                        <option value="API Key">API Key</option>
                        <option value="OAuth 2.0">OAuth 2.0</option>
                      </select>
                      <button className="auth-add-btn">+</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Headers Tab */}
              {activeTab === 'headers' && (
                <div className="postman-headers-tab">
                  <div className="header-section">
                    <div className="header-section-header">
                      <div className="header-section-title">
                        <span>Header</span>
                        <span className="help-icon">?</span>
                      </div>
                      <div className="header-section-actions">
                        <button className="icon-btn" onClick={() => {
                          const updated = [...endpoints]
                          updated[selectedIndex].headers.push({ key: '', value: '' })
                          setEndpoints(updated)
                        }}>+</button>
                      </div>
                    </div>
                    <table className="header-table">
                      <thead>
                        <tr>
                          <th>Header Key</th>
                          <th>Header Value</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoints[selectedIndex].headers.map((header, hIndex) => (
                          <tr key={hIndex}>
                            <td>{header.key}</td>
                            <td>{header.value}</td>
                            <td className="header-action-cell">
                              <button className="icon-btn small" onClick={() => {
                                const updated = [...endpoints]
                                updated[selectedIndex].headers = updated[selectedIndex].headers.filter((_, i) => i !== hIndex)
                                setEndpoints(updated)
                              }}>
                                <img src={deleteIcon} alt="Delete" className="action-icon" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Other Tab */}
              {activeTab === 'other' && (
                <div className="postman-other-tab">
                  <div className="other-form-row">
                    <label className="other-label">Pre-Request</label>
                    <select
                      className="other-select"
                      value={endpoints[selectedIndex].preRequest}
                      onChange={(e) => {
                        const updated = [...endpoints]
                        updated[selectedIndex].preRequest = e.target.value
                        setEndpoints(updated)
                      }}
                    >
                      <option value="None">None</option>
                      {preRequests.map((pr, index) => (
                        <option key={index} value={pr.name}>{pr.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="other-form-row prequery-row">
                    <label className="other-label required">Pre-Query</label>
                    <div className="prequery-radio-group">
                      <label className="prequery-radio-label">
                        <input
                          type="radio"
                          name="preQuery"
                          checked={endpoints[selectedIndex].preQueryType === 'jsonPath'}
                          onChange={() => {
                            const updated = [...endpoints]
                            updated[selectedIndex].preQueryType = 'jsonPath'
                            setEndpoints(updated)
                          }}
                        />
                        <span className="prequery-radio-custom"></span>
                        Json Path
                      </label>
                      <label className="prequery-radio-label">
                        <input
                          type="radio"
                          name="preQuery"
                          checked={endpoints[selectedIndex].preQueryType === 'sql'}
                          onChange={() => {
                            const updated = [...endpoints]
                            updated[selectedIndex].preQueryType = 'sql'
                            setEndpoints(updated)
                          }}
                        />
                        <span className="prequery-radio-custom"></span>
                        SQL statement with Json functions
                      </label>
                    </div>
                  </div>
                  <div className="prequery-input-row">
                    {endpoints[selectedIndex].preQueryType === 'jsonPath' ? (
                      <input
                        key={`ep-jsonpath-${selectedIndex}`}
                        type="text"
                        className="prequery-input"
                        defaultValue={endpoints[selectedIndex].jsonPath}
                        onBlur={(e) => {
                          const updated = [...endpoints]
                          updated[selectedIndex].jsonPath = e.target.value
                          setEndpoints(updated)
                        }}
                      />
                    ) : (
                      <textarea
                        key={`ep-sql-${selectedIndex}`}
                        className="prequery-textarea"
                        defaultValue={endpoints[selectedIndex].jsonPath}
                        onBlur={(e) => {
                          const updated = [...endpoints]
                          updated[selectedIndex].jsonPath = e.target.value
                          setEndpoints(updated)
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Preview Section */}
            <div className={`preview-section ${previewExpanded ? 'expanded' : 'collapsed'}`}>
              <div className="preview-section-header" onClick={() => setPreviewExpanded(!previewExpanded)}>
                <div className="preview-section-title">
                  <span>Preview</span>
                </div>
                <div className={`preview-section-arrow ${previewExpanded ? 'expanded' : ''}`}></div>
              </div>
              {previewExpanded && (
                <div className="preview-section-content">
                  <div className="preview-table-wrapper">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          {columns.map((col) => (
                            <th key={col.key}>
                              <div className="column-header">
                                <div
                                  className="column-type-selector"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenDropdown(openDropdown === col.key ? null : col.key)
                                  }}
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
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleColumnTypeChange(col.key, 'Number')
                                      }}
                                    >
                                      <span className="dropdown-icon number">#</span>
                                      <span>Number</span>
                                    </div>
                                    <div
                                      className={`dropdown-item ${col.type === 'Text' ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleColumnTypeChange(col.key, 'Text')
                                      }}
                                    >
                                      <span className="dropdown-icon text">T</span>
                                      <span>Text</span>
                                    </div>
                                    <div
                                      className={`dropdown-item ${col.type === 'Date' ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleColumnTypeChange(col.key, 'Date')
                                      }}
                                    >
                                      <span className="dropdown-icon-wrapper"><img src={dateIcon} alt="Date" className="dropdown-icon-img" /></span>
                                      <span>Date</span>
                                    </div>
                                    <div
                                      className={`dropdown-item ${col.type === 'DateTime' ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleColumnTypeChange(col.key, 'DateTime')
                                      }}
                                    >
                                      <span className="dropdown-icon-wrapper"><img src={dateIcon} alt="DateTime" className="dropdown-icon-img" /></span>
                                      <span>DateTime</span>
                                    </div>
                                    <div
                                      className={`dropdown-item ${col.type === 'Boolean' ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleColumnTypeChange(col.key, 'Boolean')
                                      }}
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
          </div>
        )}

        {/* Pre-Request selected - show Pre-Request panel */}
        {selectedTable === 'preRequest' && preRequests[selectedIndex] && (
          <div className="postman-panel">
            {/* Pre-Request Name */}
            <div className="postman-name-row">
              <label className="postman-name-label">
                <span className="required-star">*</span> Name
              </label>
              <div className="postman-name-input-wrapper">
                <input
                  key={`prereq-name-${selectedIndex}`}
                  type="text"
                  className={`postman-name-input ${prReqNameError ? 'invalid' : ''}`}
                  placeholder="Name"
                  defaultValue={preRequests[selectedIndex].name}
                  onBlur={(e) => {
                    const updated = [...preRequests]
                    updated[selectedIndex].name = e.target.value
                    setPreRequests(updated)
                    if (!e.target.value.trim()) setPrReqNameError(true)
                    else setPrReqNameError(false)
                  }}
                />
                {prReqNameError && (
                  <div className="postman-name-error-tooltip">
                    The name of the endpoint can not be empty, 'None' or 'All'
                  </div>
                )}
              </div>
            </div>

            {/* URL Bar */}
            <div className="postman-url-bar">
              <select
                className="postman-method-select"
                value={preRequests[selectedIndex].requestMethod}
                onChange={(e) => {
                  const updated = [...preRequests]
                  updated[selectedIndex].requestMethod = e.target.value
                  setPreRequests(updated)
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input
                key={`prereq-url-${selectedIndex}`}
                type="text"
                className="postman-url-input"
                placeholder="Enter URL or paste text"
                defaultValue={preRequests[selectedIndex].url}
                onBlur={(e) => {
                  const updated = [...preRequests]
                  updated[selectedIndex].url = e.target.value
                  setPreRequests(updated)
                }}
              />
              <button className="postman-validate-btn">
                Validate
              </button>
            </div>

            {/* Tabs */}
            <div className="postman-tabs">
              <div className="postman-tabs-left">
                <button
                  className={`postman-tab ${prReqActiveTab === 'params' ? 'active' : ''}`}
                  onClick={() => setPrReqActiveTab('params')}
                >
                  Params
                </button>
                <button
                  className={`postman-tab ${prReqActiveTab === 'authorization' ? 'active' : ''}`}
                  onClick={() => setPrReqActiveTab('authorization')}
                >
                  Authorization
                </button>
                <button
                  className={`postman-tab ${prReqActiveTab === 'headers' ? 'active' : ''}`}
                  onClick={() => setPrReqActiveTab('headers')}
                >
                  Headers
                </button>
                <button
                  className={`postman-tab ${prReqActiveTab === 'other' ? 'active' : ''}`}
                  onClick={() => setPrReqActiveTab('other')}
                >
                  Other
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="postman-tab-content">
              {/* Params Tab */}
              {prReqActiveTab === 'params' && (
                <div className="postman-params-tab">
                  {/* Parameter Section */}
                  <div className="param-section">
                    <div className="param-section-header">
                      <div className="param-section-title">
                        <span>Parameter</span>
                        <span className="help-icon">?</span>
                      </div>
                      <div className="param-section-line"></div>
                      <div className="param-section-actions">
                        <button className="icon-btn" onClick={() => {
                          const updated = [...preRequests]
                          updated[selectedIndex].parameters.push({ name: '', dataType: 'String', multivalued: 'False', delimiter: '', defaultValue: '' })
                          setPreRequests(updated)
                        }}>+</button>
                      </div>
                    </div>
                    <table className="param-table">
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
                        {preRequests[selectedIndex].parameters.map((param, pIndex) => (
                          <tr key={pIndex}>
                            <td>
                              <input
                                key={`prereq-param-name-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.name}
                                onBlur={(e) => {
                                  const updated = [...preRequests]
                                  updated[selectedIndex].parameters[pIndex].name = e.target.value
                                  setPreRequests(updated)
                                }}
                              />
                            </td>
                            <td>
                              <div className="param-select-wrapper">
                                <select
                                  className="param-select"
                                  value={param.dataType}
                                  onChange={(e) => {
                                    const updated = [...preRequests]
                                    updated[selectedIndex].parameters[pIndex].dataType = e.target.value
                                    setPreRequests(updated)
                                  }}
                                >
                                  <option value="String">String</option>
                                  <option value="Integer">Integer</option>
                                  <option value="Float">Float</option>
                                  <option value="Boolean">Boolean</option>
                                  <option value="DateTime">DateTime</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className="param-select-wrapper">
                                <select
                                  className="param-select"
                                  value={param.multivalued}
                                  onChange={(e) => {
                                    const updated = [...preRequests]
                                    updated[selectedIndex].parameters[pIndex].multivalued = e.target.value
                                    setPreRequests(updated)
                                  }}
                                >
                                  <option value="False">False</option>
                                  <option value="True">True</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <input
                                key={`prereq-param-delimiter-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.delimiter}
                                onBlur={(e) => {
                                  const updated = [...preRequests]
                                  updated[selectedIndex].parameters[pIndex].delimiter = e.target.value
                                  setPreRequests(updated)
                                }}
                              />
                            </td>
                            <td>
                              <input
                                key={`prereq-param-default-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.defaultValue}
                                onBlur={(e) => {
                                  const updated = [...preRequests]
                                  updated[selectedIndex].parameters[pIndex].defaultValue = e.target.value
                                  setPreRequests(updated)
                                }}
                              />
                            </td>
                            <td>
                              <button className="param-delete-btn" onClick={() => {
                                const updated = [...preRequests]
                                updated[selectedIndex].parameters = updated[selectedIndex].parameters.filter((_, i) => i !== pIndex)
                                setPreRequests(updated)
                              }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Variable Section */}
                  <div className="param-section">
                    <div className="param-section-header">
                      <div className="param-section-title">
                        <span className="required-star">*</span>
                        <span>Variable</span>
                        <span className="help-icon">?</span>
                      </div>
                      <div className="param-section-line"></div>
                      <div className="param-section-actions">
                        <button className="icon-btn" onClick={() => {
                          const updated = [...preRequests]
                          updated[selectedIndex].variables.push({ variableName: '', jsonPath: '' })
                          setPreRequests(updated)
                        }}>+</button>
                      </div>
                    </div>
                    <table className="param-table">
                      <thead>
                        <tr>
                          <th>Variable Name</th>
                          <th>Json Path</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {preRequests[selectedIndex].variables.map((variable, vIndex) => (
                          <tr key={vIndex}>
                            <td>
                              <input
                                key={`prereq-var-name-${selectedIndex}-${vIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={variable.variableName}
                                onBlur={(e) => {
                                  const updated = [...preRequests]
                                  updated[selectedIndex].variables[vIndex].variableName = e.target.value
                                  setPreRequests(updated)
                                }}
                              />
                            </td>
                            <td>
                              <input
                                key={`prereq-var-jsonpath-${selectedIndex}-${vIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={variable.jsonPath}
                                onBlur={(e) => {
                                  const updated = [...preRequests]
                                  updated[selectedIndex].variables[vIndex].jsonPath = e.target.value
                                  setPreRequests(updated)
                                }}
                              />
                            </td>
                            <td>
                              <button className="param-delete-btn" onClick={() => {
                                const updated = [...preRequests]
                                updated[selectedIndex].variables = updated[selectedIndex].variables.filter((_, i) => i !== vIndex)
                                setPreRequests(updated)
                              }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Authorization Tab */}
              {prReqActiveTab === 'authorization' && (
                <div className="postman-auth-tab">
                  <div className="auth-row">
                    <label className="auth-label">Authorization</label>
                    <div className="auth-select-wrapper">
                      <select
                        className="auth-select"
                        value={preRequests[selectedIndex].authorization}
                        onChange={(e) => {
                          const updated = [...preRequests]
                          updated[selectedIndex].authorization = e.target.value
                          setPreRequests(updated)
                        }}
                      >
                        <option value="None">None</option>
                        <option value="Basic">Basic Auth</option>
                        <option value="Bearer">Bearer Token</option>
                        <option value="API Key">API Key</option>
                        <option value="OAuth 2.0">OAuth 2.0</option>
                      </select>
                      <button className="auth-add-btn">+</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Headers Tab */}
              {prReqActiveTab === 'headers' && (
                <div className="postman-headers-tab">
                  <div className="header-section">
                    <div className="header-section-header">
                      <div className="header-section-title">
                        <span>Header</span>
                        <span className="help-icon">?</span>
                      </div>
                      <div className="header-section-actions">
                        <button className="icon-btn" onClick={() => {
                          const updated = [...preRequests]
                          updated[selectedIndex].headers.push({ key: '', value: '' })
                          setPreRequests(updated)
                        }}>+</button>
                      </div>
                    </div>
                    <table className="header-table">
                      <thead>
                        <tr>
                          <th>Header Key</th>
                          <th>Header Value</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {preRequests[selectedIndex].headers.map((header, hIndex) => (
                          <tr key={hIndex}>
                            <td>{header.key}</td>
                            <td>{header.value}</td>
                            <td className="header-action-cell">
                              <button className="icon-btn small" onClick={() => {
                                const updated = [...preRequests]
                                updated[selectedIndex].headers = updated[selectedIndex].headers.filter((_, i) => i !== hIndex)
                                setPreRequests(updated)
                              }}>
                                <img src={deleteIcon} alt="Delete" className="action-icon" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Other Tab */}
              {prReqActiveTab === 'other' && (
                <div className="postman-other-tab">
                  <div className="other-form-row">
                    <label className="other-label">
                      <span>Pre-Request</span>
                      <span className="help-icon" style={{ marginLeft: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', border: '1px solid #999', borderRadius: '50%', fontSize: '11px', color: '#999' }}>?</span>
                    </label>
                    <select
                      className="other-select"
                      value={preRequests[selectedIndex].preRequest}
                      onChange={(e) => {
                        const updated = [...preRequests]
                        updated[selectedIndex].preRequest = e.target.value
                        setPreRequests(updated)
                      }}
                    >
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className={`preview-section ${prReqPreviewExpanded ? 'expanded' : 'collapsed'}`}>
              <div className="preview-section-header" onClick={() => setPrReqPreviewExpanded(!prReqPreviewExpanded)}>
                <div className="preview-section-title">
                  <span>Preview</span>
                </div>
                <div className={`preview-section-arrow ${prReqPreviewExpanded ? 'expanded' : ''}`}></div>
              </div>
              {prReqPreviewExpanded && (
                <div className="preview-section-content">
                  <div className="preview-table-wrapper">
                    <table className="preview-table prerequest-preview-table">
                      <thead>
                        <tr>
                          <th>Pre-Request</th>
                          <th>Variable Name</th>
                          <th>Variable Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prReqPreviewData.map((row, index) => (
                          <tr key={index}>
                            <td>{row.preRequest}</td>
                            <td>{row.variableName}</td>
                            <td>{row.variableValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Base Address selected - show Base Address panel */}
        {selectedTable === 'baseAddress' && baseAddresses[selectedIndex] && (
          <div className="postman-panel">
            {/* Base Address Name */}
            <div className="postman-name-row">
              <label className="postman-name-label">
                <span className="required-star">*</span> Name
              </label>
              <div className="postman-name-input-wrapper">
                <input
                  key={`ba-name-${selectedIndex}`}
                  type="text"
                  className={`postman-name-input ${baNameError ? 'invalid' : ''}`}
                  placeholder="Name"
                  defaultValue={baseAddresses[selectedIndex].name}
                  onBlur={(e) => {
                    const updated = [...baseAddresses]
                    updated[selectedIndex].name = e.target.value
                    setBaseAddresses(updated)
                    if (!e.target.value.trim()) setBaNameError(true)
                    else setBaNameError(false)
                  }}
                />
                {baNameError && (
                  <div className="postman-name-error-tooltip">
                    The name of the base address can not be empty
                  </div>
                )}
              </div>
            </div>

            {/* URL Row */}
            <div className="postman-name-row">
              <label className="postman-name-label">
                <span className="required-star">*</span> URL
              </label>
              <div className="postman-name-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  key={`ba-url-${selectedIndex}`}
                  type="text"
                  className="postman-name-input"
                  placeholder="Enter URL"
                  defaultValue={baseAddresses[selectedIndex].url}
                  onBlur={(e) => {
                    const updated = [...baseAddresses]
                    updated[selectedIndex].url = e.target.value
                    setBaseAddresses(updated)
                  }}
                />
                <button className="ba-validate-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e88a5d" strokeWidth="2">
                    <path d="M17 1l4 4-4 4" />
                    <path d="M3 11V9a4 4 0 014-4h14" />
                    <path d="M7 23l-4-4 4-4" />
                    <path d="M21 13v2a4 4 0 01-4 4H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="postman-tabs">
              <div className="postman-tabs-left">
                <button
                  className={`postman-tab ${baActiveTab === 'params' ? 'active' : ''}`}
                  onClick={() => setBaActiveTab('params')}
                >
                  Params
                </button>
                <button
                  className={`postman-tab ${baActiveTab === 'headers' ? 'active' : ''}`}
                  onClick={() => setBaActiveTab('headers')}
                >
                  Headers
                </button>
                <button
                  className={`postman-tab ${baActiveTab === 'other' ? 'active' : ''}`}
                  onClick={() => setBaActiveTab('other')}
                >
                  Other
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="postman-tab-content">
              {/* Params Tab */}
              {baActiveTab === 'params' && (
                <div className="postman-params-tab">
                  {/* Parameter Section */}
                  <div className="param-section">
                    <div className="param-section-header">
                      <div className="param-section-title">
                        <span>Parameter</span>
                        <span className="help-icon">?</span>
                      </div>
                      <div className="param-section-line"></div>
                      <div className="param-section-actions">
                        <button className="icon-btn" onClick={() => {
                          const updated = [...baseAddresses]
                          updated[selectedIndex].parameters.push({ name: '', dataType: 'String', multivalued: 'False', delimiter: '', defaultValue: '' })
                          setBaseAddresses(updated)
                        }}>+</button>
                      </div>
                    </div>
                    <table className="param-table">
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
                        {baseAddresses[selectedIndex].parameters.map((param, pIndex) => (
                          <tr key={pIndex}>
                            <td>
                              <input
                                key={`ba-param-name-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.name}
                                onBlur={(e) => {
                                  const updated = [...baseAddresses]
                                  updated[selectedIndex].parameters[pIndex].name = e.target.value
                                  setBaseAddresses(updated)
                                }}
                              />
                            </td>
                            <td>
                              <div className="param-select-wrapper">
                                <select
                                  className="param-select"
                                  value={param.dataType}
                                  onChange={(e) => {
                                    const updated = [...baseAddresses]
                                    updated[selectedIndex].parameters[pIndex].dataType = e.target.value
                                    setBaseAddresses(updated)
                                  }}
                                >
                                  <option value="String">String</option>
                                  <option value="Integer">Integer</option>
                                  <option value="Float">Float</option>
                                  <option value="Boolean">Boolean</option>
                                  <option value="DateTime">DateTime</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className="param-select-wrapper">
                                <select
                                  className="param-select"
                                  value={param.multivalued}
                                  onChange={(e) => {
                                    const updated = [...baseAddresses]
                                    updated[selectedIndex].parameters[pIndex].multivalued = e.target.value
                                    setBaseAddresses(updated)
                                  }}
                                >
                                  <option value="False">False</option>
                                  <option value="True">True</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <input
                                key={`ba-param-delimiter-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.delimiter}
                                onBlur={(e) => {
                                  const updated = [...baseAddresses]
                                  updated[selectedIndex].parameters[pIndex].delimiter = e.target.value
                                  setBaseAddresses(updated)
                                }}
                              />
                            </td>
                            <td>
                              <input
                                key={`ba-param-default-${selectedIndex}-${pIndex}`}
                                type="text"
                                className="param-input"
                                defaultValue={param.defaultValue}
                                onBlur={(e) => {
                                  const updated = [...baseAddresses]
                                  updated[selectedIndex].parameters[pIndex].defaultValue = e.target.value
                                  setBaseAddresses(updated)
                                }}
                              />
                            </td>
                            <td>
                              <button className="param-delete-btn" onClick={() => {
                                const updated = [...baseAddresses]
                                updated[selectedIndex].parameters = updated[selectedIndex].parameters.filter((_, i) => i !== pIndex)
                                setBaseAddresses(updated)
                              }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Headers Tab */}
              {baActiveTab === 'headers' && (
                <div className="postman-headers-tab">
                  <div className="header-section">
                    <div className="header-section-header">
                      <div className="header-section-title">
                        <span>Request Header</span>
                      </div>
                      <div className="header-section-actions">
                        <button className="icon-btn" onClick={() => {
                          const updated = [...baseAddresses]
                          updated[selectedIndex].headers.push({ key: '', value: '' })
                          setBaseAddresses(updated)
                        }}>+</button>
                      </div>
                    </div>
                    <table className="header-table">
                      <thead>
                        <tr>
                          <th>Header Key</th>
                          <th>Header Value</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {baseAddresses[selectedIndex].headers.map((header, hIndex) => (
                          <tr key={hIndex}>
                            <td>{header.key}</td>
                            <td>{header.value}</td>
                            <td className="header-action-cell">
                              <button className="icon-btn small" onClick={() => {
                                const updated = [...baseAddresses]
                                updated[selectedIndex].headers = updated[selectedIndex].headers.filter((_, i) => i !== hIndex)
                                setBaseAddresses(updated)
                              }}>
                                <img src={deleteIcon} alt="Delete" className="action-icon" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Other Tab */}
              {baActiveTab === 'other' && (
                <div className="postman-other-tab">
                  <div className="other-form-row">
                    <label className="other-label">Pre-Request</label>
                    <select
                      className="other-select"
                      value={baseAddresses[selectedIndex].preRequest}
                      onChange={(e) => {
                        const updated = [...baseAddresses]
                        updated[selectedIndex].preRequest = e.target.value
                        setBaseAddresses(updated)
                      }}
                    >
                      <option value="None">None</option>
                      {preRequests.map((pr, index) => (
                        <option key={index} value={pr.name}>{pr.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
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
