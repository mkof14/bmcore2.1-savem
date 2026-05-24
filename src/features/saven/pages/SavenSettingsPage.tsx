import { ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import {
  BellRing,
  Bot,
  CheckCircle2,
  ChevronDown,
  HeartPulse,
  Home,
  LockKeyhole,
  Mic,
  Moon,
  PauseCircle,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  StopCircle,
  Volume2,
  Watch,
  Activity,
  Clock3,
  UsersRound,
  Waypoints,
} from 'lucide-react';

type Tone = 'blue' | 'gold' | 'green';

function StatusPill({ label, tone }: { label: string; tone: Tone }) {
  const color =
    tone === 'green'
      ? 'border border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-300/30 dark:bg-slate-950/75 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25'
      : tone === 'gold'
        ? 'border border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-300/30 dark:bg-slate-950/75 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25'
        : 'border border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-300/30 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25';

  return <span className={'rounded-full px-4 py-2 font-semibold shadow-sm ' + color}>{label}</span>;
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
    </section>
  );
}

function LayeredPanel({ title, text, items }: { title: string; text: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/78 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/58">
      <h4 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20">{item}</span>
        ))}
      </div>
    </article>
  );
}

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex?: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

type VoiceCommandLog = {
  time: string;
  source: string;
  command: string;
  status: string;
  response: string;
};



function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2 last:border-b-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function SelectLike({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <span className="relative mt-2 block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-900 shadow-sm outline-none transition-all hover:border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-300/10"
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  );
}

