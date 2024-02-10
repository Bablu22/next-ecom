import React from "react";

export interface NavMenuItem {
  href: string;
  icon: React.JSX.Element;
  label: string;
}

export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
}
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface EmailVerifyRequest {
  token: string;
  userId: string;
}

export interface ForgetPasswordRequest {
  email: string;
}
export interface UpdatePasswordRequest {
  password: string;
  token: string;
  userId: string;
}

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  varified: boolean;
}

export interface INewProduct {
  title: string;
  description: string;
  bulletPoints?: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
  thumbnail?: File | undefined;
  images?: File[];
}

export interface ImageUploadResponse {
  url: string;
  id: string;
}

export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    id: string;
  };
  images?: {
    url: string;
    id: string;
  }[];
  price: {
    base: number;
    discounted: number;
  };
  category: string;
  quantity: number;
  bulletPoints?: string[];
}

export interface ProductToUpdate {
  title: string;
  description: string;
  bulletPoints: string[] | undefined;
  category: string;
  quantity: number;
  price: {
    base: number;
    discounted: number;
  };
  thumbnail?: {
    url: string;
    id: string;
  };
  images?: {
    url: string;
    id: string;
  }[];
}

export interface NewCartRequest {
  productId: string;
  quantity: number;
}
