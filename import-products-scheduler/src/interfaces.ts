export interface Image {
  fileName: string;
  cdnLink: string | null;
  i: number;
  alt: string | null;
}

interface Variant {
  id: string;
  available: boolean;
  attributes: {
    packaging: string;
    description: string;
  };
  cost: number;
  currency: string;
  description: string;
  dimensionUom: string | null;
  height: number | null;
  width: number | null;
  manufacturerItemCode: string;
  manufacturerItemId: string;
  packaging: string;
  price: number;
  volume: number | null;
  volumeUom: string | null;
  weight: number | null;
  weightUom: string | null;
  optionName: string;
  optionsPath: string;
  optionItemsPath: string;
  sku: string;
  active: boolean;
  images: Image[];
  itemCode: string;
}

interface OptionValue {
  id: string;
  name: string;
  value: string;
}

interface Option {
  id: string;
  name: string;
  dataField: string | null;
  values: OptionValue[];
}

interface ProductData {
  name: string;
  type: string;
  shortDescription: string;
  description: string;
  vendorId: string;
  manufacturerId: string;
  storefrontPriceVisibility: string;
  variants: Variant[];
  options: Option[];
  availability: string;
  isFragile: boolean;
  published: string;
  isTaxable: boolean;
  images: Image[];
  categoryId: string;
}

interface ProductInfo {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy: string | null;
  deletedAt: string | null;
  dataSource: string;
  companyStatus: string;
  transactionId: string;
  skipEvent: boolean;
  userRequestId: string;
}

export interface Product {
  docId: string;
  fullData: any | null; // 'any' can be replaced with a more specific type if known
  data: ProductData;
  dataPublic: any; // 'any' can be replaced with a more specific type if known
  immutable: boolean;
  deploymentId: string;
  docType: string;
  namespace: string;
  companyId: string;
  status: string;
  info: ProductInfo;
}
