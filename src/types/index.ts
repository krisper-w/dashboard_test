export interface Address {
  city: string
  zipcode: string
}

export interface Company {
  name: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: Address
  company: Company
}

export interface AppConfig {
  apiBase: string
  theme: string
  appName: string
}
