import { Router, type IRouter } from "express";
import { db, studyDaysTable } from "@workspace/db";
import { MarkStudiedResponse, GetStreakResponse, GetHistoryResponse } from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

function getTodayDateStr(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function calculateStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;

  const today = getTodayDateStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const mostRecent = sortedDates[0];
  if (mostRecent !== today && mostRecent !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedDate = mostRecent === today ? today : yesterdayStr;

  for (const date of sortedDates) {
    if (date === expectedDate) {
      streak++;
      const d = new Date(expectedDate);
      d.setDate(d.getDate() - 1);
      expectedDate = d.toISOString().split("T")[0];
    } else {
      break;
    }
  }

  return streak;
}

router.post("/study", async (_req, res) => {
  try {
    const today = getTodayDateStr();

    const existing = await db
      .select()
      .from(studyDaysTable)
      .where(eq(studyDaysTable.studyDate, today));

    if (existing.length > 0) {
      res.status(409).json({
        error: "ALREADY_STUDIED",
        message: "You have already marked today.",
      });
      return;
    }

    await db.insert(studyDaysTable).values({ studyDate: today });

    const allDates = await db
      .select({ studyDate: studyDaysTable.studyDate })
      .from(studyDaysTable)
      .orderBy(desc(studyDaysTable.studyDate));

    const sortedDates = allDates.map((r) => r.studyDate);
    const currentStreak = calculateStreak(sortedDates);
    const totalDays = sortedDates.length;

    const data = MarkStudiedResponse.parse({
      message: "Great job! You studied today!",
      currentStreak,
      totalDays,
      date: today,
    });

    res.json(data);
  } catch (err) {
    console.error("POST /study error:", err);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Something went wrong." });
  }
});

router.get("/streak", async (_req, res) => {
  try {
    const allDates = await db
      .select({ studyDate: studyDaysTable.studyDate })
      .from(studyDaysTable)
      .orderBy(desc(studyDaysTable.studyDate));

    const sortedDates = allDates.map((r) => r.studyDate);
    const today = getTodayDateStr();

    const currentStreak = calculateStreak(sortedDates);
    const totalDays = sortedDates.length;
    const lastStudyDate = sortedDates.length > 0 ? sortedDates[0] : null;
    const studiedToday = sortedDates.includes(today);

    const data = GetStreakResponse.parse({
      currentStreak,
      totalDays,
      lastStudyDate,
      studiedToday,
    });

    res.json(data);
  } catch (err) {
    console.error("GET /streak error:", err);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Something went wrong." });
  }
});

router.get("/history", async (_req, res) => {
  try {
    const allDates = await db
      .select({ studyDate: studyDaysTable.studyDate })
      .from(studyDaysTable)
      .orderBy(desc(studyDaysTable.studyDate));

    const dates = allDates.map((r) => r.studyDate);

    const data = GetHistoryResponse.parse({ dates });
    res.json(data);
  } catch (err) {
    console.error("GET /history error:", err);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Something went wrong." });
  }
});

export default router;
