import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/Layout'
import { Dashboard, JsonDataSourceDialogDesign, JsonDataSourceDialogDesign2, Security, Task } from '@/pages'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="data">
          <Route path="data-source">
            <Route path="json-datasource-dialog-design" element={<JsonDataSourceDialogDesign />} />
            <Route path="json-datasource-dialog-design2" element={<JsonDataSourceDialogDesign2 />} />
          </Route>
        </Route>
        <Route path="configuration">
          <Route path="scheduling">
            <Route path="security" element={<Security />} />
            <Route path="task" element={<Task />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
