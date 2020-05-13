/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/',
  name: '产品管理',
  meta: {
    title: '产品管理',
    icon: 'component'
  },
  children: [
    {
      path: 'list',
      name: '奶茶',
      component: () => import('@/views/product/list'),
      meta: { title: '奶茶', icon: 'list' }
    },
    {
      path: 'staple',
      name: '原料',
      component: () => import('@/views/product/staple'),
      meta: { title: '原料', icon: 'list' }
    },
    {
      path: 'type',
      name: '种类',
      component: () => import('@/views/product/type'),
      meta: { title: '种类', icon: 'list' }
    }
  ]
}
export default productRouter
