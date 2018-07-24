export interface QueryBuild {
  [propName:string]:any
}

export interface FormData{
  [propName:string]:any
}

export interface Show {
  id:number|string;
  queryBuild?:QueryBuild|null
}
export interface Update {
  id:Show['id'];
  formData:QueryBuild;
}
