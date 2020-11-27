
import {TranslateModel} from "./translate.model";

export class BrandData {
  name: TranslateModel = new TranslateModel();
  images: Image[] = [];
}

export class Image{
  url: string;
}
