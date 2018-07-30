declare namespace ApiResponse{
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
    'pivot': PivotPrice;
    'name':string;
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
    'info': ProductProviderInfo;
    'payment': Payment;
    'products': ProductVariant;
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

  export interface Products{
    data:ProductData[];
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
  }

  export interface Brand{
    data:BrandData;
  }

  export interface BrandData{
    avatar:null|string;
    'created_at':string;
    description:string;
    id:number;
    name:string;
    'updated_at':string;
  }

  export interface ProductType{
    data:ProductTypeData;
  }

  export interface ProductTypeData{
    config:null|object;
    'created_at':string;
    id:number;
    name:string;
    'updated_at':string;
  }
}
