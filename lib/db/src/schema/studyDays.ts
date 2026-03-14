import { pgTable, text, serial, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studyDaysTable = pgTable("study_days", {
  id: serial("id").primaryKey(),
  studyDate: date("study_date").notNull().unique(),
});

export const insertStudyDaySchema = createInsertSchema(studyDaysTable).omit({ id: true });
export type InsertStudyDay = z.infer<typeof insertStudyDaySchema>;
export type StudyDay = typeof studyDaysTable.$inferSelect;
