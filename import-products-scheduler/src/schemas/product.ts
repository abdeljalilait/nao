import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Image Schema
@Schema()
export class Image extends Document {
  @Prop({ required: true })
  fileName: string;

  @Prop({ default: null })
  cdnLink: string;

  @Prop({ required: true })
  i: number;

  @Prop({ default: null })
  alt: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

// Variant Schema
@Schema()
export class Variant extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  available: boolean;

  @Prop({ type: Object, required: true })
  attributes: {
    packaging: string;
    description: string;
  };

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: null })
  dimensionUom: string;

  @Prop({ default: null })
  height: number;

  @Prop({ default: null })
  width: number;

  @Prop({ required: true })
  manufacturerItemCode: string;

  @Prop({ required: true, unique: true })
  manufacturerItemId: string;

  @Prop({ required: true })
  packaging: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: null })
  volume: number;

  @Prop({ default: null })
  volumeUom: string;

  @Prop({ default: null })
  weight: number;

  @Prop({ default: null })
  weightUom: string;

  @Prop({ required: true })
  optionName: string;

  @Prop({ required: true })
  optionsPath: string;

  @Prop({ required: true })
  optionItemsPath: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ type: [ImageSchema], default: [] })
  images: Image[];

  @Prop({ required: true })
  itemCode: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);

// OptionValue Schema
@Schema()
export class OptionValue extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: string;
}

export const OptionValueSchema = SchemaFactory.createForClass(OptionValue);

// Option Schema
@Schema()
export class Option extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  dataField: string;

  @Prop({ type: [OptionValueSchema], default: [] })
  values: OptionValue[];
}

export const OptionSchema = SchemaFactory.createForClass(Option);

// ProductData Schema
@Schema()
export class ProductData extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  vendorId: string;

  @Prop({ required: true })
  manufacturerId: string;

  @Prop({ required: true })
  storefrontPriceVisibility: string;

  @Prop({ type: [VariantSchema], default: [] })
  variants: Variant[];

  @Prop({ type: [OptionSchema], default: [] })
  options: Option[];

  @Prop({ required: true })
  availability: string;

  @Prop({ required: true })
  isFragile: boolean;

  @Prop({ required: true })
  published: string;

  @Prop({ required: true })
  isTaxable: boolean;

  @Prop({ type: [ImageSchema], default: [] })
  images: Image[];

  @Prop({ required: true })
  categoryId: string;
}

export const ProductDataSchema = SchemaFactory.createForClass(ProductData);

// ProductInfo Schema
@Schema()
export class ProductInfo extends Document {
  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedBy: string;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ default: null })
  deletedBy: string;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ required: true })
  dataSource: string;

  @Prop({ required: true })
  companyStatus: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  skipEvent: boolean;

  @Prop({ required: true })
  userRequestId: string;
}

export const ProductInfoSchema = SchemaFactory.createForClass(ProductInfo);

// Product Schema
@Schema()
export class Product extends Document {
  @Prop({ required: true })
  docId: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  fullData: any;

  @Prop({ type: ProductDataSchema, required: true })
  data: ProductData;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  dataPublic: any;

  @Prop({ required: true })
  immutable: boolean;

  @Prop({ required: true })
  deploymentId: string;

  @Prop({ required: true })
  docType: string;

  @Prop({ required: true })
  namespace: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: ProductInfoSchema, required: true })
  info: ProductInfo;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
