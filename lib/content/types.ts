export type ProjectStatus =
  | "under-development"
  | "developed"
  | "completed"
  | "fully-leased";

export type ProjectType =
  | "luxury-apartments"
  | "student-housing"
  | "single-family"
  | "townhomes"
  | "subdivision"
  | "commercial"
  | "medical-office"
  | "mixed-use"
  | "industrial"
  | "other";

export interface Project {
  slug: string;
  name: string;
  location: string;
  city?: string;
  county: string;
  type: ProjectType;
  status: ProjectStatus;
  acreage?: number;
  units?: number;
  lots?: number;
  beds?: number;
  sqft?: string;
  price?: string;
  partner?: string;
  description: string;
  images: string[];
  featured?: boolean;
  /** Map coordinates [lng, lat] */
  coordinates: [number, number];
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  projectSlug?: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  founded: number;
  developingSince: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  cell: string;
  email: string;
  story: string[];
  principals: Principal[];
  partners: string[];
}

export interface Principal {
  name: string;
  title: string;
  bio: string;
}
