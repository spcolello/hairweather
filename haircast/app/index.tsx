import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, View, Text, TextInput, Pressable, Switch } from "react-native";
import { Inputs, HairType, HairLength } from "../lib/types";
import { geocodeCity, getGPSLatLon, fetchCurrent } from "../lib/weather";
import { makeRec } from "../lib/rules";

const HAIR_TYPES: HairType[] = ["straight", "wavy", "curly", "coily"];
const HAIR_LENGTHS: HairLength[] = ["short", "medium", "long"];
const CONCERNS = ["frizz", "flatness", "hold", "volume", "flyaways"] as const;

export default function HomeScreen() {
  const [form, setForm] = useState<Inputs>({
    location: "Fairfield, CT",
    hairType: "wavy",
    hairLength: "medium",
    concerns: ["frizz"],
    hasHeatTools: true,
    hasTimeMins: 10,
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit() {
    setBusy(true);
    setError(null);

    try {
      let latlon = null;

      if (form.location.trim().toLowerCase() === "gps") {
        latlon = await getGPSLatLon();
        if (!latlon) throw new Error("Location permission denied");
      } else {
        latlon = await geocodeCity(form.location);
        if (!latlon) throw new Error("Could not find that city");
      }

      const wx = await fetchCurrent(latlon.lat, latlon.lon);
      const rec = makeRec(form, wx);

      router.push({
        pathname: "/results",
        params: { rec: JSON.stringify(rec) },
      });
    } catch (e: any) {
      setError(e.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  const toggleConcern = (c: string) => {
    setForm((f) => ({
      ...f,
      concerns: f.concerns.includes(c)
        ? f.concerns.filter((x) => x !== c)
        : [...f.concerns, c],
    }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>HairCast</Text>
      <Text style={{ opacity: 0.7 }}>Weather-smart hair picks</Text>

      <Text style={{ marginTop: 8 }}>Location (city or “gps”)</Text>
      <TextInput
        value={form.location}
        onChangeText={(t) => setForm({ ...form, location: t })}
        autoCapitalize="none"
        placeholder="City, ST or 'gps'"
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <Text>Hair type</Text>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {HAIR_TYPES.map((t) => (
          <Pressable
            key={t}
            onPress={() => setForm({ ...form, hairType: t })}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderRadius: 999,
              backgroundColor: form.hairType === t ? "#111" : "#fff",
            }}
          >
            <Text style={{ color: form.hairType === t ? "#fff" : "#111" }}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text>Hair length</Text>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {HAIR_LENGTHS.map((t) => (
          <Pressable
            key={t}
            onPress={() => setForm({ ...form, hairLength: t })}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderRadius: 999,
              backgroundColor: form.hairLength === t ? "#111" : "#fff",
            }}
          >
            <Text style={{ color: form.hairLength === t ? "#fff" : "#111" }}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text>Concerns</Text>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {CONCERNS.map((c) => (
          <Pressable
            key={c}
            onPress={() => toggleConcern(c)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderRadius: 999,
              backgroundColor: form.concerns.includes(c) ? "#111" : "#fff",
            }}
          >
            <Text style={{ color: form.concerns.includes(c) ? "#fff" : "#111" }}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text>Time available (min): {form.hasTimeMins}</Text>
      <TextInput
        value={String(form.hasTimeMins)}
        keyboardType="number-pad"
        onChangeText={(t) => setForm({ ...form, hasTimeMins: Number(t || 0) })}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Switch
          value={form.hasHeatTools}
          onValueChange={(v) => setForm({ ...form, hasHeatTools: v })}
        />
        <Text>I have heat tools</Text>
      </View>

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <Pressable
        onPress={onSubmit}
        disabled={busy}
        style={{
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor: "#111",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {busy ? "Working..." : "Get recommendations"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
