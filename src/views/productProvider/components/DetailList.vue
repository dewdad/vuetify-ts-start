<template>
  <v-card class="mb-3">
    <v-card-text>
      <v-subheader>基本</v-subheader>
      <v-list slot="after-card-text" two-line>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="indigo">mdi-account</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
            <v-list-tile-sub-title>供应商名称</v-list-tile-sub-title>
          </v-list-tile-content>

        </v-list-tile>

        <v-divider inset></v-divider>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="indigo">mdi-code-tags</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{item.code}}</v-list-tile-title>
            <v-list-tile-sub-title>供应商编码</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="indigo">text_fields</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{item.level}}</v-list-tile-title>
            <v-list-tile-sub-title>供应商等级</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="indigo">description</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{item.description}}</v-list-tile-title>
            <v-list-tile-sub-title>分类描述</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <template v-if="info">
        <v-subheader>社交</v-subheader>
        <v-list slot="after-card-text" two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">mdi-at</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{info.email}}</v-list-tile-title>
              <v-list-tile-sub-title>Email</v-list-tile-sub-title>
            </v-list-tile-content>

          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">mdi-qqchat</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{info.qq}}</v-list-tile-title>
              <v-list-tile-sub-title>QQ</v-list-tile-sub-title>
            </v-list-tile-content>

          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">mdi-wechat</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{info.wechat}}</v-list-tile-title>
              <v-list-tile-sub-title>Wechat</v-list-tile-sub-title>
            </v-list-tile-content>

          </v-list-tile>

          <v-divider inset></v-divider>
        </v-list>
      </template>

      <template v-if="payment">
        <v-subheader>结算</v-subheader>
        <v-list slot="after-card-text" two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">email</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{payment.name}}</v-list-tile-title>
              <v-list-tile-sub-title>结算方式</v-list-tile-sub-title>
            </v-list-tile-content>

          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">email</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{item.payment.data.description}}</v-list-tile-title>
              <v-list-tile-sub-title>结算备注</v-list-tile-sub-title>
            </v-list-tile-content>

          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">mdi-credit-card</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{balance.name}}</v-list-tile-title>
              <v-list-tile-sub-title>支付方式</v-list-tile-sub-title>
            </v-list-tile-content>

          </v-list-tile>

          <v-list-tile >
            <v-list-tile-action></v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{item.payment.data.options.account}}</v-list-tile-title>
              <v-list-tile-sub-title>支付账户</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>chat</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>
        </v-list>
      </template>

    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import {User} from '@/store/modules/user'
@Component({
  layout: 'app',
  middleware:'auth'
  })
export default class DetailList extends Vue {
  @Prop({type: Object, default: () => {}}) item!:ApiResponse.ProductProviderData

  get payment () {
    return _.get(this.item, 'payment.data.payment.data', false)
  }

  get balance () {
    return _.get(this.item, 'payment.data.balance.data', false)
  }

  get info () {
    return _.get(this.item, 'info.data', false)
  }
}
</script>
