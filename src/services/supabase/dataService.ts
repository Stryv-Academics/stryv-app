import { createClient } from "@/utils/supabase/server";

export async function fetchTableDataSingle<T>(
  table: string,
  fields: string[],
  filterField: string,
  filterValue: string
): Promise<T> {
  const supabase = await createClient();

  // Perform the query
  const { data, error } = await supabase
    .from(table)
    .select(fields.join(", ")) // Select specified fields
    .eq(filterField, filterValue) // Apply filter
    .single<T>();

  // Handle errors
  if (error) throw new Error(error.message);

  return data;
}
