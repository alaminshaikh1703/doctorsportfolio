import { NextResponse } from "next/server";
import { SlotService } from "../../../../modules/slot/slot.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId") || "clinic-1";
    const slots = await SlotService.getAllSlotsForClinic(clinicId);
    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.startTime || !body.endTime) {
      return NextResponse.json({ success: false, error: "Start time and End time are required." }, { status: 400 });
    }
    const created = await SlotService.createSlot(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Slot ID is required." }, { status: 400 });
    }
    await SlotService.updateSlot(body.id, body);
    return NextResponse.json({ success: true, message: "Slot updated successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Slot ID is required." }, { status: 400 });
    }
    await SlotService.deleteSlot(id);
    return NextResponse.json({ success: true, message: "Slot deleted successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
