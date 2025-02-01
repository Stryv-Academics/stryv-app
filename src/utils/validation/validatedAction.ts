import { z } from "zod";

export type ActionState = {
  error?: string;
  success?: string;
  fieldData?: Record<string, unknown>;
  [key: string]: unknown;
};

type ValidatedActionFunction<S extends z.ZodType<unknown, z.ZodTypeDef>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<unknown, z.ZodTypeDef>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message } as T;
    }

    return action(result.data, formData);
  };
}
