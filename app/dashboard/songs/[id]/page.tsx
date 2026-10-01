 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SectionName =
  | "Intro"
  | "Verse"
  | "Pre-Chorus"
  | "Chorus"
  | "Verse 2"
  | "Bridge"
  | "Outro";

type BeatPattern = {
  id: string;
  name: string;
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
  bpm: number;
};

type ArrangementSection = {
  id: string;
  name: SectionName;
  beatId: string;
  bass: boolean;
  melody: boolean;
  backing: boolean;
  vocals: boolean;
  bars: number;
};

type Song = {
  id: string;
  title: string;
  artist_name: string | null;
  genre: string | null;
  song_mood: string | null;
  song_key: string | null;
  bpm: number | null;
  description: string | null;
  verse_1: string | null;
  pre_chorus: string | null;
  chorus: string | null;
  verse_2: string | null;
  bridge: string | null;
  outro: string | null;
  is_public: boolean;
};

const SECTION_NAMES: SectionName[] = [
  "Intro",
  "Verse",
  "Pre-Chorus",
  "Chorus",
  "Verse 2",
  "Bridge",
  "Outro",
];

const STEP_COUNT = 16;

function makeSteps(): boolean[] {
  return Array.from(
    { length: STEP_COUNT },
    () => false
  );
}

function createBeat(
  name: string,
  bpm: number
): BeatPattern {
  return {
    id: crypto.randomUUID(),
    name,
    bpm,
    kick: makeSteps(),
    snare: makeSteps(),
    hihat: makeSteps(),
  };
}

function createDefaultArrangement(
  beatId: string
): ArrangementSection[] {
  return [
    {
      id: crypto.randomUUID(),
      name: "Intro",
      beatId,
      bass: false,
      melody: false,
      backing: true,
      vocals: false,
      bars: 4,
    },
    {
      id: crypto.randomUUID(),
      name: "Verse",
      beatId,
      bass: true,
      melody: false,
      backing: false,
      vocals: true,
      bars: 8,
    },
    {
      id: crypto.randomUUID(),
      name: "Chorus",
      beatId,
      bass: true,
      melody: true,
      backing: true,
      vocals: true,
      bars: 8,
    },
    {
      id: crypto.randomUUID(),
      name: "Outro",
      beatId,
      bass: true,
      melody: true,
      backing: true,
      vocals: false,
      bars: 4,
    },
  ];
}

