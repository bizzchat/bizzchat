import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const req_params = await req.json();

  try {
    // Fetch data from the source table
    const { data: dataStores, error: sourceError } = await supabase
      .from("datastores")
      .select("id")
      .eq("name", req_params.datastore)
      .eq("organization_id", req_params.organization);

    if (!dataStores) {
      throw new Error("datastore: not found");
    }

    // Insert data into the destination table
    const { error: insertError, data } = await supabase
      .from("datasources")
      .insert({
        type: req_params.file_type,
        datastore_id: dataStores[0].id,
        meta: { url: req_params.url, characters: 100 },
        organization: req_params.organization,
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
