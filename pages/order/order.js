// pages/order/order.js

Page({

  data: {
    orders: []
  },


  onShow() {
    this.loadOrders()
  },


  loadOrders() {

    const orders = wx.getStorageSync('orders') || []

    const list = orders.map(order => {

      let statusText = '已完成'
      let statusStep = 4

      if (order.status === 'pending') {
        statusText = '待处理'
        statusStep = 1
      } else if (order.status === 'making') {
        statusText = '制作中'
        statusStep = 2
      } else if (order.status === 'ready') {
        statusText = '待取餐'
        statusStep = 3
      } else if (order.status === 'delivering') {
        statusText = '配送中'
        statusStep = 4
      } else if (
        order.status === 'completed' ||
        order.status === '已完成'
      ) {
        statusText = '已完成'
        statusStep = 5
      } else if (order.status === 'cancelled') {
        statusText = '已取消'
        statusStep = 0
      } else if (order.status) {
        statusText = order.status
        statusStep = 1
      }

      return {
        ...order,

        statusText: statusText,

        statusStep: statusStep,

        finalPrice: Number(
          order.finalPrice ||
          order.totalPrice ||
          order.price ||
          0
        ).toFixed(2),

        totalCount: Number(
          order.totalCount ||
          order.quantity ||
          0
        )
      }
    })


    this.setData({
      orders: list
    })
  },


  // 返回上一页
  goBack() {

    wx.navigateBack({
      delta: 1
    })

  },


  // 查看订单详情
  goDetail(e) {

    const id = e.currentTarget.dataset.id

    wx.navigateTo({
      url:
        '/pages/order-detail/order-detail?id=' +
        id
    })

  },


  // 再来一单
  buyAgain(e) {

    const id = e.currentTarget.dataset.id

    const orders =
      wx.getStorageSync('orders') || []


    const order = orders.find(item => {

      return String(item.id) === String(id)

    })


    if (!order || !order.items) {

      wx.showToast({
        title: '订单商品不存在',
        icon: 'none'
      })

      return
    }


    const cart =
      wx.getStorageSync('cart') || {}


    order.items.forEach(item => {

      const itemId = String(item.id)

      cart[itemId] =
        (Number(cart[itemId]) || 0) +
        (Number(item.quantity) || 1)

    })


    wx.setStorageSync(
      'cart',
      cart
    )


    wx.showToast({

      title: '已加入购物车',

      icon: 'success'

    })


    setTimeout(() => {

      wx.navigateTo({
        url: '/pages/cart/cart'
      })

    }, 500)

  },


  // 删除订单
  deleteOrder(e) {

    const id =
      String(e.currentTarget.dataset.id)


    wx.showModal({

      title: '删除订单',

      content:
        '确定要删除这个订单记录吗？',

      confirmText: '删除',

      cancelText: '取消',

      success: res => {

        if (!res.confirm) {
          return
        }


        const orders =
          wx.getStorageSync('orders') || []


        const newOrders =
          orders.filter(item => {

            return String(item.id) !== id

          })


        wx.setStorageSync(
          'orders',
          newOrders
        )


        this.loadOrders()


        wx.showToast({

          title: '订单已删除',

          icon: 'success'

        })

      }

    })

  },


  // 清空全部订单
  clearOrders() {

    if (this.data.orders.length === 0) {

      wx.showToast({

        title: '暂无订单',

        icon: 'none'

      })

      return
    }


    wx.showModal({

      title: '清空订单',

      content:
        '确定要清空全部订单记录吗？',

      confirmText: '清空',

      cancelText: '取消',

      success: res => {

        if (!res.confirm) {
          return
        }


        wx.setStorageSync(
          'orders',
          []
        )


        this.setData({
          orders: []
        })


        wx.showToast({

          title: '已清空订单',

          icon: 'success'

        })

      }

    })

  }

})