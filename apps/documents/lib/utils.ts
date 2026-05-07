export const formatterISO8601 = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const formatterCurrency = (currency: string) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    currencyDisplay: "symbol",
  });

export const formatMoney = (value: number, currency: string) => {
  const formatter = formatterCurrency(currency);
  return formatter.format(value);
};

export const isEmptyNullOrUndefined = (
  value: string | undefined | null,
): value is "" | null | undefined =>
  value === "" || value === null || value === undefined;

export function formatSpanishDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const [, year, month, day] = match;
  const monthsEs = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const monthIndex = Number(month) - 1;
  const monthName = monthsEs[monthIndex];
  if (!monthName) {
    throw new Error("Invalid month in date.");
  }

  const dayPadded = day.padStart(2, "0");
  return `${dayPadded} de ${monthName}`;
}

export function formatSpanishDateWithYear(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const [, year, month, day] = match;
  const monthsEs = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const monthIndex = Number(month) - 1;
  const monthName = monthsEs[monthIndex];
  if (!monthName) {
    throw new Error("Invalid month in date.");
  }

  return `${monthName} ${day} de ${year}`;
}
