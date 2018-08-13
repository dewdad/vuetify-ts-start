import { ROUTE_NAME, ProductProvider } from '@/store/modules/productProvider'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Balance } from '@/store/modules/balance'
import { Payment } from '@/store/modules/payment'
import { With } from '@/utils/decorators'
import { Update, Show, List, Create, Delete } from '@/api/types'
// You can declare a mixin as the same style as components.
@Component
export default class BaseMixin extends Vue {
  routeName:{[propName:string]:string} = {
    index: `${ROUTE_NAME}.index`,
    show: `${ROUTE_NAME}.show`,
    update: `${ROUTE_NAME}.update`,
    create: `${ROUTE_NAME}.create`
  }
  translation = 'productProvider'

  vuexModel = ProductProvider

  balances = null

  payments = null

  testChange (newVal:any, oldVal:any, ele:any, items:any, index:any, vm:Vue) {

  }

  async fetchListData () {
    const [{ data: balances }, { data: payments }] = await Promise.all([Balance.index(), Payment.index()])
    this.balances = balances
    this.payments = payments
    return { balances, payments }
  }

  async createSchema () {
    const { balances, payments } = await this.fetchListData()
    return [
      { name: '基本',
        fields: [
          { field: 'name',
            label: '供应商名称',
            type: 'input',
            rule: 'required',
            props: { clearable: true }},
          { field: 'code',
            label: '供应商代码',
            type: 'input',
            rule: 'required',
            props: { clearable: true }},
          { field: 'level',
            label: '供应商等级',
            type: 'input',
            rule: 'required',
            props: { clearable: true }},
          { field: 'description',
            label: '备注信息',
            type: 'textarea',
            rule: 'required',
            props: { clearable: true }}
        ],
        children: [
          {
            name: '社交',
            propName: 'info',
            fields: [
              { field: 'email', label: 'Email', type: 'input' },
              { field: 'qq', label: 'QQ', type: 'input' },
              { field: 'wechat', label: 'WeChat', type: 'input' }
            ]
          }
        ]
      },
      {
        name: '结算相关',
        propName: 'payment',
        fields: [
          { field: 'balance_id',
            label: '结算方式',
            type: 'select',
            items: balances,
            itemText: 'name',
            itemValue: 'id',
            onChange: this.testChange },
          { field: 'description',
            label: '备注',
            type: 'textarea',
            rule: 'required',
            props: { clearable: true }},
          { field: 'payment_id',
            label: '付款方式',
            type: 'select',
            items: payments,
            itemText: 'name',
            itemValue: 'id' }
        ],
        children: [
          {
            name: '配置信息',
            propName: 'options',
            fields: [
              { field: 'account', label: 'Account', type: 'input' }
            ]
          }
        ]
      },
      {
        name: '地址',
        propName: 'addresses',
        fields: [
          { field: 'name', label: '联系人', type: 'input' },
          { field: 'tel', label: '座机', type: 'input' },
          { field: 'phone', label: '手机', type: 'input' },
          { field: 'fax', label: '传真', type: 'input' },
          { field: 'zip', label: '邮编', type: 'input' },
          { field: 'country', label: '国家', type: 'input' },
          { field: 'province', label: '省份', type: 'input' },
          { field: 'city', label: '城市', type: 'input' },
          { field: 'district', label: '街道', type: 'input' },
          { field: 'address', label: '详细地址', type: 'textarea' }
        ]
      }
    ]
  }

  showItem (id:any) {
    return this.$router.push(
      {name: this.routeName.show, params: {id}}
    )
  }

  editItem (id:any) {
    return this.$router.push(
      {name: this.routeName.update, params: { id }}
    )
  }

  // 列表
  @With([])
  listApi (payload:List) {
    return this.vuexModel.index(payload)
  }

  // 更新方法
  @With(['info', 'payment.balance', 'payment.payment', 'addresses'])
  updateApi (payload:Update) {
    return this.vuexModel.update(payload)
  }

  // 详情
  @With(['info', 'payment.balance', 'payment.payment', 'addresses', 'products.name', 'products.attributes.attributeValue'])
  showApi (payload:Show) {
    return this.vuexModel.show(payload)
  }

  // 创建
  @With(['info', 'payment.balance', 'payment.payment', 'addresses'])
  createApi (payload:Create) {
    return this.vuexModel.create(payload)
  }

  // 删除
  deleteApi (payload:Delete) {
    return this.vuexModel.destroy(payload)
  }
}
