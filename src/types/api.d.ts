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

  export interface ProductItem{
    body:string|null;
    brand:Object;
    'brand_id':number;
    code:string;
    'created_at':string;
    'deleted_at':null|string;
    enabled:boolean;
    id:number;
    name:string;
    'name_cn':string;
    'name_en':string;
    type:Object;
    'type_id':number;
    'updated_at':string;
  }
}
