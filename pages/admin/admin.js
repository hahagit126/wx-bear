
// pages/admin/admin.js

Page({

  data: {

    // =========================
    // 订单数据
    // =========================

    orders: [],
    filteredOrders: [],

    totalOrders: 0,
    totalAmount: '0.00',

    pendingCount: 0,
    makingCount: 0,
    readyCount: 0,
    deliveringCount: 0,
    completedCount: 0,
    cancelledCount: 0,

    statusList: [
      {
        key: 'all',
        name: '全部'
      },
      {
        key: 'pending',
        name: '待处理'
      },
      {
        key: 'making',
        name: '制作中'
      },
      {
        key: 'ready',
        name: '待取餐'
      },
      {
        key: 'delivering',
        name: '配送中'
      },
      {
        key: 'completed',
        name: '已完成'
      },
      {
        key: 'cancelled',
        name: '已取消'
      }
    ],

    activeStatus: 'all',


    // =========================
    // 商品数据
    // =========================

    products: [
      {
        id: 1,
        name: '一二奶茶',
        desc: '布布特调的经典奶茶',
        price: 12,
        emoji: '🧋',
        cat: 1,
        tag: 'hot',
        tagText: '🔥热卖',
        background: 'linear-gradient(135deg,#E8F5E9,#A5D6A7)'
      },

      {
        id: 2,
        name: '布布拿铁',
        desc: '香浓丝滑的焦糖拿铁',
        price: 22,
        emoji: '☕',
        cat: 1,
        tag: '',
        tagText: '',
        background: 'linear-gradient(135deg,#E8F5E9,#A5D6A7)'
      },

      {
        id: 3,
        name: '小熊蜂蜜水',
        desc: '温润甜蜜的蜂蜜柠檬',
        price: 15,
        emoji: '🍯',
        cat: 1,
        tag: 'sweet',
        tagText: '🍬甜蜜',
        background: 'linear-gradient(135deg,#E8F5E9,#A5D6A7)'
      },

      {
        id: 4,
        name: '草莓慕斯',
        desc: '一二最爱的草莓甜品',
        price: 28,
        emoji: '🍰',
        cat: 2,
        tag: 'hot',
        tagText: '🔥热卖',
        background: 'linear-gradient(135deg,#FCE4EC,#F48FB1)'
      },

      {
        id: 5,
        name: '巧克力曲奇',
        desc: '酥脆浓郁的巧克力饼干',
        price: 16,
        emoji: '🍪',
        cat: 2,
        tag: '',
        tagText: '',
        background: 'linear-gradient(135deg,#FCE4EC,#F48FB1)'
      },

      {
        id: 6,
        name: '抹茶毛巾卷',
        desc: '清新抹茶味蛋糕卷',
        price: 25,
        emoji: '🧁',
        cat: 2,
        tag: 'new',
        tagText: '🆕新品',
        background: 'linear-gradient(135deg,#FCE4EC,#F48FB1)'
      },

      {
        id: 7,
        name: '熊掌三明治',
        desc: '超可爱的熊掌造型',
        price: 32,
        emoji: '🥐',
        cat: 3,
        tag: 'hot',
        tagText: '🔥热卖',
        background: 'linear-gradient(135deg,#FFF3E0,#FFCC80)'
      },

      {
        id: 8,
        name: '布布便当',
        desc: '丰盛的每日营养便当',
        price: 38,
        emoji: '🍱',
        cat: 3,
        tag: '',
        tagText: '',
        background: 'linear-gradient(135deg,#FFF3E0,#FFCC80)'
      },

      {
        id: 9,
        name: '樱花气泡水',
        desc: '限定春日浪漫饮品',
        price: 20,
        emoji: '🌸',
        cat: 4,
        tag: 'new',
        tagText: '🆕新品',
        background: 'linear-gradient(135deg,#E3F2FD,#90CAF9)'
      },

      {
        id: 10,
        name: '蜜桃乌龙',
        desc: '清甜蜜桃遇上醇香乌龙',
        price: 19,
        emoji: '🍑',
        cat: 4,
        tag: 'sweet',
        tagText: '🍬甜蜜',
        background: 'linear-gradient(135deg,#E3F2FD,#90CAF9)'
      }
    ],

    productList: [],

    productFilter: 'all'

  },


  // =========================
  // 页面加载
  // =========================

  onLoad() {

    this.loadOrders()
    this.loadProducts()

  },


  // =========================
  // 页面显示
  // =========================

  onShow() {

    this.loadOrders()
    this.loadProducts()

  },


  // =========================
  // 加载订单
  // =========================

  loadOrders() {

    const orders =
      wx.getStorageSync('orders') || []

    const list = orders.map(item => {

      let status = item.status

      if (status === '已完成') {
        status = 'completed'
      }

      let statusText = '待处理'

      switch (status) {

        case 'pending':
          statusText = '待处理'
          break

        case 'making':
          statusText = '制作中'
          break

        case 'ready':
          statusText = '待取餐'
          break

        case 'delivering':
          statusText = '配送中'
          break

        case 'completed':
          statusText = '已完成'
          break

        case 'cancelled':
          statusText = '已取消'
          break

      }

      return {
        ...item,
        status: status,
        statusText: statusText
      }

    })


    let totalAmount = 0

    list.forEach(item => {

      totalAmount +=
        Number(item.finalPrice) || 0

    })


    let pendingCount = 0
    let makingCount = 0
    let readyCount = 0
    let deliveringCount = 0
    let completedCount = 0
    let cancelledCount = 0


    list.forEach(item => {

      switch (item.status) {

        case 'pending':
          pendingCount++
          break

        case 'making':
          makingCount++
          break

        case 'ready':
          readyCount++
          break

        case 'delivering':
          deliveringCount++
          break

        case 'completed':
          completedCount++
          break

        case 'cancelled':
          cancelledCount++
          break

      }

    })


    this.setData({

      orders: list,

      totalOrders: list.length,

      totalAmount:
        totalAmount.toFixed(2),

      pendingCount,
      makingCount,
      readyCount,
      deliveringCount,
      completedCount,
      cancelledCount

    })


    this.filterOrders(
      this.data.activeStatus,
      list
    )

  },


  // =========================
  // 订单筛选
  // =========================

  selectStatus(e) {

    const status =
      e.currentTarget.dataset.status

    this.setData({
      activeStatus: status
    })

    this.filterOrders(
      status,
      this.data.orders
    )

  },


  filterOrders(status, orders) {

    let list = orders

    if (status !== 'all') {

      list = orders.filter(item => {

        return item.status === status

      })

    }

    this.setData({
      filteredOrders: list
    })

  },


  // =========================
  // 修改订单状态
  // =========================

  changeStatus(e) {

    const id =
      String(e.currentTarget.dataset.id)

    const status =
      e.currentTarget.dataset.status


    const statusTextMap = {

      pending: '待处理',
      making: '制作中',
      ready: '待取餐',
      delivering: '配送中',
      completed: '已完成',
      cancelled: '已取消'

    }


    const statusText =
      statusTextMap[status] || '待处理'


    const orders =
      wx.getStorageSync('orders') || []


    const newOrders =
      orders.map(item => {

        if (
          String(item.id) === id
        ) {

          return {

            ...item,

            status: status,
            statusText: statusText

          }

        }

        return item

      })


    wx.setStorageSync(
      'orders',
      newOrders
    )


    this.loadOrders()


    wx.showToast({

      title: '状态已更新',

      icon: 'success',

      duration: 1000

    })

  },


  // =========================
  // 订单详情
  // =========================

  goDetail(e) {

    const id =
      e.currentTarget.dataset.id

    wx.navigateTo({

      url:
        '/pages/order-detail/order-detail?id=' +
        id

    })

  },


  // =========================
  // 商品加载
  // =========================

  loadProducts() {

    const savedProducts =
      wx.getStorageSync('products')


    let products


    if (
      savedProducts &&
      Array.isArray(savedProducts) &&
      savedProducts.length > 0
    ) {

      products = savedProducts

    } else {

      products = this.data.products

      wx.setStorageSync(
        'products',
        products
      )

    }


    this.setData({

      products: products,

      productList: products

    })

  },


  // =========================
  // 商品上下架
  // =========================

  toggleProduct(e) {

    const id =
      Number(e.currentTarget.dataset.id)


    const products =
      wx.getStorageSync('products') ||
      this.data.products


    const newProducts =
      products.map(item => {

        if (Number(item.id) === id) {

          return {

            ...item,

            onSale:
              item.onSale === false
                ? true
                : false

          }

        }

        return item

      })


    wx.setStorageSync(
      'products',
      newProducts
    )


    this.setData({

      products: newProducts,

      productList: newProducts

    })


    const product =
      newProducts.find(item => {

        return Number(item.id) === id

      })


    wx.showToast({

      title:
        product && product.onSale === false
          ? '商品已下架'
          : '商品已上架',

      icon: 'success',

      duration: 1000

    })

  },



// =========================
// 商品管理
// =========================

goProductManage() {

  wx.navigateTo({
    url: '/pages/admin-product/admin-product'
  })

},

  // =========================
  // 返回
  // =========================

  goBack() {

    wx.navigateBack()

  }

})

