import { NextResponse } from "next/server";
import { AppointmentRepository } from "../../../../../modules/appointment/appointment.repository";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const success = await AppointmentRepository.updateAppointment(id, body);
    if (success) {
      return NextResponse.json({ success: true, message: "Appointment updated successfully." });
    }
    return NextResponse.json({ success: false, error: "No fields provided to update." }, { status: 400 });
  } catch (error) {
    const errMsg = (error as Error).message;
    console.error("Error updating appointment:", errMsg);
    return NextResponse.json(
      { success: false, error: `Failed to update appointment: ${errMsg}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await AppointmentRepository.softDelete(id);
    return NextResponse.json({ success: true, message: "Appointment soft deleted successfully." });
  } catch (error) {
    const errMsg = (error as Error).message;
    console.error("Error deleting appointment:", errMsg);
    return NextResponse.json(
      { success: false, error: `Failed to delete appointment: ${errMsg}` },
      { status: 500 }
    );
  }
}
