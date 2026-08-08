import { query } from "../../lib/db";
import { AppointmentSlotEntity } from "../../types";

export class SlotService {
  /**
   * Fetch available slots for a specific clinic and target date,
   * dynamically calculating booked_count for that date vs max_capacity.
   */
  static async getAvailableSlotsForClinicAndDate(
    clinicId: string,
    appointmentDate: string
  ): Promise<AppointmentSlotEntity[]> {
    // Determine Day of Week for target date (e.g. "Saturday")
    const dateObj = new Date(appointmentDate);
    const dayOfWeek = isNaN(dateObj.getTime())
      ? "Saturday"
      : dateObj.toLocaleDateString("en-US", { weekday: "long" });

    // Fetch all active slots for clinic & day of week
    // 1. Fetch slots for clinic & day of week from DB
    let rows = await query<any[]>(
      "SELECT * FROM appointment_slots WHERE clinic_id = ? AND day_of_week = ? ORDER BY start_time ASC",
      [clinicId, dayOfWeek]
    );

    // 2. If clinic has never been seeded in DB, auto-seed default DB rows for clinic
    if (!rows || rows.length === 0) {
      const checkTotal = await query<any[]>(
        "SELECT COUNT(*) as total FROM appointment_slots WHERE clinic_id = ?",
        [clinicId]
      );
      const total = checkTotal?.[0]?.total ? Number(checkTotal[0].total) : 0;

      // Only seed if clinic has 0 total slots ever created
      if (total === 0) {
        const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
        const defaultTimes = [
          { start: "09:00 AM", end: "09:30 AM" },
          { start: "10:30 AM", end: "11:00 AM" },
          { start: "02:00 PM", end: "02:30 PM" },
          { start: "04:00 PM", end: "04:30 PM" },
          { start: "06:00 PM", end: "06:30 PM" },
        ];

        for (const d of days) {
          for (let i = 0; i < defaultTimes.length; i++) {
            const sId = `slot-${clinicId}-${d.toLowerCase().slice(0, 3)}-${i + 1}`;
            await query(
              "INSERT IGNORE INTO appointment_slots (id, clinic_id, day_of_week, start_time, end_time, max_capacity, status) VALUES (?, ?, ?, ?, ?, ?, 'Active')",
              [sId, clinicId, d, defaultTimes[i].start, defaultTimes[i].end, 2]
            );
          }
        }

        // Re-fetch after seeding
        rows = await query<any[]>(
          "SELECT * FROM appointment_slots WHERE clinic_id = ? AND day_of_week = ? ORDER BY start_time ASC",
          [clinicId, dayOfWeek]
        );
      }
    }

    if (!rows || rows.length === 0) return [];

    // Filter ONLY 'Active' slots for public booking
    const activeRows = rows.filter((r) => r.status === "Active");
    if (activeRows.length === 0) return [];

    const slots: AppointmentSlotEntity[] = activeRows.map((r) => ({
      id: r.id,
      clinicId: r.clinic_id,
      dayOfWeek: r.day_of_week,
      startTime: r.start_time,
      endTime: r.end_time,
      maxCapacity: Number(r.max_capacity) || 2,
      bookedCount: 0,
      status: r.status,
      createdAt: r.created_at,
    }));

    // Query actual booked counts for appointmentDate & clinicId
    const countRows = await query<any[]>(
      `SELECT appointment_slot_id, COUNT(*) as cnt 
       FROM appointments 
       WHERE clinic_id = ? AND appointment_date = ? AND status NOT IN ('Cancelled') AND is_deleted = 0 
       GROUP BY appointment_slot_id`,
      [clinicId, appointmentDate]
    );

    const countsMap = new Map<string, number>();
    if (countRows && countRows.length > 0) {
      for (const row of countRows) {
        countsMap.set(row.appointment_slot_id, Number(row.cnt));
      }
    }

    // Attach booked counts and filter/mark status
    return slots.map((s) => {
      const booked = countsMap.get(s.id) || 0;
      const isFull = booked >= s.maxCapacity;
      return {
        ...s,
        bookedCount: booked,
        status: isFull ? "Inactive" : s.status,
      };
    });
  }

