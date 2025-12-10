import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/Layout'
import { JsonDataSourceDialogDesign } from '@/pages'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/data/data-source/json-datasource-dialog-design" replace />} />
        <Route path="data">
          <Route path="data-source">
            <Route path="json-datasource-dialog-design" element={<JsonDataSourceDialogDesign />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
