// pages/admin/admin.js

Page({

  data: {
    orders: [],
    filteredOrders: [],

    totalOrders: 0,
    totalAmount: 0,

    pendingCount: 0,
    makingCount: 0,
    readyCount: 0,
    deliveringCount: 0,
    completedCount: 0,
    cancelledCount: 0,

    activeStatus: 'all',

    statusList: [
      { key: 'all', name: '全部' },
      { key: 'pending', name: '待处理' },
      { key: 'making', name: '制作中' },
      { key: 'ready', name: '待取餐' },
      { key: 'delivering', name: '配送中' },
      { key: 'completed', name: '已完成' },
      { key: 'cancelled', name: '已取消' }
    ]
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {

    const orders =
      wx.getStorageSync('orders') || []

    let totalAmount = 0

    let pendingCount = 0
    let makingCount = 0
    let readyCount = 0
    let deliveringCount = 0
    let completedCount = 0
    let cancelledCount = 0

    orders.forEach(order => {

      totalAmount += Number(
        order.finalPrice || 0
      )

      let status = order.status

      if (status === '已完成') {
        status = 'completed'
      }

      if (status === 'pending') {
        pendingCount++
      } else if (status === 'making') {
        makingCount++
      } else if (status === 'ready') {
        readyCount++
      } else if (status === 'delivering') {
        deliveringCount++
      } else if (status === 'completed') {
        completedCount++
      } else if (status === 'cancelled') {
        cancelledCount++
      }

    })

    const list = orders.map(order => {

      let statusText = '已完成'

      if (order.status === 'pending') {
        statusText = '待处理'
      } else if (order.status === 'making') {
        statusText = '制作中'
      } else if (order.status === 'ready') {
        statusText = '待取餐'
      } else if (order.status === 'delivering') {
        statusText = '配送中'
      } else if (
        order.status === 'completed' ||
        order.status === '已完成'
      ) {
        statusText = '已完成'
      } else if (order.status === 'cancelled') {
        statusText = '已取消'
      } else if (order.status) {
        statusText = order.status
      }

      return {
        ...order,

        statusText: statusText,

        finalPrice: Number(
          order.finalPrice || 0
        ).toFixed(2),

        totalCount: Number(
          order.totalCount || 0
        )
      }

    })

    // 订单状态优先级
    const statusPriority = {
      pending: 1,
      making: 2,
      ready: 3,
      delivering: 4,
      completed: 5,
      cancelled: 6
    }

    // 按订单状态排序
    list.sort((a, b) => {

      let statusA = a.status
      let statusB = b.status

      if (statusA === '已完成') {
        statusA = 'completed'
      }

      if (statusB === '已完成') {
        statusB = 'completed'
      }

      const priorityA =
        statusPriority[statusA] || 99

      const priorityB =
        statusPriority[statusB] || 99

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      // 同一状态最新订单在前
      const timeA =
        String(a.time || '')

      const timeB =
        String(b.time || '')

      return timeB.localeCompare(timeA)

    })

    this.setData({

      orders: list,

      totalOrders: list.length,

      totalAmount:
        totalAmount.toFixed(2),

      pendingCount:
        pendingCount,

      makingCount:
        makingCount,

      readyCount:
        readyCount,

      deliveringCount:
        deliveringCount,

      completedCount:
        completedCount,

      cancelledCount:
        cancelledCount

    })

    this.filterOrders(
      this.data.activeStatus,
      list
    )
  },

  filterOrders(
    status,
    orders
  ) {

    const source =
      orders || this.data.orders

    let filteredOrders = source

    if (status !== 'all') {

      filteredOrders =
        source.filter(order => {

          let orderStatus =
            order.status

          if (orderStatus === '已完成') {
            orderStatus = 'completed'
          }

          return orderStatus === status

        })
    }

    this.setData({
      activeStatus: status,
      filteredOrders: filteredOrders
    })
  },

  selectStatus(e) {

    const status =
      e.currentTarget.dataset.status

    this.filterOrders(status)
  },

  // 修改订单状态
  changeStatus(e) {

    const id =
      String(e.currentTarget.dataset.id)

    const status =
      e.currentTarget.dataset.status

    const statusMap = {
      pending: '待处理',
      making: '制作中',
      ready: '待取餐',
      delivering: '配送中',
      completed: '已完成',
      cancelled: '已取消'
    }

    const statusText =
      statusMap[status] || status

    wx.showModal({

      title: '修改订单状态',

      content:
        '确定将订单状态修改为「' +
        statusText +
        '」吗？',

      confirmText: '确定',

      cancelText: '取消',

      success: res => {

        if (!res.confirm) {
          return
        }

        const orders =
          wx.getStorageSync('orders') || []

        const index =
          orders.findIndex(item => {

            return String(item.id) === id

          })

        if (index === -1) {

          wx.showToast({
            title: '订单不存在',
            icon: 'none'
          })

          return
        }

        // 修改状态
        orders[index].status =
          status

        wx.setStorageSync(
          'orders',
          orders
        )

        // 重新加载
        this.loadOrders()

        wx.showToast({
          title: '状态已更新',
          icon: 'success'
        })

      }

    })
  },

  // 查看订单详情
  goDetail(e) {

    const id =
      e.currentTarget.dataset.id

    wx.navigateTo({
      url:
        '/pages/admin-detail/admin-detail?id=' +
        id
    })
  },

  goBack() {

    const pages =
      getCurrentPages()

    if (pages.length > 1) {

      wx.navigateBack({
        delta: 1
      })

    } else {

      wx.reLaunch({
        url: '/pages/index/index'
      })

    }

  }

})