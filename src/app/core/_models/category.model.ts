// import {BaseModel} from './base.model';

import {TranslateModel} from "./translate.model";

export class CategoryData {
  name: TranslateModel = new TranslateModel();
  filterData: FilterData[] =[];
  // priceConfig: PriceConfig = new PriceConfig();
  images: Image[] = [];
  icons: Icon[] = [];
}
// export class Article extends BaseModel{
//   data: ArticleData;
// }

export class FilterData{
  name: TranslateModel = new TranslateModel();
  props: Props[] = [];
}

export class Props{
  name: TranslateModel = new TranslateModel();
}

export class PriceConfig{
  minValue: number;
  maxValue: number
}

export class Image{
  url: string;
}

export class Icon{
  url: string;
}
