import { query } from "../../lib/db";
import { PatientRecord } from "../../types";

export class PatientRepository {
  /**
   * Find patient by exact phone number
   */
  static async findByPhone(phone: string): Promise<PatientRecord | null> {
    const cleanPhone = phone.trim();
    const rows = await query<any[]>("SELECT * FROM patients WHERE phone = ? LIMIT 1", [cleanPhone]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        fullName: r.full_name,
        phone: r.phone,
        email: r.email || undefined,
        patientAge: r.age ? Number(r.age) : undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    }
    return null;
  }

  /**
   * Find or create patient record by phone
   */
  static async findOrCreate(patientName: string, phone: string, email?: string, patientAge?: number): Promise<PatientRecord> {
    const cleanPhone = phone.trim();
    const existing = await this.findByPhone(cleanPhone);
    if (existing) {
      // Update name/email/age if provided
      await query(
        "UPDATE patients SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), age = COALESCE(?, age) WHERE id = ?",
        [patientName.trim(), email ? email.trim() : null, patientAge || null, existing.id]
      );
      return {
        ...existing,
        fullName: patientName || existing.fullName,
        email: email || existing.email,
        patientAge: patientAge || existing.patientAge,
      };
    }

    // Create new patient
    const newId = `pat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await query(
      "INSERT INTO patients (id, full_name, phone, email, age, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [newId, patientName.trim(), cleanPhone, email ? email.trim() : null, patientAge || null, now, now]
    );

    return {
      id: newId,
      fullName: patientName.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      patientAge: patientAge,
      createdAt: now,
      updatedAt: now,
    };
  }
}
