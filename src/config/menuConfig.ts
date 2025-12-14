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
        ],
      },
    ],
  },
]
