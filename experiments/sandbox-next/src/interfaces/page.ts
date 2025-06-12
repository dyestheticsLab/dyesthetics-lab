export interface Widget {
  contentType: string;
  props: Record<string, any>;
  widget: Widget[];
}

export interface PageData {
  widgets: Widget[];
  floatWidgets: Widget[];
  preload: Widget[];
}