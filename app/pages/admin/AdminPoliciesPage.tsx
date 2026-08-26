import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import { supabase } from "../../lib/supabase";
import type { PolicySection } from "../../lib/policies";

export default function AdminPoliciesPage() {
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setLoading(true);

    const { data, error } = await supabase
      .from("policy_sections")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSections((data ?? []) as PolicySection[]);
  }

  function updateSection(
    id: number,
    field: keyof PolicySection,
    value: string | boolean
  ) {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? { ...section, [field]: value }
          : section
      )
    );
  }

  function addSection() {
    setSections((current) => [
      ...current,
      {
        id: -Date.now(),
        title: "New Policy Section",
        content: "",
        enabled: true,
        sort_order: current.length + 1,
      },
    ]);
  }

  async function saveSection(section: PolicySection) {
    setSaving(true);

    const payload = {
      title: section.title.trim(),
      content: section.content,
      enabled: section.enabled,
      sort_order: section.sort_order,
    };

    const result =
      section.id < 0
        ? await supabase
            .from("policy_sections")
            .insert(payload)
            .select()
            .single()
        : await supabase
            .from("policy_sections")
            .update(payload)
            .eq("id", section.id)
            .select()
            .single();

    setSaving(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    await loadSections();
  }

  async function deleteSection(id: number) {
    if (id < 0) {
      setSections((current) =>
        current.filter((section) => section.id !== id)
      );
      return;
    }

    if (!confirm("Delete this policy section permanently?")) return;

    setSaving(true);

    const { error } = await supabase
      .from("policy_sections")
      .delete()
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    await loadSections();
  }

  async function moveSection(
    index: number,
    direction: -1 | 1
  ) {
    const targetIndex = index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= sections.length
    ) {
      return;
    }

    const reordered = [...sections];

    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];

    const updated = reordered.map((section, i) => ({
      ...section,
      sort_order: i + 1,
    }));

    setSections(updated);

    setSaving(true);

    for (const section of updated) {
      if (section.id > 0) {
        await supabase
          .from("policy_sections")
          .update({ sort_order: section.sort_order })
          .eq("id", section.id);
      }
    }

    setSaving(false);

    await loadSections();
  }

  if (loading) {
    return (
      <Container>
        <section className="py-16">
          <p>Loading policies...</p>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="py-10 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--burgundy)]">
              Website Content
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
              Policies
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Add, edit, hide, delete and reorder policy sections.
            </p>
          </div>

          <button
            type="button"
            onClick={addSection}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Add Section
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Section {index + 1}
                  </span>

                  <h2 className="mt-1 text-lg font-semibold">
                    {section.title || "Untitled"}
                  </h2>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) =>
                      updateSection(
                        section.id,
                        "enabled",
                        e.target.checked
                      )
                    }
                  />
                  Visible
                </label>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateSection(
                      section.id,
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Section title"
                  className="w-full rounded-xl border border-black/10 p-3"
                />

                <textarea
                  value={section.content}
                  onChange={(e) =>
                    updateSection(
                      section.id,
                      "content",
                      e.target.value
                    )
                  }
                  placeholder="Policy content"
                  rows={12}
                  className="w-full rounded-xl border border-black/10 p-3 leading-7"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0 || saving}
                    onClick={() => moveSection(index, -1)}
                    className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={
                      index === sections.length - 1 || saving
                    }
                    onClick={() => moveSection(index, 1)}
                    className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => deleteSection(section.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 disabled:opacity-40"
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveSection(section)}
                    className="ml-auto rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Section"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <p className="text-[var(--muted)]">
                No policy sections yet.
              </p>

              <button
                type="button"
                onClick={addSection}
                className="mt-4 rounded-xl bg-black px-5 py-3 text-sm text-white"
              >
                Add First Section
              </button>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}