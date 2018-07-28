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
}
