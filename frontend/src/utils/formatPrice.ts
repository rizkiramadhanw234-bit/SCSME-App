export const formatPrice = (price: string) => {
  return "RM " + Number(price).toLocaleString("en-US");
};
