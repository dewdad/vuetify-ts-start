<script lang="tsx">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { VNode, VNodeChildren } from 'vue'

@Component
export default class BaseForm extends Vue {
  @Prop({type: Array, required: true}) schema!:any[]
  @Prop({type: Boolean, default: false}) clearable!:boolean
  @Prop({type: Boolean, default: false}) box!:boolean
  @Prop({type: Boolean, default: false}) solo!:boolean
  @Prop({type: Boolean, default: false}) outline!:boolean
  @Prop({type: Boolean, default: false}) disabled!:boolean
  @Prop({type: Boolean, default: false}) readonly!:boolean
  @Prop(Object) orginFormData!:object

  valid= true
  formData= {}
  defaultFormData= {}
  showAlert= false
  when= []

  async submit () {
    this.showAlert = false

    const res = await this.$validator.validateAll()
    if (!res) {
      this.showAlert = true
      setTimeout(() => {
        this.showAlert = false
      }, 3000)
    } else {
      return this.formData
    }
  }
  clear () {
    this.showAlert = false
    this.formData = _.cloneDeep(this.defaultFormData)
    this.$validator.reset()
  }
  selectLoad (item:any) {
    console.log(item)
  }
  getKey (item:any, propName:any) {
    return propName ? `${propName}.${item.field}` : item.field
  }

  createTextarea (item:any, key:any) {
    return (
      <v-textarea
        label={item.label}
        value={_.get(this.formData, key)}
        onChange={(e:any) => { _.set(this.formData, key, e) }}
        clearable={_.get(item, 'props.disabled', this.disabled) ? false : _.get(item, 'props.clearable', this.clearable)}
        disabled={_.get(item, 'props.disabled', this.disabled)}
        readonly={_.get(item, 'props.readonly', this.readonly)}
      ></v-textarea>
    )
  }

  createSwitch (item:any, key:any) {
    return (
      <v-switch
        label={item.label}
        inputValue={_.get(this.formData, key)}
        onChange={() => { _.set(this.formData, key, !_.get(this.formData, key)) }}
        disabled={_.get(item, 'props.disabled', this.disabled)}
        readonly={_.get(item, 'props.readonly', this.readonly)}
        falseValue={_.get(item, 'props.falseValue', false)}
      ></v-switch>
    )
  }

  craeteCheckboxGroup (item:any, key:any) {
    return (
      <v-layout row wrap>
        {
          item.values.map((attribute:any) => {
            return (
              <v-flex xs6 sm3 md3>
                <v-checkbox
                  inputValue={_.get(this.formData, key)}
                  label={attribute.value}
                  value={attribute.id}
                  disabled={_.get(item, 'props.disabled', this.disabled)}
                  readonly={_.get(item, 'props.readonly', this.readonly)}
                  falseValue={_.get(item, 'props.falseValue', false)}
                >
                </v-checkbox>
              </v-flex>
            )
          })
        }
      </v-layout>
    )
  }

  createCheckbox (item:any, key:any) {
    return (
      <v-checkbox
        label={item.label}
        inputValue={_.get(this.formData, key)}
        onChange={() => { _.set(this.formData, key, !_.get(this.formData, key)) }}
        disabled={_.get(item, 'props.disabled', this.disabled)}
        readonly={_.get(item, 'props.readonly', this.readonly)}
        falseValue={_.get(item, 'props.falseValue', false)}
      ></v-checkbox>
    )
  }

  createCard (items:any, propName:any, hasParent = false):VNode {
    const props = {
      xs12: true, sm8: hasParent, md6: hasParent
    }
    return (
      <v-flex {...props}>
        <v-card>
          {
            [
              this.createCardTitle(items, propName),
              this.createCardText(items, propName),
              this.recursionRenderForm(items, propName)
            ]
          }
        </v-card></v-flex>
    )
  }

  createCardTitle (items:any, propName:any):VNode {
    const key = propName ? propName + '.updated_at' : 'updated_at'
    const time = _.get(this.orginFormData, key)
    return (
      <v-card-title primary-title>
        <div>
          <div class='headline'>{items.name}</div>
          {this.orginFormData && time && <span class='grey--text'>{'更新时间' + ':' + time}</span>}
        </div>
      </v-card-title>
    )
  }

