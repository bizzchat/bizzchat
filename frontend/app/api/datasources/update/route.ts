import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const req_params = await req.json();

  console.log(req_params);

  try {
    // Update datasource status
    const { error: updateError, data } = await supabase
      .from("datasources")
      .update({ status: "ready" })
      .eq("id", req_params.id);

    if (updateError) {
      throw updateError;
    }
    console.log("testing");

    return NextResponse.json({ data });
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
