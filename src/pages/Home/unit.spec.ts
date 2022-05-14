import { categorizeTournaments } from "./container";

describe("Homepage Unit Tests", () => {
  describe("categorize tournaments", () => {
    it("should return expected categorized tournaments", () => {
      // Arrange
      const now = new Date();
      const nowText = `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}`;
      const todayTournaments = [
        {
          id: "today-1",
          start_date: nowText,
        },
      ];
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowText = `${tomorrow.getFullYear()}-${
        tomorrow.getMonth() + 1
      }-${tomorrow.getDate()}`;

      const tomorrowTournaments = [
        {
          id: "tomorrow-1",
          start_date: tomorrowText,
        },
        {
          id: "tomorrow-2",
          start_date: tomorrowText,
        },
        {
          id: "tomorrow-3",
          start_date: tomorrowText,
        },
        {
          id: "tomorrow-4",
          start_date: tomorrowText,
        },
      ];

      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextWeekText = `${nextWeek.getFullYear()}-${
        nextWeek.getMonth() + 1
      }-${nextWeek.getDate()}`;

      const nextWeekTournaments = [
        {
          id: "next-week-1",
          start_date: nextWeekText,
        },
        {
          id: "next-week-2",
          start_date: nextWeekText,
        },
        {
          id: "next-week-3",
          start_date: nextWeekText,
        },
      ];

      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const nextMonthText = `${nextMonth.getFullYear()}-${
        nextMonth.getMonth() + 1
      }-${nextMonth.getDate()}`;

      const nextMonthTournaments = [
        {
          id: "next-month-1",
          start_date: nextMonthText,
        },
      ];

      const tournaments = [
        ...todayTournaments,
        ...tomorrowTournaments,
        ...nextWeekTournaments,
        ...nextMonthTournaments,
      ];

      // Act
      const categorizedTournaments = categorizeTournaments(tournaments as any);

      // Assert
      expect(Array.isArray(categorizedTournaments.today)).toBe(true);
      expect(categorizedTournaments.today).toHaveLength(
        todayTournaments.length
      );
      expect(Array.isArray(categorizedTournaments.tomorrow)).toBe(true);
      expect(categorizedTournaments.tomorrow).toHaveLength(
        tomorrowTournaments.length
      );
      expect(Array.isArray(categorizedTournaments.soon)).toBe(true);
      expect(categorizedTournaments.soon).toHaveLength(
        nextWeekTournaments.length
      );
      expect(Array.isArray(categorizedTournaments.later)).toBe(true);
      expect(categorizedTournaments.later).toHaveLength(
        nextMonthTournaments.length
      );
    });
  });
});
