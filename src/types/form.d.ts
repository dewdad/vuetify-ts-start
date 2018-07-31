declare namespace FormInterface{

  export interface Item{
    name:string;
    propName?:string;
    fields:Field[];
    children?:Item[];
  }

  export enum FieldType{
    'text',
    'textarea',
    'select',
    'radio',
    'richtext',
    'checkbox',
    'date',
    'time',
    'checkbox_group',
    'radio_group',
    'toggle'
  }

  export interface Field{
    field:string;
    label:string;
    type:string;
    rule:any;
    props?:any;
    items?: any[];
    values?:any[];
    itemText?: string|Array<any>|Function;
    itemValue?: string|Array<any>|Function;
    [propName:string]:any;
  }
}
