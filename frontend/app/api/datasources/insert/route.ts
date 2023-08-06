import { serverSupabaseClient } from "@/core/supabase/supabase-server";
import { AdminFormInput } from "@/types/forms";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = serverSupabaseClient();
  const { organization, file_type, url, datastore }: AdminFormInput =
    await req.json();

  try {
    // Fetch data from the source table
    const { data: dataStores } = await supabase
      .from("datastores")
      .select("id")
      .eq("name", datastore)
      .eq("organization_id", organization);

    if (!dataStores) {
      throw new Error("datastore: not found");
    }

    // Insert data into the destination table
    const { error: insertError, data } = await supabase
      .from("datasources")
      .insert({
        type: file_type,
        datastore_id: dataStores[0].id,
        meta: { url: url, characters: 0 },
        organization: organization,
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