export default function SongEditorPage() {
  const params = useParams();
  const songId = params.id as string;

  const supabase = createClient();

  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  const [verse1, setVerse1] = useState("");
  const [preChorus, setPreChorus] = useState("");
  const [chorus, setChorus] = useState("");
  const [verse2, setVerse2] = useState("");
  const [bridge, setBridge] = useState("");
  const [outro, setOutro] = useState("");

  const [patterns, setPatterns] = useState<BeatPattern[]>([]);
  const [selectedPatternId, setSelectedPatternId] =
    useState("");

  const [arrangement, setArrangement] =
    useState<ArrangementSection[]>([]);

  const [activeTab, setActiveTab] = useState<
    "lyrics" | "beats" | "arrangement" | "mixer"
  >("lyrics");

  const [bassBoost, setBassBoost] = useState(0);
  const [treble, setTreble] = useState(50);
  const [reverb, setReverb] = useState(20);
  const [delay, setDelay] = useState(10);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [playingBeat, setPlayingBeat] = useState(false);
  const [playingArrangement, setPlayingArrangement] =
    useState(false);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const masterGainRef =
    useRef<GainNode | null>(null);

  const filterRef =
    useRef<BiquadFilterNode | null>(null);

  const activeOscillatorsRef =
    useRef<OscillatorNode[]>([]);

  const playbackTimersRef =
    useRef<ReturnType<typeof setTimeout>[]>([]);

  const selectedPattern = useMemo(
    () =>
      patterns.find(
        (pattern) =>
          pattern.id === selectedPatternId
      ),
    [patterns, selectedPatternId]
  );

  const totalBars = useMemo(
    () =>
      arrangement.reduce(
        (total, section) =>
          total + section.bars,
        0
      ),
    [arrangement]
  );

  const estimatedDuration = useMemo(() => {
    const bpm =
      selectedPattern?.bpm ||
      song?.bpm ||
      90;

    const seconds =
      totalBars * 4 * (60 / bpm);

    const minutes = Math.floor(
      seconds / 60
    );

    const secondsLeft = Math.floor(
      seconds % 60
    );

    return `${minutes}:${secondsLeft
      .toString()
      .padStart(2, "0")}`;
  }, [
    totalBars,
    selectedPattern?.bpm,
    song?.bpm,
  ]);

  useEffect(() => {
    async function loadSong() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("songs")
        .select(`
          id,
          title,
          artist_name,
          genre,
          song_mood,
          song_key,
          bpm,
          description,
          verse_1,
          pre_chorus,
          chorus,
          verse_2,
          bridge,
          outro,
          is_public
        `)
        .eq("id", songId)
        .single();

      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }

      setSong(data);

      setVerse1(data.verse_1 || "");
      setPreChorus(data.pre_chorus || "");
      setChorus(data.chorus || "");
      setVerse2(data.verse_2 || "");
      setBridge(data.bridge || "");
      setOutro(data.outro || "");

      const firstBeat = createBeat(
        "Beat 1",
        data.bpm || 90
      );

      setPatterns([firstBeat]);
      setSelectedPatternId(firstBeat.id);

      setArrangement(
        createDefaultArrangement(
          firstBeat.id
        )
      );

      setLoading(false);
    }

    loadSong();

    return () => {
      playbackTimersRef.current.forEach(
        (timer) => clearTimeout(timer)
      );

      activeOscillatorsRef.current.forEach(
        (oscillator) => {
          try {
            oscillator.stop();
          } catch {}
        }
      );
    };
  }, [songId]);

  function getAudioContext() {
    if (!audioContextRef.current) {
      const context = new AudioContext();

      const masterGain =
        context.createGain();

      const filter =
        context.createBiquadFilter();

      filter.type = "highshelf";
      filter.frequency.value = 2500;
      filter.gain.value = 0;

      masterGain.gain.value = 0.7;

      filter.connect(masterGain);
      masterGain.connect(
        context.destination
      );

      audioContextRef.current =
        context;

      masterGainRef.current =
        masterGain;

      filterRef.current = filter;
    }

    return audioContextRef.current;
  }

  function updateAudioSettings() {
    if (!filterRef.current) return;

    filterRef.current.gain.value =
      (treble - 50) * 0.4;
  }

  useEffect(() => {
    updateAudioSettings();
  }, [treble]);

  function stopAllAudio() {
    playbackTimersRef.current.forEach(
      (timer) => clearTimeout(timer)
    );

    playbackTimersRef.current = [];

    activeOscillatorsRef.current.forEach(
      (oscillator) => {
        try {
          oscillator.stop();
        } catch {}
      }
    );

    activeOscillatorsRef.current = [];

    setPlayingBeat(false);
    setPlayingArrangement(false);
  }

  async function unlockAudio() {
    const context = getAudioContext();

    if (context.state === "suspended") {
      await context.resume();
    }

    updateAudioSettings();
  }

  function createTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    startDelay = 0
  ) {
    const context = getAudioContext();

    const oscillator =
      context.createOscillator();

    const gain =
      context.createGain();

    oscillator.type = type;
    oscillator.frequency.value =
      frequency;

    const bassMultiplier =
      1 + bassBoost / 100;

    const finalVolume =
      volume *
      (frequency < 200
        ? bassMultiplier
        : 1);

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime +
        startDelay
    );

    gain.gain.exponentialRampToValueAtTime(
      Math.max(finalVolume, 0.0001),
      context.currentTime +
        startDelay +
        0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime +
        startDelay +
        duration
    );

    oscillator.connect(gain);

    if (filterRef.current) {
      gain.connect(filterRef.current);
    } else {
      gain.connect(
        context.destination
      );
    }

    oscillator.start(
      context.currentTime +
        startDelay
    );

    oscillator.stop(
      context.currentTime +
        startDelay +
        duration +
        0.05
    );

    activeOscillatorsRef.current.push(
      oscillator
    );
  }

  function playKick() {
    createTone(
      65,
      0.18,
      "sine",
      0.5
    );
  }

  function playSnare() {
    createTone(
      180,
      0.08,
      "triangle",
      0.2
    );

    createTone(
      900,
      0.05,
      "square",
      0.04
    );
  }

  function playHiHat() {
    createTone(
      7000,
      0.035,
      "square",
      0.035
    );
  }

  function playBassNote() {
    createTone(
      55,
      0.5,
      "sawtooth",
      0.12
    );
  }

  function playMelodyNote(
    frequency: number
  ) {
    createTone(
      frequency,
      0.35,
      "triangle",
      0.1
    );
  }

  function playBackingChord() {
    const chord = [
      261.63,
      329.63,
      392,
    ];

    chord.forEach((frequency) =>
      createTone(
        frequency,
        1.4,
        "sine",
        0.025
      )
    );
  }

  function updateBeatStep(
    instrument:
      | "kick"
      | "snare"
      | "hihat",
    index: number
  ) {
    if (!selectedPattern) return;

    setPatterns((current) =>
      current.map((pattern) => {
        if (
          pattern.id !==
          selectedPattern.id
        ) {
          return pattern;
        }

        return {
          ...pattern,
          [instrument]: pattern[
            instrument
          ].map(
            (value, currentIndex) =>
              currentIndex === index
                ? !value
                : value
          ),
        };
      })
    );
  }

  async function playPattern(
    pattern: BeatPattern
  ) {
    await unlockAudio();

    stopAllAudio();

    setPlayingBeat(true);

    const stepDuration =
      (60 / pattern.bpm) / 4;

    for (
      let step = 0;
      step < STEP_COUNT;
      step++
    ) {
      const timer = setTimeout(() => {
        if (pattern.kick[step]) {
          playKick();
        }

        if (pattern.snare[step]) {
          playSnare();
        }

        if (pattern.hihat[step]) {
          playHiHat();
        }
      }, step * stepDuration * 1000);

      playbackTimersRef.current.push(
        timer
      );
    }

    const stopTimer = setTimeout(
      () => {
        setPlayingBeat(false);
      },
      stepDuration *
        STEP_COUNT *
        1000
    );

    playbackTimersRef.current.push(
      stopTimer
    );
  }

  function addBeat() {
    const newBeat = createBeat(
      `Beat ${patterns.length + 1}`,
      song?.bpm || 90
    );

    setPatterns((current) => [
      ...current,
      newBeat,
    ]);

    setSelectedPatternId(newBeat.id);
  }

  function duplicateBeat() {
    if (!selectedPattern) return;

    const copy: BeatPattern = {
      ...selectedPattern,
      id: crypto.randomUUID(),
      name: `${selectedPattern.name} Copy`,
      kick: [
        ...selectedPattern.kick,
      ],
      snare: [
        ...selectedPattern.snare,
      ],
      hihat: [
        ...selectedPattern.hihat,
      ],
    };

    setPatterns((current) => [
      ...current,
      copy,
    ]);

    setSelectedPatternId(copy.id);
  }

  function deleteBeat() {
    if (
      !selectedPattern ||
      patterns.length <= 1
    ) {
      return;
    }

    const remaining =
      patterns.filter(
        (pattern) =>
          pattern.id !==
          selectedPattern.id
      );

    setPatterns(remaining);

    setSelectedPatternId(
      remaining[0].id
    );

    setArrangement((current) =>
      current.map((section) =>
        section.beatId ===
        selectedPattern.id
          ? {
              ...section,
              beatId:
                remaining[0].id,
            }
          : section
      )
    );
  }

  function addArrangementSection(
    name: SectionName
  ) {
    const beatId =
      selectedPatternId ||
      patterns[0]?.id;

    if (!beatId) return;

    setArrangement((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        beatId,
        bass: name !== "Intro",
        melody: name === "Chorus",
        backing:
          name === "Intro" ||
          name === "Chorus" ||
          name === "Outro",
        vocals:
          name !== "Intro" &&
          name !== "Outro",
        bars:
          name === "Intro" ||
          name === "Outro"
            ? 4
            : 8,
      },
    ]);
  }

  function updateArrangement(
    id: string,
    changes: Partial<ArrangementSection>
  ) {
    setArrangement((current) =>
      current.map((section) =>
        section.id === id
          ? {
              ...section,
              ...changes,
            }
          : section
      )
    );
  }

  function removeArrangement(
    id: string
  ) {
    setArrangement((current) =>
      current.filter(
        (section) =>
          section.id !== id
      )
    );
  }

  function duplicateArrangement(
    id: string
  ) {
    setArrangement((current) => {
      const index =
        current.findIndex(
          (section) =>
            section.id === id
        );

      if (index === -1) {
        return current;
      }

      const original =
        current[index];

      const copy: ArrangementSection = {
        ...original,
        id: crypto.randomUUID(),
      };

      return [
        ...current.slice(
          0,
          index + 1
        ),
        copy,
        ...current.slice(index + 1),
      ];
    });
  }

  function moveArrangement(
    id: string,
    direction: "up" | "down"
  ) {
    setArrangement((current) => {
      const index =
        current.findIndex(
          (section) =>
            section.id === id
        );

      if (index === -1) {
        return current;
      }

      const newIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        newIndex < 0 ||
        newIndex >= current.length
      ) {
        return current;
      }

      const copy = [...current];

      const [item] =
        copy.splice(index, 1);

      copy.splice(
        newIndex,
        0,
        item
      );

      return copy;
    });
  }

  async function playArrangement() {
    if (
      arrangement.length === 0 ||
      playingArrangement
    ) {
      return;
    }

    await unlockAudio();

    stopAllAudio();

    setPlayingArrangement(true);

    let accumulatedTime = 0;

    arrangement.forEach((section) => {
      const pattern =
        patterns.find(
          (item) =>
            item.id ===
            section.beatId
        );

      if (!pattern) return;

      const bpm = pattern.bpm;

      const barDuration =
        (60 / bpm) * 4;

      const sectionDuration =
        barDuration *
        section.bars;

      const startTime =
        accumulatedTime;

      const sectionTimer =
        setTimeout(() => {
          playSectionAudio(
            section,
            pattern
          );
        }, startTime * 1000);

      playbackTimersRef.current.push(
        sectionTimer
      );

      accumulatedTime +=
        sectionDuration;
    });

    const endTimer = setTimeout(
      () => {
        setPlayingArrangement(false);
      },
      accumulatedTime * 1000
    );

    playbackTimersRef.current.push(
      endTimer
    );
  }

  function playSectionAudio(
    section: ArrangementSection,
    pattern: BeatPattern
  ) {
    const stepDuration =
      (60 / pattern.bpm) / 4;

    const sectionLength =
      section.bars * 16;

    for (
      let step = 0;
      step < sectionLength;
      step++
    ) {
      const patternStep =
        step % 16;

      const timer = setTimeout(
        () => {
          if (
            pattern.kick[
              patternStep
            ]
          ) {
            playKick();
          }

          if (
            pattern.snare[
              patternStep
            ]
          ) {
            playSnare();
          }

          if (
            pattern.hihat[
              patternStep
            ]
          ) {
            playHiHat();
          }

          if (
            section.bass &&
            patternStep % 4 === 0
          ) {
            playBassNote();
          }

          if (
            section.melody &&
            patternStep % 8 === 0
          ) {
            playMelodyNote(
              patternStep === 0
                ? 440
                : 523.25
            );
          }

          if (
            section.backing &&
            patternStep === 0
          ) {
            playBackingChord();
          }
        },
        step * stepDuration * 1000
      );

      playbackTimersRef.current.push(
        timer
      );
    }
  }

  async function saveSong() {
    if (!song) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("songs")
      .update({
        verse_1: verse1,
        pre_chorus: preChorus,
        chorus,
        verse_2: verse2,
        bridge,
        outro,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", song.id);

    setSaving(false);

    if (error) {
      console.error(error);
      setMessage(
        "Could not save the song."
      );
      return;
    }

    setMessage("Song saved.");
  }

  async function saveBeat() {
    if (!song || !selectedPattern) {
      return;
    }

    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("beats")
      .upsert(
        {
          song_id: song.id,
          user_id: user.id,
          kick: selectedPattern.kick,
          snare: selectedPattern.snare,
          hihat: selectedPattern.hihat,
          bpm: selectedPattern.bpm,
          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict: "song_id",
        }
      );

    setSaving(false);

    if (error) {
      console.error(error);
      setMessage(
        "Could not save the beat."
      );
      return;
    }

    setMessage("Beat saved.");
  }

  async function togglePublic() {
    if (!song) return;

    const nextValue =
      !song.is_public;

    const { error } = await supabase
      .from("songs")
      .update({
        is_public: nextValue,
      })
      .eq("id", song.id);

    if (error) {
      console.error(error);
      setMessage(
        "Could not update visibility."
      );
      return;
    }

    setSong({
      ...song,
      is_public: nextValue,
    });

    setMessage(
      nextValue
        ? "Song is public."
        : "Song is private."
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#151316] text-[#E8E1DA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl tracking-[0.35em]">
            ECHOES
          </div>

          <div className="mt-4 text-sm text-[#AAA1A0]">
            Opening your studio...
          </div>
        </div>
      </main>
    );
  }

  if (!song) {
    return (
      <main className="min-h-screen bg-[#151316] text-[#E8E1DA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl">
            Song not found
          </h1>

          <p className="text-[#AAA1A0] mt-2">
            This song may have been
            deleted.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#151316] text-[#E8E1DA] relative overflow-hidden">
      <div className="pointer-events-none absolute top-20 right-20 text-[#C56A3D]/20 text-6xl">
        ✦
      </div>

      <div className="pointer-events-none absolute bottom-20 left-20 text-[#9A4F55]/20 text-5xl">
        ♡
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#151316]/90 backdrop-blur-xl">
        <div className="max-w-[1500px] mx-auto px-6 py-4 flex items-center justify-between gap-5">
          <div>
            <div className="text-[10px] tracking-[0.4em] text-[#C56A3D]">
              ECHOES
            </div>

            <h1 className="text-xl md:text-2xl font-semibold">
              {song.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {message && (
              <span className="hidden md:block text-xs text-[#AAA1A0]">
                {message}
              </span>
            )}

            <button
              onClick={saveSong}
              disabled={saving}
              className="px-5 py-2.5 rounded-full bg-[#9A4F55] hover:bg-[#B35C63] transition disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save"}
            </button>

            <button
              onClick={togglePublic}
              className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition"
            >
              {song.is_public
                ? "Public"
                : "Private"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1500px] mx-auto px-5 md:px-6 py-7">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-2">
            <div className="lg:sticky lg:top-28 rounded-3xl border border-white/10 bg-[#211D20]/80 p-3">
              <div className="px-3 py-3 text-[10px] uppercase tracking-[0.3em] text-[#AAA1A0]">
                Studio
              </div>

              {[
                ["lyrics", "Lyrics", "✎"],
                ["beats", "Beat Maker", "♩"],
                [
                  "arrangement",
                  "Arrangement",
                  "▦",
                ],
                ["mixer", "Mixer", "◒"],
              ].map(
                ([id, label, icon]) => (
                  <button
                    key={id}
                    onClick={() =>
                      setActiveTab(
                        id as
                          | "lyrics"
                          | "beats"
                          | "arrangement"
                          | "mixer"
                      )
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition mb-1 ${
                      activeTab === id
                        ? "bg-[#9A4F55]/25 text-[#E8E1DA]"
                        : "text-[#AAA1A0] hover:bg-white/5"
                    }`}
                  >
                    <span className="text-lg">
                      {icon}
                    </span>

                    {label}
                  </button>
                )
              )}

              <div className="mt-5 pt-5 border-t border-white/10 px-4 pb-3">
                <div className="text-xs text-[#AAA1A0]">
                  Arrangement
                </div>

                <div className="text-2xl font-semibold mt-1">
                  {arrangement.length}
                </div>

                <div className="text-xs text-[#777]">
                  sections
                </div>

                <div className="text-xs text-[#AAA1A0] mt-4">
                  Estimated length
                </div>

                <div className="text-lg mt-1">
                  {estimatedDuration}
                </div>
              </div>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-7">
            {activeTab === "lyrics" && (
              <div className="rounded-3xl border border-white/10 bg-[#211D20]/80 p-6">
                <div className="mb-7">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#C56A3D]">
                    Writing Room
                  </div>

                  <h2 className="text-3xl mt-2">
                    Your story
                  </h2>

                  <p className="text-sm text-[#AAA1A0] mt-2">
                    Put the words down.
                    Shape them later.
                  </p>
                </div>

                {[
                  [
                    "Verse 1",
                    verse1,
                    setVerse1,
                  ],
                  [
                    "Pre-Chorus",
                    preChorus,
                    setPreChorus,
                  ],
                  [
                    "Chorus",
                    chorus,
                    setChorus,
                  ],
                  [
                    "Verse 2",
                    verse2,
                    setVerse2,
                  ],
                  [
                    "Bridge",
                    bridge,
                    setBridge,
                  ],
                  [
                    "Outro",
                    outro,
                    setOutro,
                  ],
                ].map(
                  ([label, value, setter]) => (
                    <div
                      key={label as string}
                      className="mb-6"
                    >
                      <label className="block text-sm text-[#AAA1A0] mb-2">
                        {label as string}
                      </label>

                      <textarea
                        value={value as string}
                        onChange={(event) =>
                          (
                            setter as (
                              value: string
                            ) => void
                          )(
                            event.target.value
                          )
                        }
                        placeholder={`Write your ${(
                          label as string
                        ).toLowerCase()}...`}
                        className="w-full min-h-[135px] resize-y rounded-2xl bg-[#151316] border border-white/10 p-4 outline-none focus:border-[#9A4F55] transition placeholder:text-[#555]"
                      />
                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === "beats" && (
              <div className="rounded-3xl border border-white/10 bg-[#211D20]/80 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[#C56A3D]">
                      Rhythm Lab
                    </div>

                    <h2 className="text-3xl mt-2">
                      Beat Maker
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={addBeat}
                      className="px-4 py-2.5 rounded-full bg-[#9A4F55]"
                    >
                      + New Beat
                    </button>

                    <button
                      onClick={duplicateBeat}
                      className="px-4 py-2.5 rounded-full border border-white/10"
                    >
                      Duplicate
                    </button>

                    <button
                      onClick={deleteBeat}
                      className="px-4 py-2.5 rounded-full border border-red-400/20 text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto mt-7 pb-2">
                  {patterns.map(
                    (pattern) => (
                      <button
                        key={pattern.id}
                        onClick={() =>
                          setSelectedPatternId(
                            pattern.id
                          )
                        }
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                          pattern.id ===
                          selectedPatternId
                            ? "bg-[#C56A3D]"
                            : "bg-white/5 text-[#AAA1A0]"
                        }`}
                      >
                        {pattern.name}
                      </button>
                    )
                  )}
                </div>

                {selectedPattern && (
                  <>
                    <div className="mt-7 rounded-2xl bg-[#151316] border border-white/10 p-5">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#AAA1A0]">
                          BPM
                        </span>

                        <input
                          type="range"
                          min="50"
                          max="180"
                          value={
                            selectedPattern.bpm
                          }
                          onChange={(
                            event
                          ) =>
                            setPatterns(
                              (current) =>
                                current.map(
                                  (pattern) =>
                                    pattern.id ===
                                    selectedPattern.id
                                      ? {
                                          ...pattern,
                                          bpm: Number(
                                            event
                                              .target
                                              .value
                                          ),
                                        }
                                      : pattern
                                )
                            )
                          }
                          className="flex-1"
                        />

                        <span className="font-semibold">
                          {
                            selectedPattern.bpm
                          }
                        </span>
                      </div>
                    </div>

                    {[
                      [
                        "kick",
                        "Kick",
                      ],
                      [
                        "snare",
                        "Snare",
                      ],
                      [
                        "hihat",
                        "Hi-Hat",
                      ],
                    ].map(
                      ([instrument, label]) => {
                        const values =
                          selectedPattern[
                            instrument as
                              | "kick"
                              | "snare"
                              | "hihat"
                          ];

                        return (
                          <div
                            key={instrument}
                            className="mt-6"
                          >
                            <div className="text-xs uppercase tracking-[0.2em] text-[#AAA1A0] mb-3">
                              {label}
                            </div>

                            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1">
                              {values.map(
                                (
                                  active,
                                  index
                                ) => (
                                  <button
                                    key={
                                      index
                                    }
                                    onClick={() =>
                                      updateBeatStep(
                                        instrument as
                                          | "kick"
                                          | "snare"
                                          | "hihat",
                                        index
                                      )
                                    }
                                    className={`h-10 rounded-lg transition ${
                                      active
                                        ? "bg-[#C56A3D]"
                                        : "bg-white/5 hover:bg-white/10"
                                    }`}
                                  >
                                    <span className="text-[9px] text-white/40">
                                      {index +
                                        1}
                                    </span>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      }
                    )}

                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={() =>
                          playingBeat
                            ? stopAllAudio()
                            : playPattern(
                                selectedPattern
                              )
                        }
                        className="px-5 py-3 rounded-full bg-[#9A4F55]"
                      >
                        {playingBeat
                          ? "■ Stop"
                          : "▶ Play Beat"}
                      </button>

                      <button
                        onClick={saveBeat}
                        disabled={saving}
                        className="px-5 py-3 rounded-full border border-white/10"
                      >
                        {saving
                          ? "Saving..."
                          : "Save Beat"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "arrangement" && (
              <div className="rounded-3xl border border-white/10 bg-[#211D20]/80 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[#C56A3D]">
                      Song Timeline
                    </div>

                    <h2 className="text-3xl mt-2">
                      Build the song
                    </h2>

                    <p className="text-sm text-[#AAA1A0] mt-2">
                      Arrange your sections
                      and layer your sound.
                    </p>
                  </div>

                  <button
                    onClick={
                      playingArrangement
                        ? stopAllAudio
                        : playArrangement
                    }
                    className="px-5 py-3 rounded-full bg-[#9A4F55]"
                  >
                    {playingArrangement
                      ? "■ Stop"
                      : "▶ Play Full Song"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-7">
                  {SECTION_NAMES.map(
                    (name) => (
                      <button
                        key={name}
                        onClick={() =>
                          addArrangementSection(
                            name
                          )
                        }
                        className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-sm"
                      >
                        + {name}
                      </button>
                    )
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  {arrangement.map(
                    (section, index) => {
                      const pattern =
                        patterns.find(
                          (item) =>
                            item.id ===
                            section.beatId
                        );

                      return (
                        <div
                          key={section.id}
                          className="rounded-2xl border border-white/10 bg-[#151316] p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#9A4F55]/20 text-[#C56A3D] flex items-center justify-center">
                              {index + 1}
                            </div>

                            <div className="flex-1">
                              <select
                                value={
                                  section.name
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateArrangement(
                                    section.id,
                                    {
                                      name: event
                                        .target
                                        .value as SectionName,
                                    }
                                  )
                                }
                                className="bg-transparent outline-none text-lg"
                              >
                                {SECTION_NAMES.map(
                                  (
                                    name
                                  ) => (
                                    <option
                                      key={
                                        name
                                      }
                                      value={
                                        name
                                      }
                                      className="bg-[#211D20]"
                                    >
                                      {
                                        name
                                      }
                                    </option>
                                  )
                                )}
                              </select>

                              <div className="text-xs text-[#777] mt-1">
                                {pattern?.name ||
                                  "Beat"}{" "}
                                •{" "}
                                {
                                  section.bars
                                }{" "}
                                bars
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  moveArrangement(
                                    section.id,
                                    "up"
                                  )
                                }
                                className="p-2 rounded-lg hover:bg-white/5"
                              >
                                ↑
                              </button>

                              <button
                                onClick={() =>
                                  moveArrangement(
                                    section.id,
                                    "down"
                                  )
                                }
                                className="p-2 rounded-lg hover:bg-white/5"
                              >
                                ↓
                              </button>

                              <button
                                onClick={() =>
                                  duplicateArrangement(
                                    section.id
                                  )
                                }
                                className="p-2 rounded-lg hover:bg-white/5"
                              >
                                ⧉
                              </button>

                              <button
                                onClick={() =>
                                  removeArrangement(
                                    section.id
                                  )
                                }
                                className="p-2 rounded-lg text-red-300 hover:bg-red-500/10"
                              >
                                ×
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                            {[
                              [
                                "bass",
                                "Bass",
                              ],
                              [
                                "melody",
                                "Melody",
                              ],
                              [
                                "backing",
                                "Backing",
                              ],
                              [
                                "vocals",
                                "Vocals",
                              ],
                            ].map(
                              ([key, label]) => {
                                const enabled =
                                  Boolean(
                                    section[
                                      key as keyof ArrangementSection
                                    ]
                                  );

                                return (
                                  <button
                                    key={key}
                                    onClick={() =>
                                      updateArrangement(
                                        section.id,
                                        {
                                          [key]:
                                            !enabled,
                                        }
                                      )
                                    }
                                    className={`px-3 py-2 rounded-xl text-xs transition ${
                                      enabled
                                        ? "bg-[#9A4F55]/30"
                                        : "bg-white/5 text-[#666]"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                );
                              }
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                              <label className="block text-xs text-[#777] mb-1">
                                Beat
                              </label>

                              <select
                                value={
                                  section.beatId
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateArrangement(
                                    section.id,
                                    {
                                      beatId:
                                        event
                                          .target
                                          .value,
                                    }
                                  )
                                }
                                className="w-full bg-[#211D20] border border-white/10 rounded-xl px-3 py-2 text-sm"
                              >
                                {patterns.map(
                                  (
                                    pattern
                                  ) => (
                                    <option
                                      key={
                                        pattern.id
                                      }
                                      value={
                                        pattern.id
                                      }
                                    >
                                      {
                                        pattern.name
                                      }
                                    </option>
                                  )
                                )}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-[#777] mb-1">
                                Bars
                              </label>

                              <input
                                type="number"
                                min="1"
                                max="32"
                                value={
                                  section.bars
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateArrangement(
                                    section.id,
                                    {
                                      bars: Math.min(
                                        32,
                                        Math.max(
                                          1,
                                          Number(
                                            event
                                              .target
                                              .value
                                          )
                                        )
                                      ),
                                    }
                                  )
                                }
                                className="w-full bg-[#211D20] border border-white/10 rounded-xl px-3 py-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  {arrangement.length ===
                    0 && (
                    <div className="border border-dashed border-white/10 rounded-3xl py-14 text-center">
                      <div className="text-5xl text-[#C56A3D]/60">
                        ♫
                      </div>

                      <p className="mt-4 text-[#AAA1A0]">
                        Your timeline is
                        empty.
                      </p>

                      <p className="text-xs text-[#666] mt-1">
                        Add sections above
                        to start arranging
                        your song.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "mixer" && (
              <div className="rounded-3xl border border-white/10 bg-[#211D20]/80 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#C56A3D]">
                  Sound Design
                </div>

                <h2 className="text-3xl mt-2">
                  Mixer
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  {[
                    [
                      "Bass Boost",
                      bassBoost,
                      setBassBoost,
                    ],
                    [
                      "Treble",
                      treble,
                      setTreble,
                    ],
                    [
                      "Reverb",
                      reverb,
                      setReverb,
                    ],
                    [
                      "Delay",
                      delay,
                      setDelay,
                    ],
                  ].map(
                    ([label, value, setter]) => (
                      <div
                        key={label as string}
                        className="rounded-2xl bg-[#151316] border border-white/10 p-5"
                      >
                        <div className="flex justify-between text-sm">
                          <span>
                            {label as string}
                          </span>

                          <span className="text-[#AAA1A0]">
                            {value as number}%
                          </span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={
                            value as number
                          }
                          onChange={(event) =>
                            (
                              setter as (
                                value: number
                              ) => void
                            )(
                              Number(
                                event.target
                                  .value
                              )
                            )
                          }
                          className="w-full mt-5"
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="mt-8 p-5 rounded-2xl border border-white/10">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#777]">
                    Signal Chain
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      "Beat",
                      "Bass",
                      "Melody",
                      "Backing",
                      "Vocals",
                      "Reverb",
                      "Delay",
                    ].map(
                      (item) => (
                        <span
                          key={item}
                          className="px-4 py-2 rounded-full bg-[#9A4F55]/15 text-sm"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-28 space-y-5">
              <div className="rounded-3xl border border-white/10 bg-[#211D20]/80 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#AAA1A0]">
                  Song
                </div>

                <h3 className="text-2xl mt-2">
                  {song.title}
                </h3>

                {song.artist_name && (
                  <p className="text-[#AAA1A0] mt-1">
                    {song.artist_name}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-[#151316] rounded-2xl p-4">
                    <div className="text-xs text-[#777]">
                      BPM
                    </div>

                    <div className="text-xl mt-1">
                      {song.bpm || 90}
                    </div>
                  </div>

                  <div className="bg-[#151316] rounded-2xl p-4">
                    <div className="text-xs text-[#777]">
                      Key
                    </div>

                    <div className="text-xl mt-1">
                      {song.song_key ||
                        "C Major"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#211D20]/80 p-6">
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-[#C56A3D]/20" />

                <div className="absolute right-5 bottom-4 text-4xl text-[#9A4F55]/20">
                  ✦
                </div>

                <div className="text-[10px] uppercase tracking-[0.3em] text-[#C56A3D]">
                  ECHOES
                </div>

                <p className="text-lg leading-relaxed mt-5">
                  Your sound doesn't have
                  to sound like anyone
                  else's.
                </p>

                <p className="text-xs text-[#777] mt-4">
                  Write it. Shape it.
                  Hear it.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#211D20]/80 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#777]">
                  Studio Stats
                </div>

                <div className="space-y-4 mt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#AAA1A0]">
                      Beats
                    </span>

                    <span>
                      {patterns.length}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#AAA1A0]">
                      Sections
                    </span>

                    <span>
                      {arrangement.length}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#AAA1A0]">
                      Length
                    </span>

                    <span>
                      {estimatedDuration}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#AAA1A0]">
                      Visibility
                    </span>

                    <span>
                      {song.is_public
                        ? "Public"
                        : "Private"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}