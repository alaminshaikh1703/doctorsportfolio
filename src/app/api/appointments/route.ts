import { NextResponse } from "next/server";
import { AppointmentRepository } from "../../../modules/appointment/appointment.repository";
import { SlotService } from "../../../modules/slot/slot.service";
import { ClinicService } from "../../../modules/clinic/clinic.service";
import { AppointmentBookingRequest } from "../../../types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body: AppointmentBookingRequest = await request.json();

    // 1. Server-side validation
    if (!body.patientName || !body.patientName.trim()) {
      return NextResponse.json({ success: false, error: "Patient name is required." }, { status: 400 });
    }
    if (!body.patientPhone || !body.patientPhone.trim()) {
      return NextResponse.json({ success: false, error: "Valid phone number is required." }, { status: 400 });
    }
    if (!body.appointmentDate || !body.appointmentSlotId) {
      return NextResponse.json({ success: false, error: "Preferred appointment date and time slot are required." }, { status: 400 });
    }

    const doctorId = "doc-1";
    const clinicId = body.clinicId || "clinic-1";
    const serviceId = body.serviceId || "service-1";

    // 2. Run Duplicate Check, Dynamic Time Slots, & Clinic Info in Parallel (Promise.all)
    const [isDuplicate, slots, clinicInfo] = await Promise.all([
      AppointmentRepository.checkDuplicate(
        body.patientPhone,
        body.appointmentDate,
        body.appointmentSlotId,
        clinicId
      ),
      SlotService.getAvailableSlotsForClinicAndDate(clinicId, body.appointmentDate),
      ClinicService.getClinicById(clinicId),
    ]);

    if (isDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: "An active appointment with the same phone number, clinic, date, and time slot already exists.",
        },
        { status: 409 }
      );
    }

    const targetSlot = slots.find((s) => s.id === body.appointmentSlotId);
    if (targetSlot && targetSlot.status === "Inactive") {
      return NextResponse.json(
        {
          success: false,
          error: "The selected time slot is full or unavailable for the chosen date.",
        },
        { status: 400 }
      );
    }

    // 3. Fast Atomic Appointment Creation
    const createdAppointment = await AppointmentRepository.createAppointment({
      ...body,
      doctorId,
      clinicId,
      serviceId,
      appointmentTime: targetSlot ? `${targetSlot.startTime} - ${targetSlot.endTime}` : body.appointmentTime || "09:00 AM",
    });

    return NextResponse.json({
      success: true,
      message: "Appointment saved successfully.",
      data: {
        ...createdAppointment,
        clinicName: clinicInfo?.clinicName || "Aveek's Dental and Implant Center(Sat-Thu)",
        clinicAddress: clinicInfo?.address || "House 42, Road 4, Mohakhali DOHS, Dhaka",
        doctorName: "Dr. Farzana Khan Mohima",
      },
    });
  } catch (error) {
    const errMsg = (error as Error).message;
    console.error("Error creating appointment:", errMsg);
    return NextResponse.json(
      { success: false, error: `Failed to save appointment: ${errMsg}` },
      { status: 500 }
    );
  }
}
