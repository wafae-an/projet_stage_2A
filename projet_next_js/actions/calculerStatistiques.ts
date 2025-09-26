export type Field = {
  id: number;
  caption: string;
  checked: boolean;
};

export type Candidature = {
  candidature_id: number;
  [key: string]: any;
};

export type StatistiquesParChamp = {
  [caption: string]: {
    [value: string]: number;
  };
};

export function calculerStatistiquesAvecNoms(
  data: Candidature[],
  selectedFields: Field[]
): StatistiquesParChamp {
  const stats: StatistiquesParChamp = {};
  const idToCaption: { [key: string]: string } = {};

  for (const field of selectedFields) {
    idToCaption[field.id.toString()] = field.caption;
  }

  for (const item of data) {
    for (const key in item) {
      if (["candidature_id", "name", "email", "candidature_status", "files"].includes(key)) continue;

      const caption = idToCaption[key];
      if (!caption) continue;

      const value = item[key];
      if (!stats[caption]) stats[caption] = {};
      if (!stats[caption][value]) stats[caption][value] = 0;

      stats[caption][value] += 1;
    }
  }

  return stats;
}
