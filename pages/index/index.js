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

    // 默认商品
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

    // 当前显示菜单
    menuList: [],

    // 购物车数量
    cartCount: 0,

    // Toast
    toastShow: false,
    toastText: ''
  },


  // =========================
  // 页面加载
  // =========================

  onLoad() {

    console.log('🧸 一二布布小铺：首页加载')

    this.loadProducts()

    this.updateCartCount()

  },


  // =========================
  // 页面显示
  // 每次回到首页都重新读取商品
  // =========================

  onShow() {

    console.log('首页重新显示，刷新商品')

    this.loadProducts()

    this.updateCartCount()

  },


  // =========================
  // 读取后台商品
  // =========================

  loadProducts() {

    const savedProducts =
      wx.getStorageSync('products')


    let products = []


    // 如果后台已经保存商品
    if (
      Array.isArray(savedProducts) &&
      savedProducts.length > 0
    ) {

      products = savedProducts

    } else {

      // 第一次使用，使用默认商品
      products = this.data.menu

      wx.setStorageSync(
        'products',
        products
      )

    }


    // 首页只显示上架商品
    const onSaleProducts =
      products.filter(item => {

        // 没有 onSale 字段的旧商品默认上架
        return item.onSale !== false

      })


    this.setData({

      menu: products,

      menuList: onSaleProducts

    })


    // 根据当前分类重新渲染
    this.renderMenu()

  },


  // =========================
  // 根据分类显示菜单
  // =========================

  renderMenu() {

    const {
      menu,
      activeCategory
    } = this.data


    // 首页只显示上架商品
    let list = menu.filter(item => {

      return item.onSale !== false

    })


    // 分类筛选
    if (activeCategory !== 0) {

      list = list.filter(item => {

        return item.cat === activeCategory

      })

    }


    // 菜单标题
    let title = '全部菜品'


    if (activeCategory !== 0) {

      const category =
        this.data.categories.find(item => {

          return item.id === activeCategory

        })


      if (category) {

        title =
          category.emoji +
          ' ' +
          category.name

      }

    }


    this.setData({

      menuList: list,

      menuTitle: title

    })

  },


  // =========================
  // 点击分类
  // =========================

  selectCategory(e) {

    const id =
      Number(e.currentTarget.dataset.id)


    console.log(
      '选择分类:',
      id
    )


    this.setData({

      activeCategory: id

    })


    this.renderMenu()

  },


  // =========================
  // 加入购物车
  // =========================

  addCart(e) {

    const id =
      String(e.currentTarget.dataset.id)


    // 防止下架商品被加入购物车
    const item =
      this.data.menu.find(product => {

        return String(product.id) === id

      })


    if (!item || item.onSale === false) {

      wx.showToast({

        title: '该商品已下架',

        icon: 'none'

      })

      return

    }


    const cart =
      wx.getStorageSync('cart') || {}


    cart[id] =
      (Number(cart[id]) || 0) + 1


    wx.setStorageSync(
      'cart',
      cart
    )


    this.updateCartCount()


    if (item) {

      this.showToast(

        '已添加 ' +
        item.emoji +
        ' ' +
        item.name

      )

    }

  },


  // =========================
  // 更新购物车数量
  // =========================

  updateCartCount() {

    const cart =
      wx.getStorageSync('cart') || {}


    let count = 0


    Object.keys(cart).forEach(key => {

      count +=
        Number(cart[key]) || 0

    })


    this.setData({

      cartCount: count

    })

  },


  // =========================
  // Toast
  // =========================

  showToast(text) {

    this.setData({

      toastShow: true,

      toastText: text

    })


    clearTimeout(
      this.toastTimer
    )


    this.toastTimer =
      setTimeout(() => {

        this.setData({

          toastShow: false

        })

      }, 1500)

  },


  // =========================
  // 首页
  // =========================

  goHome() {

    this.loadProducts()

    this.showToast(
      '已经在首页啦~'
    )

  },


  // =========================
  // DIY
  // =========================

  goDIY() {

    wx.navigateTo({

      url:
        '/pages/diy/diy'

    })

  },


  // =========================
  // 购物车
  // =========================

  goCart() {

    wx.navigateTo({

      url:
        '/pages/cart/cart'

    })

  },


  // =========================
  // 订单
  // =========================

  goOrders() {

    wx.navigateTo({

      url:
        '/pages/order/order'

    })

  },


  // =========================
  // 商家后台
  // =========================

  openAdmin() {

    wx.navigateTo({

      url:
        '/pages/admin/admin'

    })

  }

})