import { z } from "zod";

export type ActionState = {
  error?: string;
  success?: string;
  fieldData?: Record<string, any>; //eslint-disable-line
  [key: string]: any; //eslint-disable-line
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  //eslint-disable-line
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>( //eslint-disable-line
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

/** 

Example:

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

const action = async (data: { name: string; email: string }) => {
  return { success: `Submitted: ${data.name} (${data.email})` };
};

const handler = validatedAction(schema, action);

// Example FormData:
const formData = new FormData();
formData.append("name", "John");
formData.append("email", "john@example.com");

handler({}, formData).then(console.log); // { success: "Submitted: John (john@example.com)" }

 */
