import { createClient } from "@/utils/supabase/server";

export default async function fetchTableData<T>({
  table,
  fields,
}: {
  table: string;
  fields: string[];
}): Promise<T> {
  const supabase = await createClient();
  const fieldString = fields.join(", ");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error: fetchError } = await supabase
    .from(table)
    .select(fieldString)
    .eq("id", user?.id)
    .single<T>();

  if (fetchError) {
    throw new Error(
      `Error fetching data from table "${table}": ${fetchError.message}`
    );
  }

  if (!data) {
    throw new Error(`No data found for table "${table}".`);
  }

  return data;
}
