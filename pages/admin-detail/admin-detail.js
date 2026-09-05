// pages/admin-detail/admin-detail.js

Page({

  data: {
    order: null
  },


  onLoad(options) {

    const orderId = options.id || ''

    if (!orderId) {

      wx.showToast({
        title: '订单不存在',
        icon: 'none'
      })

      return
    }

    this.loadOrder(orderId)
  },


  // 读取订单
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
    }


    const items = (order.items || []).map(item => {

      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 0

      return {
        ...item,
        price: price.toFixed(2),
        quantity: quantity,
        subtotal: (price * quantity).toFixed(2)
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
      order: newOrder
    })

  },


  // 返回后台
  goBack() {

    wx.navigateBack({
      delta: 1
    })

  }

})