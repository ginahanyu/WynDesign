import { MenuItem } from '@/types/menu'

export const menuConfig: MenuItem[] = [
  {
    key: 'data',
    label: 'Data',
    children: [
      {
        key: 'data-source',
        label: 'Data Source',
        children: [
          {
            key: 'json-datasource-dialog-design2',
            label: 'Json DataSource Dialog Design2',
            path: '/data/data-source/json-datasource-dialog-design2',
          },
        ],
      },
    ],
  },
  {
    key: 'data-warehouse',
    label: 'DataWarehouse',
    children: [
      {
        key: 'data-flow',
        label: 'DataFlow',
        path: '/data-warehouse/data-flow',
      },
      {
        key: 'cached-model',
        label: 'CachedModel',
        path: '/data-warehouse/cached-model',
      },
      {
        key: 'cached-data-set',
        label: 'CachedDataSet',
        path: '/data-warehouse/cached-data-set',
      },
      {
        key: 'push-data-set',
        label: 'Push DataSet',
        path: '/data-warehouse/push-data-set',
      },
    ],
  },
  {
    key: 'configuration',
    label: 'Configuration',
    children: [
      {
        key: 'scheduling',
        label: 'Scheduling',
        children: [
          {
            key: 'security',
            label: 'Security',
            path: '/configuration/scheduling/security',
          },
          {
            key: 'task',
            label: 'Task',
            path: '/configuration/scheduling/task',
          },
          {
            key: 'add-task',
            label: 'Add Task',
            path: '/configuration/scheduling/add-task',
          },
          {
            key: 'tasks-card',
            label: 'Tasks Card',
            path: '/configuration/scheduling/tasks-card',
          },
          {
            key: 'task-management',
            label: 'Task Management',
            path: '/configuration/scheduling/task-management',
          },
        ],
      },
    ],
  },
]
