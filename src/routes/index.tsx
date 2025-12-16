import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/Layout'
import { Dashboard, JsonDataSourceDialogDesign, JsonDataSourceDialogDesign2, Security, Task, AddTask, TasksCard, TaskManagement } from '@/pages'

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
            <Route path="add-task" element={<AddTask />} />
            <Route path="tasks-card" element={<TasksCard />} />
            <Route path="task-management" element={<TaskManagement />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
