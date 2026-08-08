import { NextResponse } from "next/server";
import { SlotService } from "../../../modules/slot/slot.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId") || "clinic-1";
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const slots = await SlotService.getAvailableSlotsForClinicAndDate(clinicId, date);

    return NextResponse.json({
      success: true,
      clinicId,
      date,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    const errMsg = (error as Error).message;
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}
