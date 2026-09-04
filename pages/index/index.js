// pages/index/index.js

Page({

  data: {

    // 当前分类
    activeCategory: 0,

    // 菜单标题
    menuTitle: '全部菜品',

    // 分类
    categories: [
      {
        id: 0,
        name: '全部',
        emoji: '✨'
      },
      {
        id: 1,
        name: '特调饮品',
        emoji: '🧋'
      },
      {
        id: 2,
        name: '甜蜜糕点',
        emoji: '🍰'
      },
      {
        id: 3,
        name: '轻食简餐',
        emoji: '🍱'
      },
      {
        id: 4,
        name: '季节限定',
        emoji: '🌸'
      }
    ],

    // 菜单
    menu: [

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

    // 当前显示的菜单
    menuList: [],

    // 购物车数量
    cartCount: 0,

    // Toast
    toastShow: false,
    toastText: ''
  },


  /**
   * 页面加载
   */
  onLoad() {

    console.log('🧸 一二布布小铺：首页加载')

    this.renderMenu()

    this.updateCartCount()

  },


  /**
   * 根据分类显示菜单
   */
  renderMenu() {

    const {
      menu,
      activeCategory
    } = this.data

    let list = menu

    if (activeCategory !== 0) {

      list = menu.filter(item => {
        return item.cat === activeCategory
      })

    }

    let title = '全部菜品'

    if (activeCategory !== 0) {

      const category = this.data.categories.find(item => {
        return item.id === activeCategory
      })

      if (category) {
        title = category.emoji + ' ' + category.name
      }

    }

    this.setData({
      menuList: list,
      menuTitle: title
    })

  },


  /**
   * 点击分类
   */
  selectCategory(e) {

    const id = Number(e.currentTarget.dataset.id)

    console.log('选择分类:', id)

    this.setData({
      activeCategory: id
    })

    this.renderMenu()

  },


  /**
   * 加入购物车
   */
  addCart(e) {

    const id = String(e.currentTarget.dataset.id)

    const cart = wx.getStorageSync('cart') || {}

    cart[id] = (cart[id] || 0) + 1

    wx.setStorageSync('cart', cart)

    this.updateCartCount()

    const item = this.data.menu.find(item => {
      return String(item.id) === id
    })

    if (item) {

      this.showToast(
        '已添加 ' + item.emoji + ' ' + item.name
      )

    }

  },


  /**
   * 更新购物车数量
   */
  updateCartCount() {

    const cart = wx.getStorageSync('cart') || {}

    let count = 0

    Object.keys(cart).forEach(key => {

      count += Number(cart[key]) || 0

    })

    this.setData({
      cartCount: count
    })

  },


  /**
   * Toast
   */
  showToast(text) {

    this.setData({
      toastShow: true,
      toastText: text
    })

    clearTimeout(this.toastTimer)

    this.toastTimer = setTimeout(() => {

      this.setData({
        toastShow: false
      })

    }, 1500)

  },


  /**
   * 首页
   */
  goHome() {

    this.showToast('已经在首页啦~')

  },


  /**
   * DIY
   *
   * 现在 DIY 页面还没有迁移，
   * 下一步我们会创建 pages/diy
   */
  goDIY() {

    wx.navigateTo({
      url: '/pages/diy/diy'
    })

  },


  /**
   * 购物车
   */
  goCart() {

    wx.navigateTo({
      url: '/pages/cart/cart'
    })

  },


  /**
   * 订单
   */
  goOrders() {

    wx.showToast({
      title: '下一步制作订单',
      icon: 'none'
    })

  },


  /**
   * 商家后台
   */
  openAdmin() {

    wx.showToast({
      title: '下一步制作商家后台',
      icon: 'none'
    })

  }

})