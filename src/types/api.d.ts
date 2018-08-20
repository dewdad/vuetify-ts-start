declare namespace ApiResponse{
  export interface AttributeGroups{
    data:AttributeGroupData[];
    meta?:Meta;
  }

  export type AttributeGroupType ='text'|'textarea'|'select'|'radio'|'richtext'|'checkbox'|'date'|'time'|'checkbox_group'|'radio_group'|'toggle'|'file'
  export interface AttributeGroupData{
    'can__upload':boolean;
    'created_at':string;
    'customized':boolean;
    id:number;
    name:string;
    required:boolean;
    type:AttributeGroupType;
    'updated_at':string;
    variant:boolean;
    values:{data:AttributeData[]};
  }

  export interface AttributeGroupItem extends LocalAttributeGroupItem{
    'can_upload':boolean;
    'created_at':string|null;
    id:number;
    'updated_at':string|null;
  }

  export interface LocalAttributeGroupItem{
    customized:boolean;
    name:string;
    required:boolean;
    type:string;
    variant:boolean;
  }

  export interface AttributeItem extends LocalAttributeItem{
    'created_at':string|null;
    id:number;
    'updated_at':string|null;
    variant:boolean
  }

  export interface LocalAttributeItem{
    'group_id':number;
    value:string;
  }

  export interface ProductVariant {
    data: ProductVariantData[];
  }

  export interface PivotPrice {
    'product_provider_id': number;
    'product_variant_id': number;
    'price': number;
    'created_at': string;
    'updated_at': string;
  }

  export interface ProductVariantData {
    'id': number;
    'product_id': number;
    'sku': string;
    'options'?: any;
    'price': number;
    'created_at': string;
    'updated_at': string;
    'deleted_at'?: any;
    'pivot'?: PivotPrice;
    'name'?:string;
    attributes?:ProductAttribute;
    'attribute_key'?:string;
    brand?:string;
    type?:string;
    product?:ProductData;
  }

  export interface Balances {
    data:BalanceData[];
    meta:Meta;
  }

  export interface Balance {
    data:BalanceData;
  }

  export interface BalanceData{
    id:number;
    name:string;
    options:null|any;
    'created_at':string|null;
    'updated_at':string|null;
  }

  export interface Payments {
    data: PaymentData[];
    meta:Meta;
  }

  export interface Payment {
    data: PaymentData;
  }

  export interface PaymentData {
    'id': number;
    'balance_id': number;
    'description': string;
    'payment_id': number;
    'options': PaymentOptions;
    'product_provider_id': number;
    'created_at': string;
    'updated_at': string;
    payment?:{
      data:PaymentObj
    },
    balance?:BalanceData;
  }

  export interface PaymentObj{
    id:number;
    name:string;
    'created_at':string;
    'updated_at':string;
  }

  export interface PaymentOptions {
    account: string;
  }

  export interface ProductVariantInfoData {
    'id': number;
    'email': string;
    'qq': string;
    'wechat': string;
    'product_provider_id': number;
    'created_at': string;
    'updated_at': string;
  }

  export interface ProductProviderInfo{
    data: ProductVariantInfoData;
  }

  export interface ProductProviderData {
    'id': number;
    'name': string;
    'code': string;
    'level': number;
    'description': string;
    'created_at': string;
    'updated_at': string;
    'deleted_at'?: any;
    'info'?: ProductProviderInfo;
    'payment'?: Payment;
    'products'?: ProductVariant;
    'addresses'?:Addresses;
  }

  export interface Addresses{
    data:AddressData[];
  }

  export interface AddressData{
      id: number;
      name: string;
      tel: string;
      phone: string;
      fax: string;
      zip: string;
      country: string;
      province: string;
      city: string;
      district: string;
      address: string;
      en: {};
      'addressable_type': string;
      'addressable_id': number;
      'created_at': string;
      'updated_at': string;
  }

  export interface ProductProvider {
    data: ProductProviderData;
  }

  export interface CategoryData{
    _lft:number;
    _rgt:number;
    avatar:null|string;
    'created_at':string;
    description:null|string;
    icon:null|string;
    id:number;
    name:string;
    'parent_id':null|number;
    'parent_name':null|string;
    products?:Products;
    'updated_at':string;
  }

  export interface Category {
    data:CategoryData;
  }

  export interface Attribute{
    date:AttributeData | {value:string};
  }

  export interface AttributeData{
    'created_at':string;
    'group_id':number;
    id:number;
    'updated_at':number;
    value:string;
    variant:boolean;
  }

  export interface Products{
    data:ProductData[];
    meta:Meta;
  }

  export interface Product{
    data:ProductData;
  }

  export interface ProductData{
    body:null|string;
    brand:Brand;
    'brand_id':number;
    code:string;
    'created_at':string;
    'deleted_at':null|string;
    enabled:boolean;
    id:number;
    name:string;
    'name_cn':string;
    'name_en':string;
    type:ProductType;
    'type_id':number;
    'updated_at':string;
    attributes?:ProductAttribute;
    variants?:ProductVariant;
    avatars?:Images;
    category?:Category;

  }

  export interface ProductAttribute{
    data:ProductAttributeData[];
  }

  export interface ProductAttributeData{
    'attribute_group_id':number;
    'attribute_id':number|null;
    comment:string|null;
    'created_at':string;
    'deleted_at':string|null;
    id:number;
    'product_id':number;
    'updated_at':string;
    variant:boolean;
    group?:AttributeGroups;
    value?:Attribute;
  }

  export interface Brand{
    data:BrandData;
  }

  export type BrandList = Map<string, Brands>

  export interface Brands{
    data:BrandData[];
    meta:Meta;
  }

  export interface Meta{
    pagination:Pagination
  }

  export interface Pagination{
    count:number;
    'current_page':number;
    links:any[];
    'per_page':number;
    total:number;
    'total_pages':number;
  }
  export interface UploadEdItemUrl{
    id:number|null;
    thumb:string|null;
    src:string;
  }
  export interface BrandData{
    avatars:Images|UploadEdItemUrl[];
    'created_at':string;
    description:string;
    id:number;
    name:string;
    'updated_at':string;
  }

  export interface Images{
    data:ImageData[]
  }

  export interface ImageData{
    id: number;
    url: string;
    height: number;
    width: number;
    size?: string;
    thumb:{
      url: string;
      height: number;
      width: number;
      size?: string;
    };
    'assetable_type': string;
    'assetable_id': number;
    'created_at': string;
    'updated_at': string;
    'deleted_at'?: any;
    type: string;
  }

  export interface ProductTypes{
    data:ProductTypeData[];
    meta:Meta;
  }
  export interface ProductType{
    data:ProductTypeData;
  }

  export interface ProductTypeData{
    attributeGroups?:AttributeGroups;
    config:null|object;
    'created_at':string;
    id:number;
    name:string;
    'updated_at':string;
  }
}
