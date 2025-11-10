export type HairType = "straight" | "wavy" | "curly" | "coily";
export type HairLength = "short" | "medium" | "long";
export type Inputs = {
location: string; // free text city or "gps"
hairType: HairType;
hairLength: HairLength;
concerns: string[];
hasHeatTools: boolean;
hasTimeMins: number;
};
export type Weather = {
tempC: number;
humidity: number; // %
windKph: number;
precipitation: "none" | "rain" | "snow" | "drizzle";
uvIndex: number; // 0-11+
dewPointC: number;
description: string;
};
export type Rec = {
headline: string;
styles: string[];
products: string[];
steps: string[];
rationale: string[];
};