  createCardText (items:any, propName:any):VNode {
    return (
      <v-card-text>
        {items.fields.map((item:any) => {
          const key = this.getKey(item, propName)
          let htmlElement
          switch (_.get(item, 'type', 'input')) {
            case 'input':
              htmlElement = this.createTextField(item, key)
              break
            case 'select':
              htmlElement = this.createSelect(item, key)
              break
            case 'textarea':
              htmlElement = this.createTextarea(item, key)
              break
            case 'switch':
              htmlElement = this.createSwitch(item, key)
              break
            case 'checkbox':
              htmlElement = this.createCheckbox(item, key)
              break
            default:
              htmlElement = []
          }
          return [htmlElement, this.recursionRenderForm(item, key)]
        })}
      </v-card-text>
    )
  }
  recursionRenderForm (schema:any, parentPropName:any) {
    if (_.has(schema, 'children')) {
      return (
        <v-card-text>
          {this.renderForm(schema.children, parentPropName)}
        </v-card-text>
      )
    }
    return null
  }
  renderForm (schema:any, parentPropName = null) {
    return _.reduce(schema, (nodes:any[], items) => {
      const propName = _.isNull(parentPropName) ? _.get(items, 'propName') : `${parentPropName}.${_.get(items, 'propName')}`
      const isParent = _.isNull(parentPropName)
      nodes.push(this.createCard(items, propName, isParent))
      return nodes
    }, [])
  }
  // 动态添加事件
  addEvent (key:any, index:any, ele:any, item:any) {
    this.$watch(`formData.${key}`, (newVal, oldVal) => {
      ele.onChange(newVal, oldVal, ele, item.fields, index, this)
    })
  }
  // 创建表单数据结构
  createFormData (schema:any, parent = null) {
    return _.reduce(schema, (formData, item) => {
      const propName = _.get(item, 'propName')

      let props:{[propName:string]:any} = _.reduce(item.fields, (props, ele, index) => {
        const key = propName ? (parent ? `${parent}.${propName}.${ele.field}` : `${propName}.${ele.field}`) : ele.field
        if (_.isFunction(ele.onChange)) {
          this.addEvent(key, index, ele, item)
        }
        (props as any)[ele.field] = this.orginFormData ? _.get(this.orginFormData, key, '') : _.get(ele, 'default', '')
        return props
      }, {})

      if (_.has(item, 'children')) {
        props = Object.assign({}, props, this.createFormData(item.children, propName))
      }

      if (propName) {
        props = { [propName]: props }
      }

      formData = Object.assign({}, formData, props)
      return formData
    }, {})
  }

  createTextField (item:any, key:any) {
    return (
      <v-text-field
        ref={_.get(item, 'ref')}
        value={_.get(this.formData, key)}
        onInput={(e:any) => { _.set(this.formData, key, e) }}
        name={key}
        v-validate={_.get(item, 'rule')}
        errorMessages={this.errors.collect(key)}
        validateOnBlur
        // props
        appendIcon={_.get(item, 'props.appendIcon')}
        appendIconCb={_.get(item, 'props.appendIconCb')}

        appendOuterIcon={_.get(item, 'props.appendOuterIcon')}
        appendOuterIconCb={_.get(item, 'props.appendOuterIconCb')}

        autofocus={_.get(item, 'props.autofocus', false)}

        backgroundColor={_.get(item, 'props.backgroundColor')}

        box={_.get(item, 'props.box', this.box)}

        browserAutocomplete={_.get(item, 'props.browserAutocomplete', 'on')}
        clearable={_.get(item, 'props.disabled', this.disabled || this.readonly) ? false : _.get(item, 'props.clearable', this.clearable)}
        clearIcon={_.get(item, 'props.clearIcon')}
        clearIconCb={_.get(item, 'props.clearIconCb', null)}
        color={_.get(item, 'props.color')}
        counter={_.get(item, 'props.counter')}

        disabled={_.get(item, 'props.disabled', this.disabled)}
        readonly={_.get(item, 'props.readonly', this.readonly)}

        flat={_.get(item, 'props.flat')}
        fullWidth={_.get(item, 'props.fullWidth')}

        label={_.get(item, 'props.label', item.label)}

        outline={_.get(item, 'props.outline', this.outline)}

        placeholder={_.get(item, 'props.placeholder')}
        prefix={_.get(item, 'props.prefix')}
        prependInnerIcon={_.get(item, 'props.prependInnerIcon')}
        prependInnerIconCb={_.get(item, 'props.prependInnerIconCb')}
        reverse={_.get(item, 'props.reverse')}
        singleLine={_.get(item, 'props.singleLine')}

        solo={_.get(item, 'props.solo', this.solo)}

        soloInverted={_.get(item, 'props.soloInverted')}
        suffix={_.get(item, 'props.suffix')}
        type={_.get(item, 'props.type', 'text')}
      ></v-text-field>
    )
  }

