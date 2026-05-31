/**
 * Awards and recognition Prime Interest has earned. Editable here without
 * touching page JSX — both the About page section and the homepage strip
 * read from these.
 */

export interface Ranking {
  year: string;
  rank: string;
  note: string;
}

export interface Award {
  year: string;
  title: string;
  category: string;
}

export const RANKINGS: Ranking[] = [
  { year: "2019", rank: "#5",  note: "Commercial RE Developer" },
  { year: "2020", rank: "#7",  note: "Commercial RE Developer" },
  { year: "2021", rank: "#12", note: "Commercial RE Developer" },
  { year: "2022", rank: "#13", note: "Commercial RE Developer" },
];

export const AWARDS: Award[] = [
  {
    year: "2022",
    title: "Washington Contractor Award",
    category: "Multi-Family / Mixed-Use / Hospitality",
  },
];

/** First (most prominent) award — currently used as a featured callout. */
export const FEATURED_AWARD = AWARDS[0];
