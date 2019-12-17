/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/',
  name: '产品',
  meta: {
    title: '产品',
    icon: 'table'
  },
  children: [
    {
      path: 'list',
      name: '列表',
      component: () => import('@/views/product/index'),
      meta: { title: '列表', icon: 'table' }
    },
    {
      path: 'tree',
      name: '树',
      component: () => import('@/views/tree/index'),
      meta: { title: '树', icon: 'tree' }
    }
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/table/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'Dynamic Table' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // },
    // {
    //   path: 'complex-table',
    //   component: () => import('@/views/table/complex-table'),
    //   name: 'ComplexTable',
    //   meta: { title: 'Complex Table' }
    // }
  ]
}
export default productRouter
