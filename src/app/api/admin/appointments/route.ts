import { NextResponse } from "next/server";
import { AppointmentRepository } from "../../../../modules/appointment/appointment.repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const doctor = searchParams.get("doctor") || undefined;
    const clinic = searchParams.get("clinic") || undefined;
    const service = searchParams.get("service") || undefined;
    const status = searchParams.get("status") || undefined;
    const date = searchParams.get("date") || undefined;

    const appointments = await AppointmentRepository.getAdminAppointments({
      search,
      doctor,
      clinic,
      service,
      status,
      date,
    });

    return NextResponse.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    const errMsg = (error as Error).message;
    console.error("Error fetching admin appointments:", errMsg);
    return NextResponse.json(
      { success: false, error: `Failed to fetch appointments: ${errMsg}` },
      { status: 500 }
    );
  }
}
