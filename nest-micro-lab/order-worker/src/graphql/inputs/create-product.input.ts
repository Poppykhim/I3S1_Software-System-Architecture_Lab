import { InputType, Field, Float, ID } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field(() => Float) // Use Float for prices
  price: number;

  @Field(() => ID) // ID is usually a string or number
  categoryId: string;

  @Field()
  sku: string;
}
