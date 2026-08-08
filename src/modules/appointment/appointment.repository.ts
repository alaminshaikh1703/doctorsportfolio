import { query } from "../../lib/db";
import { AppointmentRecord, AppointmentBookingRequest, AppointmentStatus } from "../../types";
import { PatientRepository } from "../patient/patient.repository";

export class AppointmentRepository {
  /**
   * Generates atomic unique appointment number: APT-YYYYMMDD-XXXX
   */
  static async generateAppointmentNumber(dateStr: string): Promise<string> {
    const cleanDate = dateStr.replace(/-/g, ""); // e.g. "20260805"
    const prefix = `APT-${cleanDate}-`;

    const rows = await query<any[]>(
      "SELECT appointment_number FROM appointments WHERE appointment_number LIKE ? ORDER BY created_at DESC LIMIT 1",
      [`${prefix}%`]
    );

    let nextSeq = 1;
    if (rows && rows.length > 0) {
      const lastNum = rows[0].appointment_number;
      const parts = lastNum.split("-");
      if (parts.length === 3) {
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          nextSeq = lastSeq + 1;
        }
      }
    }

    return `${prefix}${nextSeq.toString().padStart(4, "0")}`;
  }

  /**
   * 4-Point Duplicate Prevention Check:
   * Phone + Date + Slot + Clinic
   */
  static async checkDuplicate(
    phone: string,
    appointmentDate: string,
    slotId: string,
    clinicId: string
  ): Promise<boolean> {
    const cleanPhone = phone.trim();
    const rows = await query<any[]>(
      `SELECT a.id FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE p.phone = ? AND a.appointment_date = ? AND a.appointment_slot_id = ? AND a.clinic_id = ? 
       AND a.status NOT IN ('Cancelled') AND a.is_deleted = 0 LIMIT 1`,
      [cleanPhone, appointmentDate, slotId, clinicId]
    );

    return Boolean(rows && rows.length > 0);
  }

  /**
   * Create new appointment and patient
   */
  static async createAppointment(req: AppointmentBookingRequest): Promise<AppointmentRecord> {
    // 1. Concurrently find/create patient and generate appointment number
    const [patient, appointmentNumber] = await Promise.all([
      PatientRepository.findOrCreate(req.patientName, req.patientPhone, req.patientEmail, req.patientAge),
      this.generateAppointmentNumber(req.appointmentDate),
    ]);

    // 2. Generate appointment ID & timestamps
    const appointmentId = `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 3. Concurrently insert appointment record and initial status history
    await Promise.all([
      query(
        `INSERT INTO appointments (
          id, appointment_number, patient_id, doctor_id, clinic_id, service_id,
          appointment_date, appointment_slot_id, appointment_time, appointment_type,
          patient_age, reason, status, booking_source, confirmed_at, is_deleted, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?, 0, ?, ?)`,
        [
          appointmentId,
          appointmentNumber,
          patient.id,
          req.doctorId || "doc-1",
          req.clinicId,
          req.serviceId,
          req.appointmentDate,
          req.appointmentSlotId,
          req.appointmentTime,
          req.appointmentType || "Regular",
          req.patientAge || null,
          req.reason ? req.reason.trim() : null,
          req.bookingSource || "Website",
          now,
          now,
          now,
        ]
      ),
      query(
        "INSERT INTO appointment_status_history (id, appointment_id, status, changed_by, created_at) VALUES (?, ?, 'Confirmed', ?, ?)",
        [`ash-${Date.now()}`, appointmentId, req.bookingSource === "Admin" ? "Admin" : "Patient", now]
      ),
    ]);

    return {
      id: appointmentId,
      appointmentNumber,
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      patientEmail: patient.email,
      patientAge: req.patientAge || patient.patientAge,
      doctorId: req.doctorId,
      clinicId: req.clinicId,
      serviceId: req.serviceId,
      appointmentDate: req.appointmentDate,
      appointmentSlotId: req.appointmentSlotId,
      appointmentTime: req.appointmentTime,
      appointmentType: req.appointmentType || "Regular",
      visited: false,
      confirmedAt: now,
      reason: req.reason,
      status: "Confirmed",
      bookingSource: req.bookingSource,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Fetch appointments for Admin Table & Search/Filter
   */
  static async getAdminAppointments(filters?: {
    search?: string;
    doctor?: string;
    clinic?: string;
    service?: string;
    status?: string;
    date?: string;
  }): Promise<AppointmentRecord[]> {
    let sql = `
      SELECT 
        a.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.email as patient_email,
        COALESCE(a.patient_age, p.age) as computed_patient_age,
        d.name as doctor_name,
        c.clinic_name,
        c.address as clinic_address,
        s.title as service_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN clinics c ON a.clinic_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.is_deleted = 0
    `;

    const params: any[] = [];

    if (filters?.status && filters.status !== "All") {
      sql += " AND a.status = ?";
      params.push(filters.status);
    }

    if (filters?.doctor && filters.doctor !== "All") {
      sql += " AND a.doctor_id = ?";
      params.push(filters.doctor);
    }

    if (filters?.clinic && filters.clinic !== "All") {
      sql += " AND a.clinic_id = ?";
      params.push(filters.clinic);
    }

    if (filters?.service && filters.service !== "All") {
      sql += " AND a.service_id = ?";
      params.push(filters.service);
    }

    if (filters?.date) {
      sql += " AND a.appointment_date = ?";
      params.push(filters.date);
    }

    if (filters?.search) {
      const q = `%${filters.search.trim()}%`;
      sql += " AND (a.appointment_number LIKE ? OR p.full_name LIKE ? OR p.phone LIKE ?)";
      params.push(q, q, q);
    }

    sql += " ORDER BY a.created_at DESC";

    const rows = await query<any[]>(sql, params);
    if (!rows || rows.length === 0) return [];

    return rows.map((r) => ({
      id: r.id,
      appointmentNumber: r.appointment_number,
      patientId: r.patient_id,
      patientName: r.patient_name,
      patientPhone: r.patient_phone,
      patientEmail: r.patient_email || undefined,
      patientAge: r.computed_patient_age ? Number(r.computed_patient_age) : undefined,
      doctorId: r.doctor_id,
      doctorName: r.doctor_name || "Dr. Farzana Khan Mohima",
      clinicId: r.clinic_id,
      clinicName: r.clinic_name || "Mohakhali Specialised Dental Care",
      clinicAddress: r.clinic_address || "House 42, Road 4, Mohakhali DOHS, Dhaka",
      serviceId: r.service_id,
      serviceName: r.service_name || "Dental Consultation",
      appointmentDate: typeof r.appointment_date === 'string' ? r.appointment_date : new Date(r.appointment_date).toISOString().split('T')[0],
      appointmentSlotId: r.appointment_slot_id,
      appointmentTime: r.appointment_time,
      appointmentType: r.appointment_type || "Regular",
      visited: Boolean(r.visited),
      confirmedAt: r.confirmed_at || null,
      completedAt: r.completed_at || null,
      reason: r.reason || "",
      status: r.status as AppointmentStatus,
      bookingSource: r.booking_source || "Website",
      adminNote: r.admin_note || "",
      isDeleted: Boolean(r.is_deleted),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  /**
   * Update Appointment Status
   */
  static async updateStatus(id: string, newStatus: AppointmentStatus, changedBy: string = "Admin"): Promise<boolean> {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let extraSet = "";
    if (newStatus === "Confirmed") extraSet = ", confirmed_at = NOW()";
    if (newStatus === "Completed") extraSet = ", completed_at = NOW(), visited = 1";

    await query(
      `UPDATE appointments SET status = ?, updated_at = NOW() ${extraSet} WHERE id = ?`,
      [newStatus, id]
    );

    await query(
      "INSERT INTO appointment_status_history (id, appointment_id, status, changed_by, created_at) VALUES (?, ?, ?, ?, ?)",
      [`ash-${Date.now()}`, id, newStatus, changedBy, now]
    );

    return true;
  }

  /**
   * Full Edit / Reschedule Appointment
   */
  static async updateAppointment(id: string, data: Partial<AppointmentRecord>): Promise<boolean> {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.appointmentDate) {
      fields.push("appointment_date = ?");
      params.push(data.appointmentDate);
    }
    if (data.appointmentSlotId) {
      fields.push("appointment_slot_id = ?");
      params.push(data.appointmentSlotId);
    }
    if (data.appointmentTime) {
      fields.push("appointment_time = ?");
      params.push(data.appointmentTime);
    }
    if (data.clinicId) {
      fields.push("clinic_id = ?");
      params.push(data.clinicId);
    }
    if (data.serviceId) {
      fields.push("service_id = ?");
      params.push(data.serviceId);
    }
    if (data.appointmentType) {
      fields.push("appointment_type = ?");
      params.push(data.appointmentType);
    }
    if (data.visited !== undefined) {
      fields.push("visited = ?");
      params.push(data.visited ? 1 : 0);
    }
    if (data.adminNote !== undefined) {
      fields.push("admin_note = ?");
      params.push(data.adminNote);
    }

    if (fields.length === 0) return false;

    fields.push("updated_at = NOW()");
    params.push(id);

    await query(`UPDATE appointments SET ${fields.join(", ")} WHERE id = ?`, params);
    return true;
  }

  /**
   * Soft Delete Appointment
   */
  static async softDelete(id: string): Promise<boolean> {
    await query("UPDATE appointments SET is_deleted = 1, updated_at = NOW() WHERE id = ?", [id]);
    return true;
  }
}
