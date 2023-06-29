
export type autor= {
  name : string
  books : libro[]
}

export type libro = {
  id : string
  title : string
  pages : number
  autor : autor
  carts : User[]
}
export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
  createdAt : Date
  cart : libro[]
  token?: string;
};