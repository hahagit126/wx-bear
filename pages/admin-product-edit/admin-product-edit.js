
// pages/admin-product-edit/admin-product-edit.js

Page({

  data: {

    // 是否编辑已有商品
    isEdit: false,

    // 商品 ID
    id: '',

    // 商品名称
    name: '',

    // 商品描述
    desc: '',

    // 商品价格
    price: '',

    // 当前图标
    emoji: '🧋',

    // 是否打开图标选择面板
    emojiPickerShow: false,

    // 可选图标
    emojiList: [
      '🧋',
      '☕',
      '🍯',
      '🍰',
      '🍪',
      '🧁',
      '🥐',
      '🍱',
      '🌸',
      '🍑',
      '🍓',
      '🍫',
      '🍵',
      '🥤',
      '🍋',
      '🍊',
      '🍎',
      '🍉',
      '🍇',
      '🥪',
      '🍔',
      '🍟',
      '🍕',
      '🌭',
      '🍩',
      '🍨',
      '🍧',
      '🎂',
      '🍮',
      '🍡'
    ],

    // 分类
    cat: 1,

    categoryList: [
      {
        id: 1,
        name: '特调饮品'
      },
      {
        id: 2,
        name: '甜蜜糕点'
      },
      {
        id: 3,
        name: '轻食简餐'
      },
      {
        id: 4,
        name: '季节限定'
      }
    ],

    categoryIndex: 0,

    // 是否上架
    onSale: true

  },


  // =========================
  // 页面加载
  // =========================

  onLoad(options) {

    const id =
      options && options.id
        ? String(options.id)
        : ''


    if (id) {

      this.loadProduct(id)

    } else {

      this.setData({

        isEdit: false,

        id: '',

        name: '',

        desc: '',

        price: '',

        emoji: '🧋',

        emojiPickerShow: false,

        cat: 1,

        categoryIndex: 0,

        onSale: true

      })

    }

  },


  // =========================
  // 加载商品
  // =========================

  loadProduct(id) {

    const products =
      wx.getStorageSync('products') || []


    const product =
      products.find(item => {

        return String(item.id) === id

      })


    if (!product) {

      wx.showToast({

        title: '商品不存在',

        icon: 'none'

      })

      setTimeout(() => {

        wx.navigateBack()

      }, 800)

      return

    }


    let categoryIndex = 0

    const foundCategory =
      this.data.categoryList.findIndex(item => {

        return Number(item.id) === Number(product.cat)

      })


    if (foundCategory >= 0) {

      categoryIndex = foundCategory

    }


    this.setData({

      isEdit: true,

      id: String(product.id),

      name: product.name || '',

      desc: product.desc || '',

      price:
        product.price === undefined
          ? ''
          : String(product.price),

      emoji:
        product.emoji || '🧋',

      emojiPickerShow: false,

      cat:
        product.cat || 1,

      categoryIndex: categoryIndex,

      onSale:
        product.onSale !== false

    })

  },


  // =========================
  // 商品名称
  // =========================

  inputName(e) {

    this.setData({

      name: e.detail.value

    })

  },


  // =========================
  // 商品描述
  // =========================

  inputDesc(e) {

    this.setData({

      desc: e.detail.value

    })

  },


  // =========================
  // 商品价格
  // =========================

  inputPrice(e) {

    this.setData({

      price: e.detail.value

    })

  },


  // =========================
  // 打开 / 关闭图标选择
  // =========================

  toggleEmojiPicker() {

    this.setData({

      emojiPickerShow:
        !this.data.emojiPickerShow

    })

  },


  // =========================
  // 选择图标
  // =========================

  selectEmoji(e) {

    const emoji =
      e.currentTarget.dataset.emoji


    this.setData({

      emoji: emoji,

      emojiPickerShow: false

    })

  },


  // =========================
  // 分类选择
  // =========================

  changeCategory(e) {

    const index =
      Number(e.detail.value)


    const category =
      this.data.categoryList[index]


    this.setData({

      categoryIndex: index,

      cat: category.id

    })

  },


  // =========================
  // 上架状态
  // =========================

  toggleSale() {

    this.setData({

      onSale:
        !this.data.onSale

    })

  },


  // =========================
  // 保存商品
  // =========================

  saveProduct() {

    const name =
      String(this.data.name || '').trim()

    const desc =
      String(this.data.desc || '').trim()

    const priceText =
      String(this.data.price || '').trim()


    // 名称校验
    if (!name) {

      wx.showToast({

        title: '请输入商品名称',

        icon: 'none'

      })

      return

    }


    if (name.length > 20) {

      wx.showToast({

        title: '商品名称不能超过20字',

        icon: 'none'

      })

      return

    }


    // 描述校验
    if (!desc) {

      wx.showToast({

        title: '请输入商品描述',

        icon: 'none'

      })

      return

    }


    if (desc.length > 50) {

      wx.showToast({

        title: '商品描述不能超过50字',

        icon: 'none'

      })

      return

    }


    // 价格校验
    if (!priceText) {

      wx.showToast({

        title: '请输入商品价格',

        icon: 'none'

      })

      return

    }


    const price =
      Number(priceText)


    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {

      wx.showToast({

        title: '请输入正确价格',

        icon: 'none'

      })

      return

    }


    if (price > 9999) {

      wx.showToast({

        title: '价格不能超过9999元',

        icon: 'none'

      })

      return

    }


    if (
      Math.round(price * 100) !==
      price * 100
    ) {

      wx.showToast({

        title: '价格最多两位小数',

        icon: 'none'

      })

      return

    }


    let products =
      wx.getStorageSync('products') || []


    // =========================
    // 编辑已有商品
    // =========================

    if (this.data.isEdit) {

      const id =
        String(this.data.id)


      const index =
        products.findIndex(item => {

          return String(item.id) === id

        })


      if (index === -1) {

        wx.showToast({

          title: '商品不存在',

          icon: 'none'

        })

        return

      }


      const oldProduct =
        products[index]


      products[index] = {

        ...oldProduct,

        // 保留原 ID
        id: oldProduct.id,

        name: name,

        desc: desc,

        price:
          Number(price.toFixed(2)),

        emoji:
          this.data.emoji,

        cat:
          this.data.cat,

        onSale:
          this.data.onSale,

        // 保留原 deleted 状态
        deleted:
          oldProduct.deleted === true

      }

    }


    // =========================
    // 新增商品
    // =========================

    else {

      let maxId = 0


      products.forEach(item => {

        const id =
          Number(item.id) || 0

        if (id > maxId) {

          maxId = id

        }

      })


      const newId =
        maxId + 1


      products.push({

        id: newId,

        name: name,

        desc: desc,

        price:
          Number(price.toFixed(2)),

        emoji:
          this.data.emoji,

        cat:
          this.data.cat,

        tag: '',

        tagText: '',

        background:
          'linear-gradient(135deg,#E8F5E9,#A5D6A7)',

        onSale:
          this.data.onSale,

        deleted: false

      })

    }


    // =========================
    // 保存
    // =========================

    wx.setStorageSync(
      'products',
      products
    )


    // 通知其他页面刷新
    const app = getApp()

    if (!app.globalData) {

      app.globalData = {}

    }

    app.globalData.productsChanged = true


    wx.showToast({

      title:
        this.data.isEdit
          ? '商品已保存'
          : '商品已新增',

      icon: 'success',

      duration: 1000

    })


    setTimeout(() => {

      wx.navigateBack()

    }, 1000)

  },


  // =========================
  // 返回
  // =========================

  goBack() {

    wx.navigateBack({

      delta: 1

    })

  }

})

