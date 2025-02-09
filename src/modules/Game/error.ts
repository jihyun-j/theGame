import { PostgrestError } from "@supabase/supabase-js";

export const getError = (err: PostgrestError) => {
  if (err.details === "The result contains 0 rows")
    return "존재하지 않은 방입니다.";
  return err.message;
};
