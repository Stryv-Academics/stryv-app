import { createClient } from "@/utils/supabase/client";
const MAX_FILE_SIZE = 1 * 1024 * 1024;

const supabase = createClient();

const uploadFile = async (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    return { url: "", type: "" };
  }
  const file_path = `${Date.now()}-${file.name}`;

  const { /*data, not used but could be useful in display for file name*/ error } = await supabase.storage
    .from("attachments")
    .upload(file_path, file);
  if (error) {
    console.error("Error uploading file:", error.message);
    return { url: "", type: "" };
  }

  const { data: publicUrl } = supabase.storage
    .from("attachments")
    .getPublicUrl(file_path);
  return {
    url: publicUrl.publicUrl || "",
    type: file.type,
  };
};

export default uploadFile;
