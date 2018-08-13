export interface List extends Include {
  [propName:string]:any;
}

export interface Create extends Include{
  [propName:string]:any;
}

export interface Show extends Include {
  id:number|string;
}
export interface Update extends Show {
  [propName:string]:any;
}

export interface Delete extends Show{

}

interface Include {
 include?:string[];
}
