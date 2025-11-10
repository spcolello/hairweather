import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Rec } from "../lib/types";


function Card({ title, items }: { title: string; items: string[] }) {
return (
<View style={{ backgroundColor: "#fff", padding: 16, borderRadius: 16, gap: 8 }}>
<Text style={{ fontSize: 18, fontWeight: "700" }}>{title}</Text>
{items.map((x, i) => (
<Text key={i}>• {x}</Text>
))}
</View>
);
}


export default function ResultsScreen() {
const params = useLocalSearchParams();
const rec = JSON.parse(String(params.rec)) as Rec;
return (
<ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
<Text style={{ fontSize: 24, fontWeight: "700" }}>Today</Text>
<Text style={{ opacity: 0.7 }}>{rec.headline}</Text>
<View style={{ height: 8 }} />
<Card title="Styles" items={rec.styles} />
<Card title="Products" items={rec.products} />
<Card title="Steps" items={rec.steps} />
<Card title="Why this works" items={rec.rationale} />
</ScrollView>
);
}