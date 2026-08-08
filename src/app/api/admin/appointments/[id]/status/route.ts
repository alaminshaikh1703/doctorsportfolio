import { NextResponse } from "next/server";
import { AppointmentRepository } from "../../../../../../modules/appointment/appointment.repository";
import { AppointmentStatus } from "../../../../../../types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, changedBy } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required." }, { status: 400 });
    }

    const validStatuses: AppointmentStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled", "No Show"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value." }, { status: 400 });
    }

    await AppointmentRepository.updateStatus(id, status as AppointmentStatus, changedBy || "Admin");

    return NextResponse.json({
      success: true,
      message: `Appointment status updated to ${status}.`,
    });
  } catch (error) {
    const errMsg = (error as Error).message;
    console.error("Error updating appointment status:", errMsg);
    return NextResponse.json(
      { success: false, error: `Failed to update status: ${errMsg}` },
      { status: 500 }
    );
  }
}
