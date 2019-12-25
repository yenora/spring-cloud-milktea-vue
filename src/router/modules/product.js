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
      path: 'milktea',
      name: '奶茶',
      component: () => import('@/views/product/index'),
      meta: { title: '奶茶', icon: 'list' }
    },
    {
      path: 'staple',
      name: '原料',
      component: () => import('@/views/tree/index'),
      meta: { title: '原料', icon: 'list' }
    },
    {
      path: 'type',
      name: '种类',
      component: () => import('@/views/tree/index'),
      meta: { title: '种类', icon: 'list' }
    }
  ]
}
export default productRouter
