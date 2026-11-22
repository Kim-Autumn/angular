export interface Banner {
  _id?: string;
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order?: number;
}
