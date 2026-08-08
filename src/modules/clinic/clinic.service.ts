import { query } from "../../lib/db";
import { ClinicEntity } from "../../types";

export class ClinicService {
  /**
   * Fetch all clinics (Active & Inactive)
   */
  static async getAllClinics(): Promise<ClinicEntity[]> {
    const rows = await query<any[]>("SELECT * FROM clinics ORDER BY created_at ASC");
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        doctorId: r.doctor_id,
        clinicName: r.clinic_name,
        address: r.address,
        phone: r.phone || "",
        workingDays: typeof r.working_days === 'string' ? (r.working_days.startsWith('[') ? JSON.parse(r.working_days) : [r.working_days]) : (r.working_days || []),
        openingTime: r.opening_time || "09:00 AM",
        closingTime: r.closing_time || "08:00 PM",
        status: r.status,
        createdAt: r.created_at,
      }));
    }

    // Default seed clinics if DB table is empty
    return [
      {
        id: "clinic-1",
        doctorId: "doc-1",
        clinicName: "Aveek's Dental and Implant Center(Sat-Thu)",
        address: "House 42, Road 4, Mohakhali DOHS, Dhaka 1206",
        phone: "+8801531714840",
        workingDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        openingTime: "09:00 AM",
        closingTime: "08:00 PM",
        status: "Active",
      },
      {
        id: "clinic-2",
        doctorId: "doc-1",
        clinicName: "My Dentist & Maxillofcial Surgery(Sat-Thu)",
        address: "Branch 2, Dhanmondi, Dhaka",
        phone: "+8801531714840",
        workingDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        openingTime: "04:00 PM",
        closingTime: "09:00 PM",
        status: "Active",
      },
    ];
  }

  /**
   * Fetch all active clinics for public booking
   */
  static async getActiveClinics(): Promise<ClinicEntity[]> {
    const clinics = await this.getAllClinics();
    return clinics.filter((c) => c.status === "Active");
  }

  /**
   * Fetch clinic by ID
   */
  static async getClinicById(id: string): Promise<ClinicEntity | null> {
    const clinics = await this.getAllClinics();
    return clinics.find((c) => c.id === id) || clinics[0] || null;
  }

  /**
   * Create new clinic / chamber
   */
  static async createClinic(data: Partial<ClinicEntity>): Promise<ClinicEntity> {
    const newId = data.id || `clinic-${Date.now()}`;
    const doctorId = data.doctorId || "doc-1";
    const name = data.clinicName?.trim() || "New Clinic Chamber";
    const address = data.address?.trim() || "Clinic Address";
    const phone = data.phone?.trim() || "+8801531714840";
    const workingDays = JSON.stringify(data.workingDays || ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]);
    const openingTime = data.openingTime || "09:00 AM";
    const closingTime = data.closingTime || "08:00 PM";
    const status = data.status || "Active";

    await query(
      `INSERT INTO clinics (id, doctor_id, clinic_name, address, phone, working_days, opening_time, closing_time, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       clinic_name = VALUES(clinic_name), address = VALUES(address), phone = VALUES(phone),
       working_days = VALUES(working_days), opening_time = VALUES(opening_time), closing_time = VALUES(closing_time), status = VALUES(status)`,
      [newId, doctorId, name, address, phone, workingDays, openingTime, closingTime, status]
    );

    return {
      id: newId,
      doctorId,
      clinicName: name,
      address,
      phone,
      workingDays: data.workingDays || ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      openingTime,
      closingTime,
      status,
    };
  }

  /**
   * Update existing clinic / chamber
   */
  static async updateClinic(id: string, data: Partial<ClinicEntity>): Promise<boolean> {
    const workingDaysStr = data.workingDays ? JSON.stringify(data.workingDays) : null;
    await query(
      `UPDATE clinics SET 
        clinic_name = COALESCE(?, clinic_name),
        address = COALESCE(?, address),
        phone = COALESCE(?, phone),
        working_days = COALESCE(?, working_days),
        opening_time = COALESCE(?, opening_time),
        closing_time = COALESCE(?, closing_time),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [
        data.clinicName?.trim() || null,
        data.address?.trim() || null,
        data.phone?.trim() || null,
        workingDaysStr,
        data.openingTime || null,
        data.closingTime || null,
        data.status || null,
        id,
      ]
    );
    return true;
  }

  /**
   * Delete clinic / chamber
   */
  static async deleteClinic(id: string): Promise<boolean> {
    await query("DELETE FROM clinics WHERE id = ?", [id]);
    return true;
  }
}
