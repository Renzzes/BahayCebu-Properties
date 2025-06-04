export interface PropertyCreateInput {
  title: string;
  price: number | string;
  location: string;
  bedrooms: number | string;
  bathrooms: number | string;
  area: number | string;
  type: string;
  featured?: boolean;
  description?: string;
  images?: string[];
  videoUrl?: string;
  thumbnail?: string;
}

export interface PropertyUpdateInput extends Partial<PropertyCreateInput> {
  id: string;
}

export interface UserSignupInput {
  email: string;
  password: string;
  name: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AgentCreateInput {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  image?: string;
}

export interface AgentUpdateInput extends Partial<AgentCreateInput> {
  id: string;
} 