import { Container } from "inversify";
import { MockPageDataSource, PageDataSource } from "../services/MockPageDataSource";
import { MockSlugIndex, SlugIndex } from "../services/MockSlugIndex";

export const globalRegistry = new Container();

globalRegistry
  .bind<PageDataSource>(MockPageDataSource)
  .to(MockPageDataSource);
globalRegistry
  .bind<SlugIndex>(MockSlugIndex)
  .to(MockSlugIndex);
