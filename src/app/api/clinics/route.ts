import { NextResponse } from "next/server";
import { ClinicService } from "../../../modules/clinic/clinic.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clinics = await ClinicService.getActiveClinics();
    return NextResponse.json({
      success: true,
      count: clinics.length,
      data: clinics,
    });
  } catch (error) {
    const errMsg = (error as Error).message;
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