  createSelect (item:any, key:any):any {
    return (
      <v-select
        value={_.get(this.formData, key)}
        onChange={(e:any) => { _.set(this.formData, key, e) }}

        // props
        activator={_.get(item, 'props.activator', undefined)}
        allowOverflow={_.get(item, 'props.allowOverflow', false)}

        label={_.get(item, 'props.label', item.label)}

        appendIcon={_.get(item, 'props.appendIcon')}
        appendIconCb={_.get(item, 'props.appendIconCb', null)}

        appendOuterIcon={_.get(item, 'props.appendOuterIcon')}
        appendOuterIconCb={_.get(item, 'props.appendOuterIconCb', null)}

        attach={_.get(item, 'props.attach', false)}
        auto={_.get(item, 'props.auto', false)}
        autofocus={_.get(item, 'props.autofocus', false)}

        backgroundColor={_.get(item, 'props.backgroundColor', undefined)}

        box={_.get(item, 'props.box', this.box)}

        browserAutocomplete={_.get(item, 'props.browserAutocomplete', 'on')}

        cacheItems={_.get(item, 'props.cacheItems', false)}
        chips={_.get(item, 'props.chips', false)}

        clearIcon={_.get(item, 'props.clearIcon')}
        clearIconCb={_.get(item, 'props.clearIconCb', null)}

        clearable={_.get(item, 'props.disabled', this.disabled || this.readonly) ? false : _.get(item, 'props.clearable', this.clearable)}
        closeOnClick={_.get(item, 'props.closeOnClick', true)}
        closeOnContentClick={_.get(item, 'props.closeOnContentClick', true)}

        contentClass={_.get(item, 'props.contentClass', undefined)}
        counter={_.get(item, 'props.counter', undefined)}

        deletableChips={_.get(item, 'props.deletableChips', false)}
        dense={_.get(item, 'props.dense', false)}

        disabled={_.get(item, 'props.disabled', this.disabled)}
        readonly={_.get(item, 'props.readonly', this.readonly)}

        filter={_.get(item, 'props.filter')}

        flat={_.get(item, 'props.flat', false)}
        fullWidth={_.get(item, 'props.fullWidth', false)}
        height={_.get(item, 'props.height', undefined)}
        hideDetails={_.get(item, 'props.hideDetails', false)}

        hideSelected={_.get(item, 'props.hideSelected', false)}
        hint={_.get(item, 'props.hint', undefined)}
        inputActivator={_.get(item, 'props.inputActivator', false)}
        loading={_.get(item, 'props.loading', false)}

        items={_.get(item, 'props.items', item.items)}

        itemAvatar={_.get(item, 'props.itemAvatar', 'avatar')}

        itemDisabled={_.get(item, 'props.itemDisabled', 'disabled')}

        itemText={_.get(item, 'props.itemText', item.itemText)}
        itemValue={_.get(item, 'props.itemValue', item.itemValue)}

        maxHeight={_.get(item, 'props.maxHeight', 300)}

        minWidth={_.get(item, 'props.minWidth', 0)}

        multiple={_.get(item, 'props.multiple', false)}

        multiLine={_.get(item, 'props.multiLine', false)}

        openOnClear={_.get(item, 'props.openOnClear', false)}
        returnObject={_.get(item, 'props.returnObject', false)}

        searchInput={_.get(item, 'props.searchInput', null)}

        smallChips={_.get(item, 'props.smallChips', false)}
        singleLine={_.get(item, 'props.singleLine', false)}

        color={_.get(item, 'props.color')}
        nudgeBottom={_.get(item, 'props.nudgeBottom', 0)}
        nudgeLeft={_.get(item, 'props.nudgeLeft', 0)}
        nudgeRight={_.get(item, 'props.nudgeRight', 0)}
        nudgeTop={_.get(item, 'props.nudgeTop', 0)}
        nudgeWidth={_.get(item, 'props.nudgeWidth', 0)}
        offsetOverflow={_.get(item, 'props.offsetOverflow', false)}
        offsetX={_.get(item, 'props.offsetX', false)}
        offsetY={_.get(item, 'props.offsetY', false)}

        outline={_.get(item, 'props.outline', this.outline)}
        solo={_.get(item, 'props.solo', this.solo)}

      ></v-select>
    )
  }

  created () {
    this.formData = this.createFormData(this.schema)
    // 默认数据结构，用于reset
    this.defaultFormData = _.cloneDeep(this.formData)
  }

  render ():VNode {
    return (
      <v-form value={this.valid} ref='form' lazyValidation>
        <v-container gridListXs>
          <v-alert value={this.showAlert} type='error' transition='scale-transition'>
              Please correct all error!
          </v-alert>
          <v-layout
            row
            wrap
          >
            {this.renderForm(this.schema)}
          </v-layout>
        </v-container>
      </v-form>
    )
  }
}
</script>