  /**
   * Fetch all configured slots for a clinic (for Admin panel slot editor)
   */
  static async getAllSlotsForClinic(clinicId: string): Promise<AppointmentSlotEntity[]> {
    let rows = await query<any[]>(
      "SELECT * FROM appointment_slots WHERE clinic_id = ? ORDER BY day_of_week ASC, start_time ASC",
      [clinicId]
    );

    // If 0 rows in DB for this clinic, auto-seed real DB rows first so deletion & status changes persist in MySQL!
    if (!rows || rows.length === 0) {
      const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
      const times = [
        { start: "09:00 AM", end: "09:30 AM" },
        { start: "10:30 AM", end: "11:00 AM" },
        { start: "02:00 PM", end: "02:30 PM" },
        { start: "04:00 PM", end: "04:30 PM" },
        { start: "06:00 PM", end: "06:30 PM" },
      ];

      for (const d of days) {
        for (let i = 0; i < times.length; i++) {
          const sId = `slot-${clinicId}-${d.toLowerCase().slice(0, 3)}-${i + 1}`;
          await query(
            "INSERT IGNORE INTO appointment_slots (id, clinic_id, day_of_week, start_time, end_time, max_capacity, status) VALUES (?, ?, ?, ?, ?, ?, 'Active')",
            [sId, clinicId, d, times[i].start, times[i].end, 2]
          );
        }
      }

      rows = await query<any[]>(
        "SELECT * FROM appointment_slots WHERE clinic_id = ? ORDER BY day_of_week ASC, start_time ASC",
        [clinicId]
      );
    }

    if (!rows || rows.length === 0) return [];

    return rows.map((r) => ({
      id: r.id,
      clinicId: r.clinic_id,
      dayOfWeek: r.day_of_week,
      startTime: r.start_time,
      endTime: r.end_time,
      maxCapacity: Number(r.max_capacity) || 2,
      bookedCount: 0,
      status: r.status,
      createdAt: r.created_at,
    }));
  }

  /**
   * Create a new appointment slot
   */
  static async createSlot(data: Partial<AppointmentSlotEntity>): Promise<AppointmentSlotEntity> {
    const newId = data.id || `slot-${data.clinicId || "clinic-1"}-${Date.now()}`;
    const clinicId = data.clinicId || "clinic-1";
    const dayOfWeek = data.dayOfWeek || "Saturday";
    const startTime = data.startTime || "09:00 AM";
    const endTime = data.endTime || "09:30 AM";
    const maxCapacity = data.maxCapacity || 2;
    const status = data.status || "Active";

    await query(
      `INSERT INTO appointment_slots (id, clinic_id, day_of_week, start_time, end_time, max_capacity, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       start_time = VALUES(start_time), end_time = VALUES(end_time), max_capacity = VALUES(max_capacity), status = VALUES(status)`,
      [newId, clinicId, dayOfWeek, startTime, endTime, maxCapacity, status]
    );

    return {
      id: newId,
      clinicId,
      dayOfWeek,
      startTime,
      endTime,
      maxCapacity,
      bookedCount: 0,
      status,
    };
  }

  /**
   * Update an existing appointment slot
   */
  static async updateSlot(id: string, data: Partial<AppointmentSlotEntity>): Promise<boolean> {
    await query(
      `UPDATE appointment_slots SET 
        day_of_week = COALESCE(?, day_of_week),
        start_time = COALESCE(?, start_time),
        end_time = COALESCE(?, end_time),
        max_capacity = COALESCE(?, max_capacity),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [data.dayOfWeek || null, data.startTime || null, data.endTime || null, data.maxCapacity || null, data.status || null, id]
    );
    return true;
  }

  /**
   * Delete an appointment slot
   */
  static async deleteSlot(id: string): Promise<boolean> {
    await query("DELETE FROM appointment_slots WHERE id = ?", [id]);
    return true;
  }
}
