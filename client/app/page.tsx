"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

// ─── Icons (inline SVG components for zero dependency) ───────────────────────
const Icon = ({
  d,
  size = 20,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.5,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d) ? (
      d.map((path, i) => <path key={i} d={path} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const Icons = {
  camera:
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  play: "M5 3l14 9-14 9V3z",
  stop: "M6 6h12v12H6z",
  wifi: [
    "M5 12.55a11 11 0 0 1 14.08 0",
    "M1.42 9a16 16 0 0 1 21.16 0",
    "M8.53 16.11a6 6 0 0 1 6.95 0",
    "M12 20h.01",
  ],
  wifiOff: [
    "M1 1l22 22",
    "M16.72 11.06A10.94 10.94 0 0 1 19 12.55",
    "M5 12.55a10.94 10.94 0 0 1 5.17-2.39",
    "M10.71 5.05A16 16 0 0 1 22.56 9",
    "M1.42 9a15.91 15.91 0 0 1 4.7-2.88",
    "M8.53 16.11a6 6 0 0 1 6.95 0",
    "M12 20h.01",
  ],
  mic: [
    "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z",
    "M19 10v2a7 7 0 0 1-14 0v-2",
    "M12 19v4",
    "M8 23h8",
  ],
  micOff: [
    "M1 1l22 22",
    "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6",
    "M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23",
    "M12 19v4",
    "M8 23h8",
  ],
  download: [
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M7 10l5 5 5-5",
    "M12 15V3",
  ],
  upload: [
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M17 8l-5-5-5 5",
    "M12 3v12",
  ],
  settings: [
    "M12 20h9",
    "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  ],
  maximize: [
    "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
  ],
  minimize:
    "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  cpu: [
    "M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z",
    "M9 9h6v6H9z",
    "M9 1v3",
    "M15 1v3",
    "M9 20v3",
    "M15 20v3",
    "M20 9h3",
    "M20 14h3",
    "M1 9h3",
    "M1 14h3",
  ],
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  cloud: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  crown: "M12 2l3 7h5l-4 5 2 7-6-4-6 4 2-7-4-5h5z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  gem: ["M12 2L2 7l10 13L22 7z", "M2 7h20", "M12 2l5 5H7z"],
  layers: ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  video: [
    "M23 7l-7 5 7 5V7z",
    "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  ],
  rotate:
    "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  timer: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  eye: [
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
    "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  ],
  chart: ["M18 20V10", "M12 20V4", "M6 20v-6"],
  lock: [
    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z",
    "M7 11V7a5 5 0 0 1 10 0v4",
  ],
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  folder: [
    "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  ],
  sparkles: [
    "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z",
    "M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75z",
    "M19 1l.75 2.25L22 4l-2.25.75L19 7l-.75-2.25L16 4l2.25-.75z",
  ],
};

const Ico = ({ name, size = 20, className = "" }) => {
  const d = Icons[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {Array.isArray(d) ? (
        d.map((path, i) => <path key={i} d={path} />)
      ) : (
        <path d={d} />
      )}
    </svg>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const BACKGROUNDS = [
  {
    id: "blur",
    label: "Cinematic Blur",
    tag: "FREE",
    color: "#2D3A4A",
    accent: "#60A5FA",
  },
  {
    id: "office",
    label: "Executive Suite",
    tag: "FREE",
    color: "#1E2A1E",
    accent: "#34D399",
  },
  {
    id: "studio",
    label: "Broadcast Stage",
    tag: "PRO",
    color: "#1A1025",
    accent: "#A78BFA",
  },
  {
    id: "luxury",
    label: "Penthouse",
    tag: "PRO",
    color: "#2A1A0A",
    accent: "#F59E0B",
  },
  {
    id: "nature",
    label: "Forest Studio",
    tag: "FREE",
    color: "#0A1F0A",
    accent: "#6EE7B7",
  },
  {
    id: "urban",
    label: "City Skyline",
    tag: "PRO",
    color: "#0D0D1A",
    accent: "#818CF8",
  },
  {
    id: "cosmic",
    label: "Deep Space",
    tag: "PRO",
    color: "#0A0A1E",
    accent: "#C084FC",
  },
  {
    id: "beach",
    label: "Oceanfront",
    tag: "FREE",
    color: "#051520",
    accent: "#38BDF8",
  },
  {
    id: "gradient",
    label: "Neon Gradient",
    tag: "PRO",
    color: "#1A0A1A",
    accent: "#F472B6",
  },
  {
    id: "abstract",
    label: "Abstract Mesh",
    tag: "PRO",
    color: "#0A0F1A",
    accent: "#FB923C",
  },
  {
    id: "space",
    label: "Retro Future",
    tag: "PRO",
    color: "#050A0A",
    accent: "#2DD4BF",
  },
  {
    id: "custom",
    label: "Custom Upload",
    tag: "PRO",
    color: "#111111",
    accent: "#94A3B8",
  },
];

const PLANS = [
  {
    id: "free",
    name: "Creator",
    price: 0,
    period: "forever",
    desc: "Start creating today",
    features: [
      "HD 1080p output",
      "4 free environments",
      "30 FPS processing",
      "Community support",
    ],
    cta: "Get Started Free",
    gradient: "linear-gradient(135deg, #374151, #1F2937)",
    ring: "#4B5563",
  },
  {
    id: "pro",
    name: "Professional",
    price: 249,
    period: "month",
    desc: "For serious creators",
    features: [
      "4K Ultra HD output",
      "All 12 environments",
      "60 FPS processing",
      "Custom backgrounds",
      "AI enhancement",
      "Priority queue",
      "Recording & export",
    ],
    cta: "Start Pro Trial",
    gradient: "linear-gradient(135deg, #4F46E5, #7C3AED, #DB2777)",
    ring: "#7C3AED",
    badge: "MOST POPULAR",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 999,
    period: "month",
    desc: "For studios & teams",
    features: [
      "8K cinematic output",
      "Custom AI models",
      "120 FPS ultra-smooth",
      "White-label access",
      "API integration",
      "Dedicated support",
      "Team workspaces",
      "Analytics dashboard",
    ],
    cta: "Contact Sales",
    gradient: "linear-gradient(135deg, #B45309, #D97706, #F59E0B)",
    ring: "#D97706",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VirtualStagePro() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const wsRef = useRef(null);
  const animFrameRef = useRef(null);
  const fpsRef = useRef({ last: 0, count: 0 });
  const processingRef = useRef(false);
  const recordTimerRef = useRef(null);

  const [streaming, setStreaming] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [quality, setQuality] = useState("HD");
  const [bgType, setBgType] = useState("blur");
  const [edgeSmooth, setEdgeSmooth] = useState(82);
  const [processQuality, setProcessQuality] = useState("high");
  const [audioOn, setAudioOn] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [cpu, setCpu] = useState(0);
  const [mem, setMem] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [frames, setFrames] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [plan, setPlan] = useState("free");
  const [showPlans, setShowPlans] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [activeTab, setActiveTab] = useState("environments");
  const [serverLoad, setServerLoad] = useState(0);
  const [reconnects, setReconnects] = useState(0);
  const [blurAmount, setBlurAmount] = useState(15);

  // Sim metrics
  useEffect(() => {
    const t = setInterval(() => {
      setCpu(22 + Math.random() * 28);
      setMem(30 + Math.random() * 38);
      setServerLoad(15 + Math.random() * 28);
      setUptime(Date.now() - sessionStart);
    }, 2000);
    return () => clearInterval(t);
  }, [sessionStart]);

  const log = useCallback((msg, type = "info") => {
    const icons = { info: "›", error: "✕", success: "✓", warning: "!" };
    const now = new Date().toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((p) => [
      ...p.slice(-9),
      { msg, type, time: now, icon: icons[type] },
    ]);
  }, []);

  const requirePro = useCallback(
    (feature) => {
      if (plan === "free") {
        setUpgradeFeature(feature);
        setShowUpgrade(true);
        return true;
      }
      return false;
    },
    [plan],
  );

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    setConnecting(true);
    log("Connecting to VirtualStage engine...");

    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => {
      setConnected(true);
      setConnecting(false);
      setReconnects(0);
      log("Engine online — ready to stream", "success");
    };
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.type === "processed_frame" && canvasRef.current && d.data) {
          const img = new Image();
          img.onload = () => {
            const cv = canvasRef.current;
            const ctx = cv?.getContext("2d");
            if (ctx && cv) {
              cv.width = img.width;
              cv.height = img.height;
              ctx.drawImage(img, 0, 0);
            }
            processingRef.current = false;
            setFrames((p) => p + 1);
            if (d.timestamp) setLatency(Date.now() - d.timestamp);
          };
          img.src = `data:image/jpeg;base64,${d.data}`;
        } else if (d.type === "error") log(d.message, "error");
      } catch {}
    };
    ws.onclose = () => {
      setConnected(false);
      setConnecting(false);
      log("Engine disconnected", "warning");
    };
    ws.onerror = () => {
      setConnected(false);
      setConnecting(false);
      log("Connection failed — is backend running?", "error");
    };
    wsRef.current = ws;
  }, [log]);

  const sendFrame = useCallback(() => {
    if (
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN ||
      !videoRef.current ||
      processingRef.current
    )
      return;
    const v = videoRef.current;
    if (v.readyState !== 4) return;
    try {
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(v, 0, 0);
      const q =
        processQuality === "high"
          ? 0.92
          : processQuality === "medium"
            ? 0.78
            : 0.62;
      const data = c.toDataURL("image/jpeg", q).split(",")[1];
      processingRef.current = true;
      wsRef.current.send(
        JSON.stringify({
          type: "frame",
          data,
          timestamp: Date.now(),
          settings: {
            background: bgType,
            quality: processQuality,
            edgeSmoothing: edgeSmooth,
          },
        }),
      );
    } catch {
      processingRef.current = false;
    }
  }, [bgType, processQuality, edgeSmooth]);

  const loop = useCallback(() => {
    if (streaming && connected) {
      sendFrame();
      const now = performance.now();
      fpsRef.current.count++;
      if (now - fpsRef.current.last >= 1000) {
        setFps(
          Math.round(
            (fpsRef.current.count * 1000) / (now - fpsRef.current.last),
          ),
        );
        fpsRef.current.last = now;
        fpsRef.current.count = 0;
      }
    }
    if (streaming) animFrameRef.current = requestAnimationFrame(loop);
  }, [streaming, connected, sendFrame]);

  useEffect(() => {
    if (streaming && connected) loop();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [streaming, connected, loop]);

  const startStream = useCallback(async () => {
    try {
      log("Initializing camera stream...");
      const w = quality === "4K" ? 3840 : quality === "HD" ? 1920 : 1280;
      const h = quality === "4K" ? 2160 : quality === "HD" ? 1080 : 720;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: w, height: h, facingMode: "user", frameRate: 30 },
        audio: audioOn,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
        setFrames(0);
        fpsRef.current = { last: performance.now(), count: 0 };
        connect();
        log(`${quality} stream active`, "success");
      }
    } catch (e) {
      log(`Camera failed: ${e}`, "error");
    }
  }, [quality, audioOn, connect, log]);

  const stopStream = useCallback(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (wsRef.current) wsRef.current.close();
    const cv = canvasRef.current;
    if (cv) {
      const ctx = cv.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, cv.width, cv.height);
    }
    processingRef.current = false;
    setStreaming(false);
    setFps(0);
    setLatency(0);
    if (recording) {
      setRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
    log("Session ended", "success");
  }, [recording, log]);

  useEffect(
    () => () => {
      stopStream();
    },
    [],
  );

  const changeBg = useCallback(
    (id) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "change_background",
            background: id,
            settings: { quality: processQuality, edgeSmoothing: edgeSmooth },
          }),
        );
        log(`Environment → ${id}`, "info");
      }
    },
    [processQuality, edgeSmooth, log],
  );

  const selectBg = useCallback(
    (bg) => {
      const isPro = bg.tag === "PRO";
      if (isPro && plan === "free") {
        requirePro(bg.label);
        return;
      }
      if (bg.id === "custom") {
        fileInputRef.current?.click();
        return;
      }
      setBgType(bg.id);
      changeBg(bg.id);
    },
    [plan, requirePro, changeBg],
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    log("Uploading custom environment...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("http://localhost:8000/upload-background", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const d = await res.json();
        setBgType(d.background_id);
        changeBg(d.background_id);
        log("Custom environment loaded", "success");
      } else log("Upload failed", "error");
    } catch (e) {
      log(`Upload error: ${e}`, "error");
    }
  };

  const exportFrame = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = `virtualstage-${Date.now()}.png`;
    a.href = canvasRef.current.toDataURL("image/png", 1.0);
    a.click();
    log("Frame exported", "success");
  };

  const startRec = useCallback(() => {
    if (requirePro("Recording")) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "start_recording",
          recording_id: `rec_${Date.now()}`,
          fps: 30,
        }),
      );
      setRecording(true);
      setRecTime(0);
      recordTimerRef.current = setInterval(
        () => setRecTime((p) => p + 1),
        1000,
      );
      log("Recording started", "success");
    }
  }, [requirePro, log]);

  const stopRec = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify({ type: "stop_recording" }));
    setRecording(false);
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    log("Recording saved", "success");
    setTimeout(async () => {
      try {
        const r = await fetch("http://localhost:8000/recordings/list");
        if (r.ok) setRecordings((await r.json()).recordings || []);
      } catch {}
    }, 800);
  }, [log]);

  const fmtTime = (ms) => {
    const s = Math.floor(ms / 1000),
      m = Math.floor(s / 60),
      h = Math.floor(m / 60);
    return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };
  const fmtRec = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const fmtSize = (b) => {
    if (!b) return "—";
    const i = Math.floor(Math.log(b) / Math.log(1024));
    return (b / Math.pow(1024, i)).toFixed(1) + ["B", "KB", "MB", "GB"][i];
  };

  const currentBg = BACKGROUNDS.find((b) => b.id === bgType) || BACKGROUNDS[0];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080A0E;
          --surface: #0D1117;
          --surface2: #141922;
          --surface3: #1C2432;
          --border: rgba(255,255,255,0.06);
          --border2: rgba(255,255,255,0.1);
          --text: #F1F5F9;
          --muted: #64748B;
          --accent: #6366F1;
          --accent2: #8B5CF6;
          --green: #10B981;
          --red: #F43F5E;
          --amber: #F59E0B;
          --cyan: #06B6D4;
          --font-display: 'Syne', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --radius: 16px;
          --radius-sm: 10px;
          --glow: 0 0 40px rgba(99,102,241,0.15);
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

        .app {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Noise overlay ── */
        .app::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Ambient glow ── */
        .ambient {
          position: fixed; pointer-events: none; z-index: 0;
        }
        .ambient-1 {
          top: -20%; left: 15%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          filter: blur(40px);
        }
        .ambient-2 {
          bottom: -10%; right: 10%;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
          filter: blur(40px);
        }

        /* ── Header ── */
        .header {
          position: relative; z-index: 10;
          padding: 18px 32px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border);
          background: rgba(8,10,14,0.8);
          backdrop-filter: blur(24px);
        }

        .logo {
          display: flex; align-items: center; gap: 14px;
        }

        .logo-mark {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          box-shadow: 0 0 24px rgba(99,102,241,0.4);
        }

        .logo-text {
          display: flex; flex-direction: column; gap: 1px;
        }

        .logo-name {
          font-family: var(--font-display);
          font-size: 20px; font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #E2E8F0, #94A3B8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-sub {
          font-family: var(--font-mono);
          font-size: 10px; font-weight: 400; color: var(--muted);
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        .header-right {
          display: flex; align-items: center; gap: 12px;
        }

        .status-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 14px;
          border-radius: 100px;
          font-size: 12px; font-weight: 500;
          border: 1px solid;
          font-family: var(--font-mono);
          transition: all 0.3s;
        }

        .status-dot {
          width: 7px; height: 7px; border-radius: 50%;
        }

        .status-online { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: #34D399; }
        .status-offline { background: rgba(244,63,94,0.1); border-color: rgba(244,63,94,0.3); color: #FB7185; }
        .status-connecting { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); color: #FCD34D; }

        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .ping { animation: ping 1.2s infinite; }
        @keyframes ping { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2);opacity:0} }

        .plan-badge {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 16px;
          border-radius: 100px;
          font-size: 12px; font-weight: 600;
          font-family: var(--font-mono);
          background: linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.2));
          border: 1px solid rgba(139,92,246,0.3);
          color: #A78BFA;
          cursor: pointer;
          transition: all 0.2s;
        }
        .plan-badge:hover { background: linear-gradient(135deg, rgba(79,70,229,0.35), rgba(124,58,237,0.35)); }

        .metric-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          white-space: nowrap;
        }

        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          font-size: 13px; font-weight: 600;
          cursor: pointer; border: none; outline: none;
          transition: all 0.2s; position: relative; overflow: hidden;
          font-family: var(--font-body);
          text-decoration: none;
        }

        .btn:active { transform: scale(0.97); }

        .btn-ghost {
          background: var(--surface2); color: var(--muted); border: 1px solid var(--border);
        }
        .btn-ghost:hover { background: var(--surface3); color: var(--text); border-color: var(--border2); }

        .btn-icon {
          width: 38px; height: 38px; padding: 0;
          background: var(--surface2); border: 1px solid var(--border);
          color: var(--muted); border-radius: var(--radius-sm);
        }
        .btn-icon:hover { background: var(--surface3); color: var(--text); }

        .btn-primary {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: white;
          box-shadow: 0 4px 24px rgba(99,102,241,0.3);
        }
        .btn-primary:hover { box-shadow: 0 6px 32px rgba(99,102,241,0.5); transform: translateY(-1px); }

        .btn-danger {
          background: linear-gradient(135deg, #E11D48, #F43F5E);
          color: white;
          box-shadow: 0 4px 20px rgba(244,63,94,0.3);
        }
        .btn-danger:hover { box-shadow: 0 6px 28px rgba(244,63,94,0.5); }

        .btn-green {
          background: linear-gradient(135deg, #059669, #10B981);
          color: white;
          box-shadow: 0 4px 20px rgba(16,185,129,0.25);
        }
        .btn-green:hover { box-shadow: 0 6px 28px rgba(16,185,129,0.4); }

        .btn-amber {
          background: linear-gradient(135deg, #D97706, #F59E0B);
          color: white;
          box-shadow: 0 4px 20px rgba(245,158,11,0.25);
        }

        /* ── Layout ── */
        .workspace {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 20px;
          padding: 20px 28px 24px;
          flex: 1;
          min-height: 0;
          max-height: calc(100vh - 80px);
        }

        /* ── Studio panel ── */
        .studio-panel {
          display: flex; flex-direction: column; gap: 16px;
        }

        .canvas-wrap {
          flex: 1;
          background: #020408;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          border: 1px solid var(--border);
          min-height: 0;
        }

        .canvas-inner {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          min-height: 400px;
        }

        .canvas-header {
          position: absolute; top: 0; left: 0; right: 0; z-index: 5;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          background: linear-gradient(180deg, rgba(2,4,8,0.95) 0%, transparent 100%);
        }

        .canvas-title {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display);
          font-size: 13px; font-weight: 600;
          color: var(--muted);
          letter-spacing: 0.05em; text-transform: uppercase;
        }

        .live-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 10px;
          background: rgba(244,63,94,0.15);
          border: 1px solid rgba(244,63,94,0.4);
          border-radius: 100px;
          font-family: var(--font-mono);
          font-size: 10px; font-weight: 500; color: #FB7185;
          letter-spacing: 0.1em;
        }

        video { display: none; }

        canvas {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        .canvas-idle {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 24px;
        }

        .idle-icon {
          width: 96px; height: 96px;
          background: var(--surface2);
          border: 1px solid var(--border2);
          border-radius: 28px;
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
        }

        .idle-title {
          font-family: var(--font-display);
          font-size: 28px; font-weight: 700;
          color: var(--text);
          text-align: center;
        }

        .idle-sub {
          font-size: 14px; color: var(--muted);
          text-align: center; max-width: 300px; line-height: 1.6;
        }

        .conn-notice {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 20px;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: var(--radius-sm);
          font-size: 13px; color: #34D399;
        }

        /* ── HUD overlays ── */
        .hud-overlay {
          position: absolute;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .canvas-wrap:hover .hud-overlay { opacity: 1; }

        .hud-tl { top: 56px; left: 14px; }
        .hud-tr { top: 56px; right: 14px; }

        .hud-card {
          background: rgba(8,10,14,0.88);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border2);
          border-radius: 12px;
          padding: 12px 14px;
          min-width: 160px;
        }

        .hud-row {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .hud-label { color: var(--muted); }
        .hud-val { font-weight: 500; }

        /* ── Canvas footer ── */
        .canvas-footer {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 5;
          padding: 12px 18px;
          display: flex; align-items: center; justify-content: space-between;
          background: linear-gradient(0deg, rgba(2,4,8,0.9) 0%, transparent 100%);
        }

        .env-tag {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px; color: var(--muted);
          letter-spacing: 0.06em;
        }

        .env-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }

        /* ── Controls bar ── */
        .controls-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          flex-wrap: wrap;
        }

        .controls-left { display: flex; align-items: center; gap: 10px; flex: 1; }
        .controls-right { display: flex; align-items: center; gap: 8px; }

        .quality-select {
          background: var(--surface2);
          border: 1px solid var(--border2);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 8px 12px;
          outline: none;
          cursor: pointer;
        }

        .rec-indicator {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px;
          background: rgba(244,63,94,0.1);
          border: 1px solid rgba(244,63,94,0.3);
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 12px; color: #FB7185;
          animation: recPulse 2s infinite;
        }
        @keyframes recPulse { 0%,100%{border-color:rgba(244,63,94,0.3)} 50%{border-color:rgba(244,63,94,0.7)} }

        /* ── Right panel ── */
        .right-panel {
          display: flex; flex-direction: column; gap: 12px;
          overflow-y: auto;
          max-height: calc(100vh - 110px);
          padding-right: 2px;
          scrollbar-width: thin;
          scrollbar-color: var(--surface3) transparent;
        }

        .right-panel::-webkit-scrollbar { width: 4px; }
        .right-panel::-webkit-scrollbar-track { background: transparent; }
        .right-panel::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 4px; }

        /* ── Panel card ── */
        .panel-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .panel-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
        }

        .panel-title {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display);
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.03em; text-transform: uppercase;
          color: var(--muted);
        }

        .panel-count {
          font-family: var(--font-mono);
          font-size: 10px; color: var(--muted);
          background: var(--surface2);
          padding: 2px 8px; border-radius: 100px;
        }

        .panel-body { padding: 14px; }

        /* ── Tabs ── */
        .tabs {
          display: flex; gap: 4px;
          padding: 4px;
          background: var(--surface2);
          border-radius: 10px;
          margin-bottom: 14px;
        }

        .tab {
          flex: 1;
          padding: 7px 10px;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          font-family: var(--font-display);
          border-radius: 7px;
          border: none; cursor: pointer;
          transition: all 0.2s;
          background: transparent; color: var(--muted);
        }

        .tab.active {
          background: var(--surface3);
          color: var(--text);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        /* ── Environment grid ── */
        .env-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
        }

        .env-card {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all 0.2s;
        }

        .env-card:hover { transform: translateY(-2px); border-color: var(--border2); }
        .env-card.active { border-color: currentColor; }
        .env-card.locked { cursor: not-allowed; }

        .env-bg {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }

        .env-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--c1, #1a1a2e), var(--c2, #16213e));
        }

        .env-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 8px 8px 7px;
          background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%);
        }

        .env-label {
          font-size: 9px; font-weight: 600;
          font-family: var(--font-display);
          text-transform: uppercase; letter-spacing: 0.06em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .env-badge {
          position: absolute; top: 6px; right: 6px;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 8px; font-weight: 500;
        }

        .badge-free { background: rgba(16,185,129,0.2); color: #34D399; border: 1px solid rgba(16,185,129,0.3); }
        .badge-pro { background: rgba(139,92,246,0.2); color: #A78BFA; border: 1px solid rgba(139,92,246,0.3); }

        .env-lock {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(8,10,14,0.65);
          backdrop-filter: blur(2px);
        }

        .env-active-ring {
          position: absolute; inset: -1px;
          border-radius: 11px;
          pointer-events: none;
        }

        /* ── Slider ── */
        .slider-row {
          margin-bottom: 14px;
        }

        .slider-label {
          display: flex; justify-content: space-between;
          font-size: 11px; margin-bottom: 8px;
          font-family: var(--font-mono);
        }

        .slider-name { color: var(--muted); }
        .slider-val { color: var(--text); font-weight: 500; }

        input[type="range"] {
          width: 100%; height: 4px;
          background: var(--surface3);
          border-radius: 4px;
          outline: none; cursor: pointer;
          -webkit-appearance: none;
          accent-color: var(--accent);
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(99,102,241,0.6);
        }

        /* ── Quality buttons ── */
        .quality-btns {
          display: flex; gap: 6px; margin-bottom: 14px;
        }

        .q-btn {
          flex: 1; padding: 8px 0;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 8px; color: var(--muted);
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 4px;
        }

        .q-btn.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); color: #818CF8; }
        .q-btn:hover:not(.active) { background: var(--surface3); color: var(--text); }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .stat-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px;
        }

        .stat-label {
          font-size: 10px; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.08em;
          font-family: var(--font-mono);
          margin-bottom: 6px;
        }

        .stat-val {
          font-family: var(--font-mono);
          font-size: 22px; font-weight: 300;
          line-height: 1;
        }

        .stat-bar {
          height: 2px; background: var(--surface3);
          border-radius: 2px; margin-top: 8px; overflow: hidden;
        }

        .stat-fill { height: 100%; border-radius: 2px; transition: width 1s; }

        /* ── Server card ── */
        .server-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px;
          margin-top: 8px;
        }

        .server-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 5px 0;
          font-size: 12px;
          border-bottom: 1px solid var(--border);
        }

        .server-row:last-child { border-bottom: none; }
        .server-key { color: var(--muted); font-family: var(--font-mono); }
        .server-val { font-family: var(--font-mono); font-weight: 500; font-size: 11px; }

        /* ── Logs ── */
        .log-list {
          display: flex; flex-direction: column; gap: 4px;
          max-height: 180px; overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: var(--surface3) transparent;
        }

        .log-item {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 7px 10px;
          background: var(--surface2);
          border-radius: 7px;
          font-family: var(--font-mono); font-size: 10px;
          line-height: 1.4;
        }

        .log-icon { font-size: 10px; margin-top: 1px; flex-shrink: 0; }
        .log-info .log-icon { color: var(--muted); }
        .log-success .log-icon { color: var(--green); }
        .log-error .log-icon { color: var(--red); }
        .log-warning .log-icon { color: var(--amber); }

        .log-time { color: var(--muted); flex-shrink: 0; }
        .log-msg { color: var(--text); opacity: 0.8; }

        .log-empty {
          text-align: center; padding: 28px 0;
          color: var(--muted); font-size: 12px;
        }

        /* ── Recordings ── */
        .rec-list {
          display: flex; flex-direction: column; gap: 6px;
          max-height: 200px; overflow-y: auto;
        }

        .rec-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 9px;
        }

        .rec-name { font-family: var(--font-mono); font-size: 11px; color: var(--text); }
        .rec-meta { font-size: 10px; color: var(--muted); margin-top: 2px; }
        .rec-actions { display: flex; gap: 4px; }

        /* ── Pricing overlay ── */
        .overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(2,4,8,0.88);
          backdrop-filter: blur(20px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }

        .modal {
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: 24px;
          overflow: hidden;
          width: 100%; max-width: 860px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), var(--glow);
        }

        .modal-head {
          padding: 28px 32px 24px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: flex-start; justify-content: space-between;
        }

        .modal-title {
          font-family: var(--font-display);
          font-size: 30px; font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, var(--text), var(--muted));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modal-sub { font-size: 14px; color: var(--muted); margin-top: 6px; }

        .plan-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 24px 28px;
        }

        .plan-card {
          border-radius: 16px;
          border: 1.5px solid var(--border);
          overflow: hidden;
          position: relative;
          transition: transform 0.2s, border-color 0.2s;
        }

        .plan-card:hover { transform: translateY(-3px); }
        .plan-card.popular { border-color: rgba(124,58,237,0.5); }

        .popular-ribbon {
          position: absolute; top: 0; left: 0; right: 0;
          padding: 6px 0;
          text-align: center;
          font-family: var(--font-mono);
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          background: linear-gradient(90deg, #4F46E5, #7C3AED);
          text-transform: uppercase;
        }

        .plan-header {
          padding: 20px 20px 16px;
          background: var(--surface2);
          margin-top: 28px;
        }

        .plan-header.no-ribbon { margin-top: 0; }

        .plan-name {
          font-family: var(--font-display);
          font-size: 17px; font-weight: 700;
        }

        .plan-desc { font-size: 12px; color: var(--muted); margin-top: 4px; }

        .plan-price {
          margin-top: 14px;
          display: flex; align-items: baseline; gap: 4px;
        }

        .price-currency { font-size: 18px; color: var(--muted); font-weight: 600; margin-bottom: 4px; }
        .price-num { font-family: var(--font-display); font-size: 44px; font-weight: 800; line-height: 1; }
        .price-per { font-size: 12px; color: var(--muted); margin-bottom: 4px; }

        .plan-features {
          padding: 16px 20px;
          display: flex; flex-direction: column; gap: 8px;
        }

        .plan-feat {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; color: var(--muted);
        }

        .feat-check {
          width: 16px; height: 16px;
          background: rgba(16,185,129,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--green);
        }

        .plan-cta {
          padding: 0 20px 20px;
        }

        /* ── Upgrade modal ── */
        .upgrade-modal {
          max-width: 440px;
        }

        .upgrade-icon {
          width: 72px; height: 72px;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2));
          border: 1px solid rgba(245,158,11,0.3);
          color: var(--amber);
          margin: 0 auto 20px;
        }

        .upgrade-body { padding: 32px; text-align: center; }
        .upgrade-title { font-family: var(--font-display); font-size: 24px; font-weight: 800; margin-bottom: 10px; }
        .upgrade-sub { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 24px; }

        .feature-list {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          text-align: left; margin-bottom: 24px;
        }

        .feature-list-title { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; font-family: var(--font-mono); }

        .feature-item { display: flex; align-items: center; gap: 10px; font-size: 13px; padding: 4px 0; }
        .feature-item::before { content: '→'; color: var(--accent); font-size: 12px; flex-shrink: 0; }

        .btn-row { display: flex; gap: 10px; }
        .btn-row .btn { flex: 1; justify-content: center; }

        /* ── Divider ── */
        .divider {
          height: 1px; background: var(--border);
          margin: 12px 0;
        }

        /* ── Section label ── */
        .section-label {
          font-size: 10px; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.1em;
          font-family: var(--font-mono);
          margin-bottom: 10px; margin-top: 4px;
        }

        /* ── Connect CTA ── */
        .connect-cta {
          margin-top: 12px;
          padding: 16px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          display: flex; flex-direction: column; gap: 12px;
        }

        .connect-cta-text { font-size: 12px; color: var(--muted); line-height: 1.5; }

        /* ── Session info ── */
        .session-strip {
          display: flex; align-items: center; gap: 20px;
          padding: 12px 18px;
          background: rgba(99,102,241,0.06);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: var(--radius-sm);
        }

        .session-item { display: flex; flex-direction: column; gap: 2px; }
        .session-key { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-mono); }
        .session-val { font-family: var(--font-mono); font-size: 14px; font-weight: 500; color: #818CF8; }

        /* ── Color swatch ── */
        input[type="color"] {
          width: 100%; height: 36px; border-radius: 8px;
          border: 1px solid var(--border2); cursor: pointer;
          background: transparent; padding: 2px;
        }

        /* Animations */
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .fade-in { animation: fadeIn 0.3s ease; }

        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1); }

        /* Responsive */
        @media (max-width: 1100px) {
          .workspace { grid-template-columns: 1fr; }
          .right-panel { display: grid; grid-template-columns: 1fr 1fr; max-height: none; }
        }
      `}</style>

      <div className="app">
        {/* Ambient */}
        <div className="ambient ambient-1" />
        <div className="ambient ambient-2" />

        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-mark">
              <Ico
                name="layers"
                size={22}
                className=""
                style={{ color: "white" }}
              />
            </div>
            <div className="logo-text">
              <div className="logo-name">VirtualStage</div>
              <div className="logo-sub">Professional Studio · v3.2.0</div>
            </div>
          </div>

          <div className="header-right">
            {streaming && (
              <>
                <div className="metric-chip" style={{ color: "#34D399" }}>
                  <Ico name="activity" size={12} />
                  <span>{fps} FPS</span>
                </div>
                <div className="metric-chip" style={{ color: "#818CF8" }}>
                  <Ico name="zap" size={12} />
                  <span>{latency}ms</span>
                </div>
                <div className="metric-chip" style={{ color: "#38BDF8" }}>
                  <Ico name="eye" size={12} />
                  <span>{quality}</span>
                </div>
              </>
            )}

            <div
              className={`status-pill ${connected ? "status-online" : connecting ? "status-connecting" : "status-offline"}`}
            >
              <div
                className={`status-dot ${connected ? "pulse" : connecting ? "ping" : ""}`}
                style={{
                  background: connected
                    ? "#34D399"
                    : connecting
                      ? "#FCD34D"
                      : "#FB7185",
                }}
              />
              <Ico name={connected ? "wifi" : "wifiOff"} size={13} />
              <span>
                {connected
                  ? "Engine Online"
                  : connecting
                    ? "Connecting…"
                    : "Offline"}
              </span>
            </div>

            <div className="plan-badge" onClick={() => setShowPlans(true)}>
              <Ico name="crown" size={13} />
              <span>
                {plan === "free"
                  ? "Free Plan"
                  : plan === "pro"
                    ? "Pro"
                    : "Enterprise"}
              </span>
              {plan === "free" && (
                <span style={{ color: "#F59E0B", fontSize: 10 }}>
                  ↑ Upgrade
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="workspace">
          {/* Studio */}
          <div className="studio-panel">
            {/* Canvas */}
            <div className="canvas-wrap" style={{ flex: 1 }}>
              <div className="canvas-header">
                <div className="canvas-title">
                  <Ico name="camera" size={14} />
                  Virtual Studio
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {streaming && (
                    <div className="live-badge">
                      <div
                        className="status-dot pulse"
                        style={{ background: "#F43F5E" }}
                      />
                      LIVE
                    </div>
                  )}
                  {recording && (
                    <div
                      className="live-badge"
                      style={{
                        background: "rgba(244,63,94,0.15)",
                        borderColor: "rgba(244,63,94,0.5)",
                      }}
                    >
                      <div
                        className="status-dot pulse"
                        style={{ background: "#F43F5E" }}
                      />
                      REC {fmtRec(recTime)}
                    </div>
                  )}
                  <button
                    className="btn-icon btn"
                    onClick={() => setAudioOn(!audioOn)}
                    title="Toggle audio"
                    style={
                      audioOn
                        ? {
                            background: "rgba(99,102,241,0.15)",
                            borderColor: "rgba(99,102,241,0.4)",
                            color: "#818CF8",
                          }
                        : {}
                    }
                  >
                    <Ico name={audioOn ? "mic" : "micOff"} size={15} />
                  </button>
                  <button
                    className="btn-icon btn"
                    onClick={() => {
                      setFullscreen(!fullscreen);
                      if (!fullscreen)
                        document.documentElement.requestFullscreen?.();
                      else document.exitFullscreen?.();
                    }}
                  >
                    <Ico
                      name={fullscreen ? "minimize" : "maximize"}
                      size={15}
                    />
                  </button>
                </div>
              </div>

              {/* Video / Canvas area */}
              <div className="canvas-inner">
                <video ref={videoRef} autoPlay muted={!audioOn} playsInline />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: streaming ? "block" : "none",
                  }}
                />

                {!streaming && (
                  <div className="canvas-idle">
                    <div className="idle-icon">
                      <Ico name="camera" size={44} />
                    </div>
                    <div>
                      <div className="idle-title">Studio Ready</div>
                      <div className="idle-sub">
                        {connected
                          ? "Click Start Studio to begin real-time AI background replacement"
                          : "Connect to the VirtualStage engine to start processing"}
                      </div>
                    </div>
                    {connected && (
                      <div className="conn-notice">
                        <div
                          className="status-dot pulse"
                          style={{ background: "#34D399" }}
                        />
                        <span>Engine connected — press Start</span>
                      </div>
                    )}
                  </div>
                )}

                {/* HUD overlays */}
                {streaming && (
                  <>
                    <div className="hud-overlay hud-tl">
                      <div className="hud-card">
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--muted)",
                            marginBottom: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          Active Environment
                        </div>
                        <div className="hud-row" style={{ marginBottom: 4 }}>
                          <span className="hud-label">Scene:</span>
                          <span
                            className="hud-val"
                            style={{ color: currentBg.accent }}
                          >
                            {currentBg.label}
                          </span>
                        </div>
                        <div className="hud-row" style={{ marginBottom: 4 }}>
                          <span className="hud-label">Quality:</span>
                          <span
                            className="hud-val"
                            style={{ color: "#818CF8" }}
                          >
                            {processQuality.toUpperCase()}
                          </span>
                        </div>
                        <div className="hud-row">
                          <span className="hud-label">Smoothing:</span>
                          <span
                            className="hud-val"
                            style={{ color: "#38BDF8" }}
                          >
                            {edgeSmooth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hud-overlay hud-tr">
                      <div className="hud-card">
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--muted)",
                            marginBottom: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          Performance
                        </div>
                        <div className="hud-row" style={{ marginBottom: 4 }}>
                          <span className="hud-label">FPS:</span>
                          <span
                            className="hud-val"
                            style={{ color: "#34D399" }}
                          >
                            {fps}
                          </span>
                        </div>
                        <div className="hud-row" style={{ marginBottom: 4 }}>
                          <span className="hud-label">Latency:</span>
                          <span
                            className="hud-val"
                            style={{ color: "#F59E0B" }}
                          >
                            {latency}ms
                          </span>
                        </div>
                        <div className="hud-row">
                          <span className="hud-label">Frames:</span>
                          <span
                            className="hud-val"
                            style={{ color: "#94A3B8" }}
                          >
                            {frames.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Canvas footer */}
                {streaming && (
                  <div className="canvas-footer">
                    <div className="env-tag">
                      <div
                        className="env-dot"
                        style={{ background: currentBg.accent }}
                      />
                      <span>{currentBg.label}</span>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--muted)",
                      }}
                    >
                      {fmtTime(uptime)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls bar */}
            <div className="controls-bar">
              <div className="controls-left">
                {!streaming ? (
                  <button
                    className="btn btn-primary"
                    onClick={startStream}
                    disabled={!connected}
                    style={{ fontSize: 14, padding: "11px 28px" }}
                  >
                    <Ico name="play" size={16} /> Start Studio
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={stopStream}
                    style={{ fontSize: 14, padding: "11px 28px" }}
                  >
                    <Ico name="stop" size={16} /> End Session
                  </button>
                )}

                {!connected && !connecting && (
                  <button
                    className="btn btn-ghost"
                    onClick={connect}
                    style={{ gap: 8 }}
                  >
                    <Ico name="cloud" size={15} /> Connect Engine
                  </button>
                )}

                {streaming && !recording && (
                  <button
                    className="btn btn-danger"
                    onClick={startRec}
                    style={{ padding: "11px 20px" }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        background: "white",
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                    Record
                  </button>
                )}

                {recording && (
                  <>
                    <button className="btn btn-ghost" onClick={stopRec}>
                      <Ico name="stop" size={15} /> Stop Rec
                    </button>
                    <div className="rec-indicator">
                      <div
                        className="status-dot pulse"
                        style={{ background: "#F43F5E" }}
                      />
                      {fmtRec(recTime)}
                    </div>
                  </>
                )}
              </div>

              <div className="controls-right">
                <select
                  className="quality-select"
                  value={quality}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "4K" && plan === "free") {
                      requirePro("4K streaming");
                      return;
                    }
                    setQuality(v);
                  }}
                >
                  <option value="4K">4K {plan === "free" ? "🔒" : ""}</option>
                  <option value="HD">HD 1080p</option>
                  <option value="SD">SD 720p</option>
                </select>

                {streaming && (
                  <>
                    <button
                      className="btn btn-ghost"
                      onClick={exportFrame}
                      title="Export frame"
                    >
                      <Ico name="download" size={15} /> Export
                    </button>
                    <button
                      className="btn-icon btn"
                      onClick={() => {
                        const cv = canvasRef.current;
                        if (cv) {
                          const ctx = cv.getContext("2d");
                          ctx?.clearRect(0, 0, cv.width, cv.height);
                        }
                      }}
                    >
                      <Ico name="rotate" size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Session strip (when streaming) */}
            {streaming && (
              <div className="session-strip">
                <div className="session-item">
                  <div className="session-key">Uptime</div>
                  <div className="session-val">{fmtTime(uptime)}</div>
                </div>
                <div className="session-item">
                  <div className="session-key">Frames</div>
                  <div className="session-val">{frames.toLocaleString()}</div>
                </div>
                <div className="session-item">
                  <div className="session-key">FPS</div>
                  <div className="session-val">{fps}</div>
                </div>
                <div className="session-item">
                  <div className="session-key">Latency</div>
                  <div className="session-val">{latency}ms</div>
                </div>
                <div className="session-item">
                  <div className="session-key">Quality</div>
                  <div className="session-val">{quality}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="right-panel">
            {/* Environments + Settings tabs */}
            <div className="panel-card">
              <div className="panel-body">
                <div className="tabs">
                  <button
                    className={`tab ${activeTab === "environments" ? "active" : ""}`}
                    onClick={() => setActiveTab("environments")}
                  >
                    Environments
                  </button>
                  <button
                    className={`tab ${activeTab === "settings" ? "active" : ""}`}
                    onClick={() => setActiveTab("settings")}
                  >
                    Settings
                  </button>
                </div>

                {activeTab === "environments" && (
                  <>
                    <div className="env-grid">
                      {BACKGROUNDS.map((bg) => {
                        const isLocked = bg.tag === "PRO" && plan === "free";
                        const isActive = bgType === bg.id;
                        return (
                          <div
                            key={bg.id}
                            className={`env-card fade-in ${isActive ? "active" : ""} ${isLocked ? "locked" : ""}`}
                            style={{
                              borderColor: isActive ? bg.accent : "transparent",
                              color: bg.accent,
                            }}
                            onClick={() => selectBg(bg)}
                          >
                            <div className="env-bg">
                              <div
                                className="env-gradient"
                                style={{
                                  "--c1": bg.color,
                                  "--c2": bg.color + "AA",
                                }}
                              />
                              <div
                                style={{
                                  position: "relative",
                                  zIndex: 1,
                                  opacity: isLocked ? 0.3 : 0.7,
                                  fontSize: 24,
                                }}
                              >
                                {bg.id === "blur"
                                  ? "🎬"
                                  : bg.id === "office"
                                    ? "🏛"
                                    : bg.id === "studio"
                                      ? "📺"
                                      : bg.id === "luxury"
                                        ? "💎"
                                        : bg.id === "nature"
                                          ? "🌿"
                                          : bg.id === "urban"
                                            ? "🏙"
                                            : bg.id === "cosmic"
                                              ? "🌌"
                                              : bg.id === "beach"
                                                ? "🏝"
                                                : bg.id === "gradient"
                                                  ? "🎨"
                                                  : bg.id === "abstract"
                                                    ? "✦"
                                                    : bg.id === "space"
                                                      ? "🚀"
                                                      : "📁"}
                              </div>
                            </div>
                            <div className="env-info">
                              <div className="env-label">{bg.label}</div>
                            </div>
                            <div
                              className={`env-badge ${bg.tag === "FREE" ? "badge-free" : "badge-pro"}`}
                            >
                              {bg.tag}
                            </div>
                            {isLocked && (
                              <div className="env-lock">
                                <Ico
                                  name="lock"
                                  size={16}
                                  style={{ color: "#F59E0B" }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleUpload}
                    />
                  </>
                )}

                {activeTab === "settings" && (
                  <>
                    <div className="section-label">Processing Quality</div>
                    <div className="quality-btns">
                      {["medium", "high", "ultra"].map((q) => {
                        const locked = q === "ultra" && plan === "free";
                        return (
                          <button
                            key={q}
                            className={`q-btn ${processQuality === q ? "active" : ""}`}
                            onClick={() => {
                              if (locked) {
                                requirePro("Ultra quality");
                                return;
                              }
                              setProcessQuality(q);
                            }}
                          >
                            {q === "ultra"
                              ? "⚡ Ultra"
                              : q === "high"
                                ? "HD"
                                : "SD"}
                            {locked && <Ico name="lock" size={10} />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="slider-row">
                      <div className="slider-label">
                        <span className="slider-name">Edge Smoothing</span>
                        <span className="slider-val">{edgeSmooth}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={edgeSmooth}
                        onChange={(e) => setEdgeSmooth(+e.target.value)}
                      />
                    </div>

                    <div className="slider-row">
                      <div className="slider-label">
                        <span className="slider-name">Blur Intensity</span>
                        <span className="slider-val">{blurAmount}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={30}
                        value={blurAmount}
                        onChange={(e) => setBlurAmount(+e.target.value)}
                      />
                    </div>

                    <div className="divider" />

                    <div className="section-label">Stream Resolution</div>
                    <div className="quality-btns">
                      {["SD", "HD", "4K"].map((q) => (
                        <button
                          key={q}
                          className={`q-btn ${quality === q ? "active" : ""}`}
                          onClick={() => {
                            if (q === "4K" && plan === "free") {
                              requirePro("4K");
                              return;
                            }
                            setQuality(q);
                          }}
                        >
                          {q}
                          {q === "4K" && plan === "free" && (
                            <Ico name="lock" size={10} />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="divider" />

                    <button
                      className="btn btn-ghost"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                      onClick={() => {
                        if (wsRef.current?.readyState === WebSocket.OPEN)
                          wsRef.current.close();
                        connect();
                      }}
                    >
                      <Ico name="rotate" size={14} /> Reconnect Engine
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Performance */}
            <div className="panel-card">
              <div className="panel-head">
                <div className="panel-title">
                  <Ico name="chart" size={14} style={{ color: "#34D399" }} />
                  Performance
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    color: connected ? "#34D399" : "var(--muted)",
                  }}
                >
                  {connected ? "● OPTIMAL" : "● IDLE"}
                </div>
              </div>
              <div className="panel-body" style={{ paddingBottom: 10 }}>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">CPU</div>
                    <div className="stat-val" style={{ color: "#818CF8" }}>
                      {cpu.toFixed(0)}
                      <span style={{ fontSize: 12 }}>%</span>
                    </div>
                    <div className="stat-bar">
                      <div
                        className="stat-fill"
                        style={{
                          width: `${cpu}%`,
                          background:
                            "linear-gradient(90deg, #4F46E5, #818CF8)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Memory</div>
                    <div className="stat-val" style={{ color: "#34D399" }}>
                      {mem.toFixed(0)}
                      <span style={{ fontSize: 12 }}>%</span>
                    </div>
                    <div className="stat-bar">
                      <div
                        className="stat-fill"
                        style={{
                          width: `${mem}%`,
                          background:
                            "linear-gradient(90deg, #059669, #34D399)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Frame Rate</div>
                    <div className="stat-val" style={{ color: "#F59E0B" }}>
                      {fps}
                      <span style={{ fontSize: 12 }}> fps</span>
                    </div>
                    <div className="stat-bar">
                      <div
                        className="stat-fill"
                        style={{
                          width: `${Math.min((fps / 60) * 100, 100)}%`,
                          background:
                            "linear-gradient(90deg, #D97706, #F59E0B)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Latency</div>
                    <div className="stat-val" style={{ color: "#38BDF8" }}>
                      {latency}
                      <span style={{ fontSize: 12 }}> ms</span>
                    </div>
                    <div className="stat-bar">
                      <div
                        className="stat-fill"
                        style={{
                          width: `${Math.min((latency / 200) * 100, 100)}%`,
                          background:
                            "linear-gradient(90deg, #0284C7, #38BDF8)",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="server-card">
                  <div className="server-row">
                    <span className="server-key">Engine Version</span>
                    <span className="server-val" style={{ color: "#818CF8" }}>
                      v3.2.0
                    </span>
                  </div>
                  <div className="server-row">
                    <span className="server-key">Server Load</span>
                    <span className="server-val" style={{ color: "#34D399" }}>
                      {serverLoad.toFixed(1)}%
                    </span>
                  </div>
                  <div className="server-row">
                    <span className="server-key">Session Uptime</span>
                    <span className="server-val" style={{ color: "#94A3B8" }}>
                      {fmtTime(uptime)}
                    </span>
                  </div>
                  {reconnects > 0 && (
                    <div className="server-row">
                      <span className="server-key">Reconnects</span>
                      <span className="server-val" style={{ color: "#F59E0B" }}>
                        {reconnects}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recordings */}
            <div className="panel-card">
              <div className="panel-head">
                <div className="panel-title">
                  <Ico name="video" size={14} style={{ color: "#F43F5E" }} />
                  Recordings
                </div>
                <button
                  className="btn-icon btn"
                  style={{ width: 28, height: 28 }}
                  onClick={async () => {
                    try {
                      const r = await fetch(
                        "http://localhost:8000/recordings/list",
                      );
                      if (r.ok)
                        setRecordings((await r.json()).recordings || []);
                    } catch {}
                  }}
                >
                  <Ico name="rotate" size={12} />
                </button>
              </div>
              <div className="panel-body">
                {recordings.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "24px 0",
                      color: "var(--muted)",
                      fontSize: 12,
                    }}
                  >
                    <Ico
                      name="video"
                      size={28}
                      style={{
                        opacity: 0.3,
                        marginBottom: 8,
                        display: "block",
                        margin: "0 auto 8px",
                      }}
                    />
                    No recordings yet
                  </div>
                ) : (
                  <div className="rec-list">
                    {recordings.map((r, i) => (
                      <div key={i} className="rec-item">
                        <div>
                          <div className="rec-name">
                            {r.filename.replace(".mp4", "")}
                          </div>
                          <div className="rec-meta">
                            {fmtSize(r.file_size)} ·{" "}
                            {new Date(
                              r.created_time * 1000,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="rec-actions">
                          <button
                            className="btn-icon btn"
                            style={{ width: 28, height: 28, color: "#38BDF8" }}
                            onClick={async () => {
                              const res = await fetch(
                                `http://localhost:8000/recordings/download/${r.filename}`,
                              );
                              const blob = await res.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = r.filename;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <Ico name="download" size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity log */}
            <div className="panel-card">
              <div className="panel-head">
                <div className="panel-title">
                  <Ico name="shield" size={14} style={{ color: "#06B6D4" }} />
                  Activity Log
                </div>
                <div className="panel-count">{logs.length}</div>
              </div>
              <div className="panel-body">
                {logs.length === 0 ? (
                  <div className="log-empty">No events logged yet</div>
                ) : (
                  <div className="log-list">
                    {[...logs].reverse().map((l, i) => (
                      <div key={i} className={`log-item log-${l.type}`}>
                        <span className="log-icon">{l.icon}</span>
                        <span className="log-time">{l.time}</span>
                        <span className="log-msg">{l.msg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Connection help */}
            {!connected && !connecting && (
              <div className="connect-cta">
                <div className="connect-cta-text">
                  <strong style={{ color: "var(--text)" }}>
                    Backend not detected
                  </strong>
                  <br />
                  Start your VirtualStage backend server at{" "}
                  <span
                    style={{
                      color: "#818CF8",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                    }}
                  >
                    localhost:8000
                  </span>{" "}
                  then connect.
                </div>
                <button
                  className="btn btn-primary"
                  onClick={connect}
                  style={{ alignSelf: "flex-start", fontSize: 13 }}
                >
                  <Ico name="cloud" size={15} /> Connect Engine
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pricing overlay */}
        {showPlans && (
          <div
            className="overlay"
            onClick={(e) => e.target === e.currentTarget && setShowPlans(false)}
          >
            <div className="modal slide-up">
              <div className="modal-head">
                <div>
                  <div className="modal-title">Choose your plan</div>
                  <div className="modal-sub">
                    Professional virtual staging for every creator
                  </div>
                </div>
                <button
                  className="btn-icon btn"
                  onClick={() => setShowPlans(false)}
                >
                  <Ico name="x" size={16} />
                </button>
              </div>
              <div className="plan-grid">
                {PLANS.map((p) => (
                  <div
                    key={p.id}
                    className={`plan-card ${p.badge ? "popular" : ""}`}
                  >
                    {p.badge && <div className="popular-ribbon">{p.badge}</div>}
                    <div
                      className={`plan-header ${!p.badge ? "no-ribbon" : ""}`}
                    >
                      <div className="plan-name">{p.name}</div>
                      <div className="plan-desc">{p.desc}</div>
                      <div className="plan-price">
                        {p.price > 0 && (
                          <span className="price-currency">₹</span>
                        )}
                        <span className="price-num">
                          {p.price === 0 ? "Free" : p.price}
                        </span>
                        {p.price > 0 && <span className="price-per">/mo</span>}
                      </div>
                    </div>
                    <div className="plan-features">
                      {p.features.map((f, i) => (
                        <div key={i} className="plan-feat">
                          <div className="feat-check">
                            <Ico name="check" size={9} />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="plan-cta">
                      <button
                        className={`btn ${plan === p.id ? "btn-ghost" : p.id === "enterprise" ? "btn-amber" : p.badge ? "btn-primary" : "btn-ghost"}`}
                        style={{ width: "100%", justifyContent: "center" }}
                        disabled={plan === p.id}
                        onClick={() => {
                          setPlan(p.id);
                          setShowPlans(false);
                          log(`Upgraded to ${p.name}`, "success");
                        }}
                      >
                        {plan === p.id ? "✓ Current Plan" : p.cta}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade prompt */}
        {showUpgrade && (
          <div
            className="overlay"
            onClick={(e) =>
              e.target === e.currentTarget && setShowUpgrade(false)
            }
          >
            <div className="modal upgrade-modal slide-up">
              <div className="upgrade-body">
                <div className="upgrade-icon">
                  <Ico name="crown" size={32} />
                </div>
                <div className="upgrade-title">Upgrade to Pro</div>
                <div className="upgrade-sub">
                  <strong style={{ color: "var(--text)" }}>
                    {upgradeFeature}
                  </strong>{" "}
                  requires a Professional subscription.
                </div>
                <div className="feature-list">
                  <div className="feature-list-title">
                    What you unlock with Pro
                  </div>
                  {[
                    "4K Ultra HD output",
                    "All 12 virtual environments",
                    "Recording & export",
                    "Priority processing",
                    "AI enhancement engine",
                    "Custom backgrounds",
                  ].map((f) => (
                    <div key={f} className="feature-item">
                      {f}
                    </div>
                  ))}
                </div>
                <div className="btn-row">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowUpgrade(false)}
                  >
                    Maybe later
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setShowUpgrade(false);
                      setShowPlans(true);
                    }}
                  >
                    <Ico name="sparkles" size={15} /> View Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