function SettingSlider({ label, low, high, value, tone, onChange }: { label: string; low: string; high: string; value: number | string | boolean; tone: Tone; onChange: (value: number) => void }) {
  const numericValue = typeof value === 'number' ? value : Number(value) || 0;
  const bar =
    tone === 'green'
      ? 'accent-emerald-500'
      : tone === 'gold'
        ? 'accent-amber-500'
        : 'accent-blue-500';

  return (
    <div className="rounded-3xl border border-white/70 bg-white/78 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/58">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{label}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{low} to {high}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-100 dark:ring-1 dark:ring-white/10">{numericValue}%</span>
      </div>
      <input className={'mt-4 w-full ' + bar} type="range" min="0" max="100" value={numericValue} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

function SettingToggle({ label, text, icon: Icon, enabled, onToggle }: { label: string; text: string; icon: ComponentType<{ className?: string }>; enabled: unknown; onToggle: () => void }) {
  const isEnabled = Boolean(enabled);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={(isEnabled ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/25 dark:bg-emerald-500/10 dark:text-emerald-100' : 'border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-950/58 dark:text-slate-200') + ' group rounded-3xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl'}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 transition-transform group-hover:scale-105 dark:bg-slate-950/70">
          <Icon className="h-4 w-4" />
        </span>
        <span className="rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70">{isEnabled ? 'On' : 'Off'}</span>
      </div>
      <p className="mt-4 text-sm font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-6 opacity-80">{text}</p>
    </button>
  );
}

function MicLevelBar({ level, active, error, onToggle }: { level: number; active: boolean; error: string; onToggle: () => void }) {
  const bars = Array.from({ length: 28 }, (_, index) => {
    const threshold = ((index + 1) / 28) * 100;
    const lit = active && level >= threshold;
    const color = index > 22 ? 'bg-red-500' : index > 16 ? 'bg-amber-400' : 'bg-emerald-400';
    return <span key={index} className={(lit ? color : 'bg-slate-800 dark:bg-slate-900') + ' h-5 flex-1 rounded-sm transition-all'} />;
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/82 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/65">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <button type="button" onClick={onToggle} className={(active ? 'bg-red-600 text-white shadow-lg shadow-red-950/25' : 'bg-slate-950 text-white dark:bg-white dark:text-slate-950') + ' rounded-full px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5'}>
          {active ? 'Mic on' : 'Mic'}
        </button>
        <div className="flex min-h-7 flex-1 items-end gap-1 rounded-2xl bg-slate-950 p-2 ring-1 ring-white/10">{bars}</div>
        <span className="w-16 rounded-full bg-slate-950 px-3 py-1 text-center text-sm font-semibold text-white">{level}%</span>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}
    </div>
  );
}

export function SavenSettings() {
  const [settings, setSettings] = useState({
    supportMode: 'Recovery support',
    reminderTone: 'Calm and direct',
    confirmationMode: 'Caregiver + device',
    escalationMode: 'Family first',
    primaryLanguage: 'English',
    activeEnvironment: 'Home Recovery',
    cognitiveLoad: 34,
    reminderIntensity: 42,
    robotComfort: 24,
    deviceAutomation: 68,
    privacyLevel: 82,
    recoveryFocus: 76,
    voiceVolume: 62,
    voiceSpeed: 50,
    voiceSensitivity: 66,
    voiceControl: true,
    wakePhrase: 'Hey SAVEN',
    voicePersona: 'Warm neutral',
    voiceConfirmations: true,
    voiceReminders: true,
    voiceNightMode: true,
    voiceCaregiverOverride: true,
    caregiverFirst: true,
    quietHours: true,
    largeText: true,
    reducedMotion: true,
    familyDigest: true,
    deviceTelemetry: true,
    robotReadiness: true,
    robotPhysicalAction: false,
    autoEscalation: true,
    biometricSharing: false,
    exportTimeline: true,
    emergencyOnlyNight: true,
  });
  const [microphoneOpen, setMicrophoneOpen] = useState(false);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioPeak, setAudioPeak] = useState(0);
  const [activeVoiceCommand, setActiveVoiceCommand] = useState('morning');
  const [typedVoiceCommand, setTypedVoiceCommand] = useState('');
  const [typedVoiceResponse, setTypedVoiceResponse] = useState('');
  const [micError, setMicError] = useState('');
  const [manualCommand, setManualCommand] = useState('Hey SAVEN, start morning support.');
  const [interimSpeech, setInterimSpeech] = useState('');
  const [commandLog, setCommandLog] = useState<VoiceCommandLog[]>([
    {
      time: 'Ready',
      source: 'System',
      command: 'Voice and text command layer is armed.',
      status: 'Standing by',
      response: 'Choose a service, send a text command, or open the microphone.',
    },
  ]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const responseTimerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  function updateSetting<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  const voiceCommands = [
    { id: 'morning', service: 'Daily support', label: 'Morning support', command: 'Hey SAVEN, start morning support.', response: 'Good morning Anna. I will guide the first recovery step, keep reminders gentle, and ask Maya to confirm the mobility check.' },
    { id: 'hydration', service: 'Health routine', label: 'Hydration check', command: 'Hey SAVEN, check hydration and remind me softly.', response: 'Hydration check is active. I will use a calm prompt first, then ask the wearable for confirmation.' },
    { id: 'caregiver', service: 'Caregiver flow', label: 'Caregiver handoff', command: 'Hey SAVEN, send this task to the caregiver.', response: 'I will assign the task to Maya, keep the family digest calm, and wait for verified confirmation.' },
    { id: 'verification', service: 'Verification', label: 'Confirm action', command: 'Hey SAVEN, confirm that the walking session is complete.', response: 'I will mark the walking session as performed and wait for caregiver verification before updating continuity.' },
    { id: 'robot', service: 'Robotics', label: 'Robot readiness', command: 'Hey SAVEN, can the robot help with this action?', response: 'Robot readiness is visible, but physical action remains locked until human approval is given.' },
    { id: 'device', service: 'Devices', label: 'Device status', command: 'Hey SAVEN, check the wearable and home sensors.', response: 'The wearable is online. I will use device telemetry only for confirmation, not independent care decisions.' },
    { id: 'privacy', service: 'Privacy', label: 'Privacy mode', command: 'Hey SAVEN, restrict biometric sharing.', response: 'Biometric context is restricted. Family will receive support status without sensitive body data.' },
    { id: 'night', service: 'Night support', label: 'Night mode', command: 'Hey SAVEN, switch to night emergency-only mode.', response: 'Night voice mode is active. I will stay quiet unless the action is urgent or safety-related.' },
  ];

  const activeVoice = voiceCommands.find((item) => item.id === activeVoiceCommand) || voiceCommands[0];

  const typeSavenResponse = (response: string) => {
    if (responseTimerRef.current) window.clearInterval(responseTimerRef.current);
    setTypedVoiceResponse('');
    let index = 0;
    responseTimerRef.current = window.setInterval(() => {
      index += 1;
      setTypedVoiceResponse(response.slice(0, index));
      if (index >= response.length && responseTimerRef.current) {
        window.clearInterval(responseTimerRef.current);
        responseTimerRef.current = null;
      }
    }, 18);
  };

  useEffect(() => {
    setTypedVoiceCommand('');
    setManualCommand(activeVoice.command);
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedVoiceCommand(activeVoice.command.slice(0, index));
      if (index >= activeVoice.command.length) window.clearInterval(timer);
    }, 26);
    return () => window.clearInterval(timer);
  }, [activeVoice.command]);

  useEffect(() => {
    typeSavenResponse(activeVoice.response);
    return () => {
      if (responseTimerRef.current) window.clearInterval(responseTimerRef.current);
    };
  }, [activeVoice.response]);

  const addCommandLog = (command: string, source: string, response = activeVoice.response, status = 'Understood') => {
    const cleanCommand = command.trim();
    if (!cleanCommand) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCommandLog((current) => [
      { time, source, command: cleanCommand, status, response },
      ...current,
    ].slice(0, 6));
  };

  const runTextCommand = () => {
    addCommandLog(manualCommand, 'Type a command', activeVoice.response, 'Queued');
    typeSavenResponse(activeVoice.response);
  };

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setInterimSpeech('');
  };

  const startSpeechRecognition = () => {
    const SpeechRecognitionClass = (window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructorLike;
      webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
    }).SpeechRecognition || (window as unknown as {
      webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
    }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      addCommandLog('Mic is on. Speech-to-text is not available in this browser.', 'Mic', 'The sound bar is live. Use the text command input for command capture.', 'Mic live');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = settings.primaryLanguage === 'Russian' ? 'ru-RU' : 'en-US';
    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      const startIndex = event.resultIndex ?? 0;
      for (let index = startIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript || '';
        if (result.isFinal) finalText += transcript;
        else interimText += transcript;
      }
      setInterimSpeech(interimText.trim());
      if (finalText.trim()) {
        setManualCommand(finalText.trim());
        addCommandLog(finalText.trim(), 'Microphone', activeVoice.response, 'Recognized');
        typeSavenResponse(activeVoice.response);
      }
    };
    recognition.onerror = (event) => {
      setMicError(event.error ? 'Speech recognition: ' + event.error : 'Speech recognition stopped.');
    };
    recognition.onend = () => {
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopMicrophone = () => {
    if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    stopSpeechRecognition();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    analyserRef.current = null;
    setMicrophoneOpen(false);
    setAudioLevel(0);
  };

  useEffect(() => () => stopMicrophone(), []);

  const startMicrophone = async () => {
    setMicError('');
    if (microphoneOpen) {
      stopMicrophone();
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicError('Microphone is not available in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        setMicError('Audio engine is not available in this browser.');
        return;
      }
      const context = new AudioContextClass();
      const sourceNode = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.72;
      sourceNode.connect(analyser);
      streamRef.current = stream;
      audioContextRef.current = context;
      analyserRef.current = analyser;
      setMicrophoneOpen(true);
      addCommandLog('Mic is on for SAVEN command input.', 'Mic', 'Speak a command or use the text command field.', 'Listening');
      startSpeechRecognition();

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const voiceBand = data.slice(4, 84);
        const average = voiceBand.reduce((sum, value) => sum + value, 0) / voiceBand.length;
        const peak = Math.max(...voiceBand);
        const weighted = Math.round(((average * 0.72 + peak * 0.28) / 170) * 100 * (settings.voiceSensitivity / 66));
        const normalized = Math.max(0, Math.min(100, weighted));
        setAudioLevel(normalized);
        setAudioPeak((current) => Math.max(normalized, Math.round(current * 0.91)));
        animationRef.current = window.requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      setMicError(error instanceof Error ? error.message : 'Microphone permission was not granted.');
      stopMicrophone();
    }
  };

  const speakVoicePreview = (text = activeVoice.response) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    addCommandLog(activeVoice.command, 'Voice test', text, 'Speaking');
    typeSavenResponse(text);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = Math.max(0.05, settings.voiceVolume / 100);
    utterance.rate = Math.max(0.82, Math.min(1.16, 0.9 + (settings.voiceSpeed - 50) / 220));
    utterance.pitch = settings.voicePersona === 'Very gentle' ? 0.94 : settings.voicePersona === 'Short and direct' ? 1.03 : 1;
    utterance.onstart = () => setVoiceSpeaking(true);
    utterance.onend = () => setVoiceSpeaking(false);
    utterance.onerror = () => setVoiceSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopVoicePreview = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setVoiceSpeaking(false);
  };

  const regulatorRows = [
    { key: 'cognitiveLoad', label: 'Cognitive load', low: 'Simple', high: 'Detailed', tone: 'blue' },
    { key: 'reminderIntensity', label: 'Reminder intensity', low: 'Gentle', high: 'Persistent', tone: 'gold' },
    { key: 'robotComfort', label: 'Robot comfort', low: 'Cautious', high: 'Open', tone: 'green' },
    { key: 'deviceAutomation', label: 'Device automation', low: 'Manual', high: 'Automatic', tone: 'blue' },
    { key: 'privacyLevel', label: 'Privacy protection', low: 'Open', high: 'Strict', tone: 'green' },
    { key: 'recoveryFocus', label: 'Recovery emphasis', low: 'Light', high: 'Focused', tone: 'gold' },
  ] as const;

  const toggleRows = [
    { key: 'caregiverFirst', label: 'Caregiver-first execution', text: 'Assign human helpers before devices or robots.', icon: UsersRound },
    { key: 'quietHours', label: 'Quiet hours protection', text: 'Suppress non-critical prompts during rest windows.', icon: Clock3 },
    { key: 'largeText', label: 'Large interface mode', text: 'Increase readability for recovery and senior use.', icon: Activity },
    { key: 'reducedMotion', label: 'Reduced motion', text: 'Keep transitions calm and avoid unnecessary animation.', icon: ShieldCheck },
    { key: 'familyDigest', label: 'Family daily digest', text: 'Send one calm summary instead of constant updates.', icon: UsersRound },
    { key: 'deviceTelemetry', label: 'Device telemetry', text: 'Allow wearable and home sensor confirmation signals.', icon: Watch },
    { key: 'robotReadiness', label: 'Robot readiness visible', text: 'Show robots as readiness and capability only.', icon: Bot },
    { key: 'robotPhysicalAction', label: 'Robot physical action', text: 'Permit physical robot execution after approval.', icon: Bot },
    { key: 'autoEscalation', label: 'Automatic escalation', text: 'Escalate unresolved support tasks through the chain.', icon: Waypoints },
    { key: 'biometricSharing', label: 'Biometric sharing', text: 'Share biometric context outside the primary circle.', icon: LockKeyhole },
    { key: 'exportTimeline', label: 'Timeline export', text: 'Allow verified action history export for review.', icon: ShieldCheck },
    { key: 'emergencyOnlyNight', label: 'Night emergency-only mode', text: 'At night, only urgent tasks can interrupt.', icon: Clock3 },
  ] as const;

  const systemRules = [
    { label: 'Active profile', value: settings.supportMode },
    { label: 'Primary environment', value: settings.activeEnvironment },
    { label: 'Confirmation logic', value: settings.confirmationMode },
    { label: 'Escalation chain', value: settings.escalationMode },
    { label: 'Night behavior', value: settings.emergencyOnlyNight ? 'Emergency only' : 'Standard reminders' },
    { label: 'Robot execution', value: settings.robotPhysicalAction ? 'Approval enabled' : 'Readiness only' },
    { label: 'Voice control', value: settings.voiceControl ? settings.wakePhrase : 'Disabled' },
    { label: 'Voice behavior', value: settings.voiceNightMode ? 'Quiet at night' : 'Standard voice' },
  ];

  const scheduleRows = [
    { time: '07:30', action: 'Morning orientation', owner: 'SAVEN voice', mode: settings.voiceReminders ? settings.voicePersona : settings.reminderTone },
    { time: '10:00', action: 'Hydration and mobility check', owner: 'Wearable tracker', mode: settings.deviceTelemetry ? 'Telemetry assisted' : 'Manual confirmation' },
    { time: '14:30', action: 'Recovery pacing review', owner: 'Caregiver', mode: settings.caregiverFirst ? 'Human first' : 'System first' },
    { time: '21:00', action: 'Evening continuity summary', owner: 'Family digest', mode: settings.quietHours ? 'Quiet delivery' : 'Normal delivery' },
  ];

  const voiceServices = [
    { label: 'Daily support', value: settings.voiceReminders ? 'Voice prompts active' : 'Visual only', active: settings.voiceReminders },
    { label: 'Verification', value: settings.voiceConfirmations ? 'Voice confirmation allowed' : 'Manual confirmation', active: settings.voiceConfirmations },
    { label: 'Caregiver flow', value: settings.voiceCaregiverOverride ? 'Remote pause allowed' : 'Local control only', active: settings.voiceCaregiverOverride },
    { label: 'Robotics', value: settings.robotPhysicalAction ? 'Approval voice check' : 'Readiness narration only', active: settings.robotReadiness },
    { label: 'Night support', value: settings.voiceNightMode ? 'Emergency-only voice' : 'Standard voice', active: settings.voiceNightMode },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Settings" title="Adapt SAVEN to the person." text="Control how SAVEN behaves around one person: reminders, cognitive load, escalation, devices, robots, privacy, recovery emphasis, and verified execution rules." />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Person Operating Profile</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Daily support behavior</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">These settings define how SAVEN should act before it creates tasks, assigns responsibility, or asks people to confirm reality.</p>
            </div>
            <StatusPill tone="green" label="System ready" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SelectLike label="Support mode" value={settings.supportMode} options={['Daily support', 'Recovery support', 'Senior recovery', 'Rehabilitation', 'Family monitoring']} onChange={(value) => updateSetting('supportMode', value)} />
            <SelectLike label="Reminder tone" value={settings.reminderTone} options={['Gentle', 'Calm and direct', 'Minimal', 'Voice-first', 'Caregiver-first']} onChange={(value) => updateSetting('reminderTone', value)} />
            <SelectLike label="Confirmation mode" value={settings.confirmationMode} options={['User only', 'Caregiver only', 'Caregiver + device', 'Device telemetry', 'Robot telemetry + human']} onChange={(value) => updateSetting('confirmationMode', value)} />
            <SelectLike label="Escalation mode" value={settings.escalationMode} options={['No escalation', 'Family first', 'Caregiver first', 'Environment admin', 'Clinical support']} onChange={(value) => updateSetting('escalationMode', value)} />
            <SelectLike label="Primary language" value={settings.primaryLanguage} options={['English', 'Russian', 'Spanish', 'Ukrainian', 'German']} onChange={(value) => updateSetting('primaryLanguage', value)} />
            <SelectLike label="Active environment" value={settings.activeEnvironment} options={['Home Recovery', 'Senior Living', 'Rehab Center', 'Hospital Discharge', 'Family Home']} onChange={(value) => updateSetting('activeEnvironment', value)} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">System Output</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Generated rules</h3>
          <div className="mt-5 space-y-2">
            {systemRules.map((rule) => (
              <div key={rule.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-2xl border border-slate-100 bg-[#f7f5f1] px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900">
                <span className="text-slate-500 dark:text-slate-400">{rule.label}</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">{rule.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Voice Control</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Speak with SAVEN</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Tune mic, tone, and command behavior.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <StatusPill tone={settings.voiceControl ? 'green' : 'gold'} label={settings.voiceControl ? 'Voice active' : 'Voice paused'} />
            <button onClick={startMicrophone} className={(microphoneOpen ? 'bg-red-600 text-white shadow-lg shadow-red-950/35 ring-red-300/35' : 'bg-slate-950 text-white ring-slate-300/20 hover:bg-slate-800 dark:bg-white dark:text-slate-950') + ' rounded-full px-5 py-2.5 text-sm font-semibold ring-1 transition-all hover:-translate-y-0.5'}>
              <span className={(microphoneOpen ? 'bg-white animate-pulse dark:bg-white' : 'bg-slate-400') + ' mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle'} />
              {microphoneOpen ? 'Mic on' : 'Mic'}
            </button>
          </div>
        </div>

        <div className="mt-4 max-w-2xl">
          <MicLevelBar level={audioLevel} active={microphoneOpen} error={micError} onToggle={startMicrophone} />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900">
              <div className="flex flex-wrap gap-2">
                {voiceCommands.map((item) => (
                  <button key={item.id} onClick={() => setActiveVoiceCommand(item.id)} className={(item.id === activeVoiceCommand ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/25 ring-blue-300/30' : 'bg-white text-slate-700 ring-slate-200 hover:bg-blue-50 dark:bg-slate-950 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-slate-800') + ' max-w-full rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all hover:-translate-y-0.5'}>
                    <span className="block max-w-[180px] truncate">{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Command</p>
                <p className="mt-3 min-h-[56px] overflow-hidden break-words text-base font-semibold leading-7 text-slate-950 dark:text-blue-100">
                  {typedVoiceCommand}<span className="animate-pulse text-blue-500 dark:text-blue-300">|</span>
                </p>
              </div>
            </div>

            <label className="block rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Type a command</span>
              <textarea value={manualCommand} onChange={(event) => setManualCommand(event.target.value)} rows={3} className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/20 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-300/60" />
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={runTextCommand} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-950/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-400">
                  Send
                </button>
                <button type="button" onClick={() => speakVoicePreview()} disabled={!settings.voiceControl} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
                  Play response
                </button>
                <button type="button" onClick={stopVoicePreview} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-slate-800">
                  Stop
                </button>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <div className={(voiceSpeaking ? 'ring-blue-300/40 shadow-blue-950/20' : 'ring-slate-100 dark:ring-white/10') + ' min-h-[236px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 transition-all dark:border-white/10 dark:bg-slate-900'}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">SAVEN reply</p>
                <span className={(voiceSpeaking ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400') + ' rounded-full px-3 py-1 text-xs font-semibold'}>{voiceSpeaking ? 'Speaking' : 'Ready'}</span>
              </div>
              <p className="mt-4 max-h-[144px] overflow-y-auto break-words text-base font-semibold leading-7 text-slate-950 dark:text-white">
                {typedVoiceResponse}<span className="animate-pulse text-blue-500 dark:text-blue-300">|</span>
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Recent commands</p>
                <span className={(interimSpeech ? 'text-amber-600 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400') + ' text-xs font-semibold'}>{interimSpeech ? 'Listening...' : 'Recent'}</span>
              </div>
              {interimSpeech && (
                <div className="mb-3 rounded-2xl border border-amber-300/30 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
                  {interimSpeech}<span className="animate-pulse text-amber-500 dark:text-amber-200">|</span>
                </div>
              )}
              <div className="space-y-2">
                {commandLog.slice(0, 3).map((entry, index) => (
                  <div key={entry.time + '-' + entry.command + '-' + index} className="rounded-2xl border border-slate-100 bg-white px-4 py-3 transition-all hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:bg-slate-950 dark:hover:border-blue-300/40">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 dark:bg-blue-500/15 dark:text-blue-100">{entry.source}</span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100">{entry.status}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 break-words text-sm font-semibold text-slate-950 dark:text-white">{entry.command}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SelectLike label="Wake phrase" value={settings.wakePhrase} options={['Hey SAVEN', 'SAVEN help', 'Support please', 'Anna support', 'No wake phrase']} onChange={(value) => updateSetting('wakePhrase', value)} />
          <SelectLike label="Voice style" value={settings.voicePersona} options={['Warm neutral', 'Very gentle', 'Short and direct', 'Caregiver tone', 'Clinical calm']} onChange={(value) => updateSetting('voicePersona', value)} />
          <SettingSlider label="Mic sensitivity" low="Strict" high="Sensitive" value={settings.voiceSensitivity} tone="green" onChange={(value) => updateSetting('voiceSensitivity', value)} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Voice coverage</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Commands across SAVEN</h3>
          </div>
          <StatusPill tone="blue" label="Voice layer" />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {voiceCommands.map((item) => (
            <button key={item.id} onClick={() => setActiveVoiceCommand(item.id)} className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-300/30">
              <span className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-slate-950 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">{item.service}</span>
              <p className="font-semibold text-slate-950 dark:text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.command}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {voiceServices.map((service) => (
            <div key={service.label} className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-300/30">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate font-semibold text-slate-950 dark:text-white">{service.label}</p>
                <span className={(service.active ? 'bg-emerald-500' : 'bg-slate-500') + ' h-2.5 w-2.5 shrink-0 rounded-full'} />
              </div>
              <p className="line-clamp-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">{service.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Regulators</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Tune the support engine</h3>
          </div>
          <StatusPill tone="blue" label="Live configuration" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {regulatorRows.map((row) => (
            <SettingSlider key={row.key} label={row.label} low={row.low} high={row.high} value={settings[row.key]} tone={row.tone} onChange={(value) => updateSetting(row.key, value)} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Permissions and switches</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Control what SAVEN is allowed to do</h3>
          </div>
          <StatusPill tone="gold" label="Human approval layer" />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {toggleRows.map((row) => (
            <SettingToggle key={row.key} label={row.label} text={row.text} icon={row.icon} enabled={settings[row.key]} onToggle={() => updateSetting(row.key, !settings[row.key])} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.76),rgba(255,247,237,0.74))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.26),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(249,115,22,0.18),transparent_30%),linear-gradient(135deg,rgba(6,14,28,0.96),rgba(15,23,42,0.86),rgba(35,24,10,0.66))] dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Robot Connection Center</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Connect robots as permissioned SAVEN endpoints.</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Robots connect through readiness, capability, environment rules, device telemetry, human approval, and verification. SAVEN keeps physical action visible and controlled.</p>
          </div>
          <StatusPill tone={settings.robotReadiness ? 'green' : 'gold'} label={settings.robotReadiness ? 'Robot layer visible' : 'Robot layer paused'} />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: 'Humanoid assistant', status: settings.robotReadiness ? 'Readiness visible' : 'Hidden', detail: 'Can receive approved support tasks and return telemetry.', icon: Bot, tone: 'blue' },
              { label: 'Mobility robot', status: settings.robotPhysicalAction ? 'Approval enabled' : 'Readiness only', detail: 'Physical support remains locked until approval is explicit.', icon: Bot, tone: 'gold' },
              { label: 'Wearable bridge', status: settings.deviceTelemetry ? 'Telemetry connected' : 'Manual only', detail: 'Wearable signals can support confirmation but cannot act alone.', icon: Watch, tone: 'green' },
              { label: 'Home environment', status: settings.activeEnvironment, detail: 'Room rules define where robots can move, wait, charge, and assist.', icon: Home, tone: 'blue' },
            ].map((item) => {
              const Icon = item.icon;
              const tone = item.tone === 'green' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-500/10' : item.tone === 'gold' ? 'border-amber-200 bg-amber-50 dark:border-amber-300/20 dark:bg-amber-500/10' : 'border-blue-200 bg-blue-50 dark:border-blue-300/20 dark:bg-blue-500/10';
              return (
                <article key={item.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/78 shadow-sm ring-1 ring-white/70 dark:bg-slate-950/70 dark:ring-white/10">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">{item.label}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{item.status}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
                </article>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/70 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Connection pipeline</p>
            <div className="mt-5 space-y-3">
              {[
                ['Register robot', 'Model, location, owner, capabilities'],
                ['Map permissions', 'Allowed rooms, allowed task types, human override'],
                ['Bind devices', 'Wearable, room sensors, bed, charging station'],
                ['Approval gate', 'Human confirms before physical action'],
                ['Verify result', 'Telemetry and person/caregiver confirmation'],
              ].map(([label, text], index) => (
                <div key={label} className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500 text-xs font-semibold text-white">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SettingToggle label="Robot readiness visible" text="Show robots as available support endpoints." icon={Bot} enabled={settings.robotReadiness} onToggle={() => updateSetting('robotReadiness', !settings.robotReadiness)} />
          <SettingToggle label="Robot physical action" text="Permit physical execution only after approval." icon={Bot} enabled={settings.robotPhysicalAction} onToggle={() => updateSetting('robotPhysicalAction', !settings.robotPhysicalAction)} />
          <SettingToggle label="Device telemetry bridge" text="Use devices to verify robot-supported actions." icon={Watch} enabled={settings.deviceTelemetry} onToggle={() => updateSetting('deviceTelemetry', !settings.deviceTelemetry)} />
          <SettingToggle label="Caregiver override" text="Allow caregiver pause, stop, and reassignment." icon={ShieldCheck} enabled={settings.voiceCaregiverOverride} onToggle={() => updateSetting('voiceCaregiverOverride', !settings.voiceCaregiverOverride)} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950 dark:ring-1 dark:ring-white/10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Daily rule schedule</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">How the settings become actions</h3>
          <div className="mt-6 space-y-3">
            {scheduleRows.map((row) => (
              <div key={row.time} className="grid gap-3 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900 md:grid-cols-[80px_minmax(0,1fr)_180px] md:items-center">
                <span className="rounded-full bg-white px-3 py-1 text-center text-sm font-semibold text-slate-600 shadow-sm dark:bg-slate-950 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{row.time}</span>
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{row.action}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Owner: {row.owner}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-center text-xs font-semibold text-blue-700 dark:bg-slate-950 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">{row.mode}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-sm dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Configuration Summary</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">SAVEN will act calmly, visibly, and with permission.</h3>
          <div className="mt-6 grid gap-3">
            <SummaryLine label="Automation" value={settings.deviceAutomation > 60 ? 'Device-assisted' : 'Mostly manual'} />
            <SummaryLine label="Robot policy" value={settings.robotPhysicalAction ? 'Approval required' : 'Readiness only'} />
            <SummaryLine label="Cognitive load" value={settings.cognitiveLoad < 45 ? 'Reduced' : 'Detailed'} />
            <SummaryLine label="Escalation" value={settings.autoEscalation ? settings.escalationMode : 'Manual only'} />
          </div>
          <div className="mt-6 rounded-3xl bg-slate-900 p-4 text-sm leading-6 text-slate-300 ring-1 ring-white/10">
            Current settings are local UI state for development. The next backend phase can persist them as SAVEN profile rules, environment permissions, and verification policies.
          </div>
        </div>
      </section>
    </div>
  );
}
