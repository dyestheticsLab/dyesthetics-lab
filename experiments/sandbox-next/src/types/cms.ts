export interface CMSWidget {
  id: string;
  contentType: string;
  children?: CMSWidget[];
  [key: string]: unknown;
}