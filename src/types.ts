
export type User = {
  id: string;
  username: string;
  password?: string;
  token?: string;
  idioma : string
  fecha : Date
  mensajesenv : Mensaje[]
  mensajesrec : Mensaje[]
};


export type Mensaje = {
  id : string
  body : string
  date : Date
  idioma : string
  emisor : User
  destinatario : User
}