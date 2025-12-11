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
]
