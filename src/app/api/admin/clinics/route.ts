import { NextResponse } from "next/server";
import { ClinicService } from "../../../../modules/clinic/clinic.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clinics = await ClinicService.getAllClinics();
    return NextResponse.json({ success: true, data: clinics });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.clinicName || !body.clinicName.trim()) {
      return NextResponse.json({ success: false, error: "Clinic name is required." }, { status: 400 });
    }
    const created = await ClinicService.createClinic(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Clinic ID is required." }, { status: 400 });
    }
    await ClinicService.updateClinic(body.id, body);
    return NextResponse.json({ success: true, message: "Clinic updated successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Clinic ID is required." }, { status: 400 });
    }
    await ClinicService.deleteClinic(id);
    return NextResponse.json({ success: true, message: "Clinic deleted successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
