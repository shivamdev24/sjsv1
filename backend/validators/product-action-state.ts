export type ProductActionState = {
  success: boolean;
  message: string;
};

export const initialProductActionState: ProductActionState = {
  success: false,
  message: "",
};
