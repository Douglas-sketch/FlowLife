export type ABOType = "A" | "B" | "AB" | "O";
export type RhType = "+" | "-";
export type BloodType = `${ABOType}${RhType}`;

export const ABO_TYPES: ABOType[] = ["A", "B", "AB", "O"];
export const RH_TYPES: RhType[] = ["+", "-"];
export const ALL_BLOOD_TYPES: BloodType[] = ABO_TYPES.flatMap((abo) =>
  RH_TYPES.map((rh) => `${abo}${rh}` as BloodType),
);

// Quem cada tipo PODE DOAR PARA (baseado no sistema ABO e fator Rh)
const DONATION_MAP: Record<BloodType, BloodType[]> = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

export function canDonateTo(type: BloodType): BloodType[] {
  return DONATION_MAP[type];
}

export function canReceiveFrom(type: BloodType): BloodType[] {
  return ALL_BLOOD_TYPES.filter((donor) => DONATION_MAP[donor].includes(type));
}

export const BLOOD_FACTS: Record<BloodType, string> = {
  "O-": "Doador universal: pode doar hemácias para qualquer tipo sanguíneo. Muito requisitado em emergências.",
  "O+": "Tipo mais comum no Brasil. Compatível com todos os tipos Rh positivo.",
  "A-": "Pode doar para tipos A e AB. Receptor apenas de A- e O-.",
  "A+": "Um dos tipos mais frequentes na população. Doa para A+ e AB+.",
  "B-": "Tipo raro. Pode doar para B e AB (positivos e negativos).",
  "B+": "Doa para B+ e AB+. Recebe de B+, B-, O+ e O-.",
  "AB-": "Tipo raro (cerca de 0,6% da população). Receptor universal de sangue negativo.",
  "AB+": "Receptor universal: pode receber de qualquer tipo sanguíneo.",
};

export const ABO_EXPLANATION = {
  title: "Sistema ABO",
  text: "O sistema ABO classifica o sangue com base na presença de antígenos A e/ou B na superfície das hemácias. Quem tem antígeno A é tipo A, quem tem antígeno B é tipo B, quem tem os dois é AB e quem não tem nenhum é tipo O. Essa classificação é essencial para evitar reações imunológicas graves em transfusões.",
};

export const RH_EXPLANATION = {
  title: "Fator Rh",
  text: "O fator Rh indica a presença (+) ou ausência (-) da proteína Rh (antígeno D) nas hemácias. Pessoas Rh negativo só podem receber sangue Rh negativo, exceto em casos controlados, enquanto Rh positivo pode receber de ambos, respeitando a compatibilidade ABO.",
};

export function bloodStockLevel(_type: BloodType, level: number) {
  if (level <= 30) return { label: "Crítico", tone: "danger" as const };
  if (level <= 60) return { label: "Atenção", tone: "warning" as const };
  return { label: "Estável", tone: "info" as const };
}
