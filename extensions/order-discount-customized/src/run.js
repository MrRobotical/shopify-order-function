// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * Qualifying product types
 */
const QUALIFYING_PRODUCT_TYPES = [
  "snowboard",
  "snowboard-bindings",
  "snowboard-boots",
];

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  let qualifyingAmount = 0;

  input.cart.lines.forEach((line) => {
    // Ensure that merchandise is of type ProductVariant and has a product
    if (
      line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.product
    ) {
      const product = line.merchandise.product;
      const productType = product.productType;
      const inAnyCollection = product.inAnyCollection;
      const totalAmount = parseFloat(line.cost.totalAmount.amount);

      if (
        productType &&
        QUALIFYING_PRODUCT_TYPES.includes(productType) &&
        inAnyCollection
      ) {
        qualifyingAmount += totalAmount; // Use totalAmount directly
      }
    }
  });

  console.log("Total qualifying amount:", qualifyingAmount);

  if (qualifyingAmount >= 500) {
    return {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          value: {
            fixedAmount: {
              amount: 50,
            },
          },
          targets: [
            {
              orderSubtotal: {
                excludedVariantIds: [],
              },
            },
          ],
        },
      ],
    };
  }

  return EMPTY_DISCOUNT;
}
