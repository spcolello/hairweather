import { Inputs, Weather, Rec } from "./types";


export function makeRec(input: Inputs, wx: Weather): Rec {
const highHumidity = wx.humidity >= 65;
const windy = wx.windKph >= 20;
const hot = wx.tempC >= 27;
const cold = wx.tempC <= 5;
const wet = wx.precipitation !== "none";


const styles: string[] = [];
const products: string[] = [];
const steps: string[] = [];
const rationale: string[] = [];


switch (input.hairType) {
case "straight":
styles.push("sleek low bun", "half-up clamp");
products.push("light anti-frizz serum", "flex-hold spray");
break;
case "wavy":
styles.push("diffused waves", "low pony with face pieces");
products.push("curl mousse", "anti-humidity spray");
break;
case "curly":
styles.push("wash-and-go", "pineapple puff");
products.push("leave-in", "strong-hold gel");
break;
case "coily":
styles.push("twist-out", "protective bun/braids");
products.push("butter cream", "edge control");
break;
}


if (highHumidity) {
products.push("anti-humidity shield", "smoothing balm");
steps.push("finish with anti-humidity spray 20cm away");
rationale.push("High humidity increases frizz; seal the cuticle.");
if (windy || wet) styles.unshift("low braided bun", "slick back");
}
if (windy) {
products.push("strong-hold spray");
steps.push("anchor with pins at nape/behind ears");
rationale.push("Wind disrupts shape; choose anchored styles.");
}
if (wet) {
products.push("water-resistant gel", "microfiber towel");
styles.unshift("slicked-back wet look");
steps.push("apply gel on damp hair; let cast dry");
rationale.push("Precip favors a wet-finish style.");
}
if (hot) {
products.push("heat-protectant", "dry shampoo");
steps.push("air-dry or diffuse on low");
rationale.push("Heat increases sweat/oil; minimize hot tools.");
}
if (cold) {
products.push("nourishing oil", "anti-static spray");
steps.push("focus oils on mids→ends");
rationale.push("Cold, low humidity cause static and brittleness.");
}
if (!input.hasHeatTools) {
styles.push("no-heat braid set", "air-dry with leave-in");
steps.push("braid while damp; release when dry for waves");
}
if (input.hasTimeMins <= 5) {
styles.unshift("claw-clip updo", "low cap-friendly bun");
steps.push("two-minute slick: water + gel + brush back");
}
if (input.concerns.includes("frizz")) products.push("silicone serum", "anti-frizz sheet");
if (input.concerns.includes("volume")) { products.push("root-lift foam"); steps.push("cool-shot to set roots"); }
if (input.concerns.includes("hold")) { products.push("extra-hold hairspray"); steps.push("spray in layers; wait 30s"); }


const uniq = <T,>(a: T[]) => Array.from(new Set(a));
return {
headline: `${wx.description}`,
styles: uniq(styles).slice(0, 6),
products: uniq(products).slice(0, 8),
steps: uniq(steps).slice(0, 8),
rationale: uniq(rationale).slice(0, 4),
};
}