export interface QueryBuild {
  include?:string;
  [propName:string]:any;
}

export interface FormData{
  [propName:string]:any;
}

export interface Show extends QueryBuild{
  id:number|string;
}
export interface Update {
  id:Show['id'];
  formData:QueryBuild;
}
