// pages/admin-detail/admin-detail.js

Page({

  data: {
    order: null,
    hasItems: false,

    statusList: [
      { key: 'pending', name: '待处理' },
      { key: 'making', name: '制作中' },
      { key: 'ready', name: '待取餐' },
      { key: 'delivering', name: '配送中' },
      { key: 'completed', name: '已完成' },
      { key: 'cancelled', name: '已取消' }
    ]
  },

  onLoad(options) {

    this.orderId = options.id || ''

    if (!this.orderId) {
      wx.showToast({
        title: '订单不存在',
        icon: 'none'
      })
      return
    }

    this.loadOrder(this.orderId)
  },

  onShow() {

    if (this.orderId && this.data.order) {
      this.loadOrder(this.orderId)
    }

  },

  loadOrder(orderId) {

    const orders =
      wx.getStorageSync('orders') || []

    const order = orders.find(item => {
      return String(item.id) === String(orderId)
    })

    if (!order) {
      wx.showToast({
        title: '订单不存在',
        icon: 'none'
      })
      return
    }

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

    const items = (order.items || []).map(item => {

      const price =
        Number(item.price) || 0

      const quantity =
        Number(item.quantity) || 0

      return {
        ...item,
        price: price.toFixed(2),
        quantity: quantity,
        subtotal: (
          price * quantity
        ).toFixed(2)
      }

    })

    const newOrder = {

      ...order,

      statusText: statusText,

      items: items,

      totalPrice: Number(
        order.totalPrice || 0
      ).toFixed(2),

      deliveryFee: Number(
        order.deliveryFee || 0
      ).toFixed(2),

      finalPrice: Number(
        order.finalPrice || 0
      ).toFixed(2),

      totalCount: Number(
        order.totalCount || 0
      )

    }

    this.setData({
      order: newOrder,
      hasItems: items.length > 0
    })

  },

  changeStatus(e) {

    const newStatus =
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
      statusMap[newStatus] || newStatus

    if (
      this.data.order &&
      (
        this.data.order.status === newStatus ||
        (
          newStatus === 'completed' &&
          this.data.order.status === '已完成'
        )
      )
    ) {
      wx.showToast({
        title: '当前已经是该状态',
        icon: 'none'
      })
      return
    }

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
            return String(item.id) ===
              String(this.orderId)
          })

        if (index === -1) {

          wx.showToast({
            title: '订单不存在',
            icon: 'none'
          })

          return
        }

        orders[index].status =
          newStatus

        wx.setStorageSync(
          'orders',
          orders
        )

        this.loadOrder(this.orderId)

        wx.showToast({
          title: '状态已更新',
          icon: 'success'
        })

      }

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
        url: '/pages/admin/admin'
      })

    }

  }

})