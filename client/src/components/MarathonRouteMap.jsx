import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const T = 7; // 7KM Marathon
const PATH_D = "M300 153 L350 168 L590 150 L750 190 L865 196 L860 250 L750 460 L650 640 L530 775 L350 625 L90 425 L65 410 L90 260 L135 205 Z";

const CHECKPOINTS = [
  'Municipal School (START)',
  'Mohan Reddy Traders',
  'VHP',
  'Anna Canteen',
  'Grameena Bank',
  'Reliance Digital',
  'Chinmaya Mission (END)',
];
const N = CHECKPOINTS.length - 1;

const fp = (i) => (i / N) * 0.965;
const kmOf = (i) => (i === N ? 7 : (fp(i) * T).toFixed(1));

const fmt = (m) => Math.floor(m / 60) + ':' + String(Math.round(m % 60)).padStart(2, '0');

export const MarathonRouteMap = ({ className = '' }) => {
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  // Default to pre-measured exact path length (2238.4) so checkpoints and runner render immediately in production
  const [pathLength, setPathLength] = useState(2238.4);
  const [f, setF] = useState(0); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(false);
  const [pace, setPace] = useState(6); // min/km
  const lastTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  // Measure path length on mount to get exact browser value
  useEffect(() => {
    if (pathRef.current) {
      try {
        const length = pathRef.current.getTotalLength();
        if (length > 0) {
          setPathLength(length);
        }
      } catch (err) {
        console.error("Error measuring path length:", err);
      }
    }
  }, []);

  // Control SVG animation pause / unpause
  useEffect(() => {
    if (svgRef.current) {
      try {
        if (isPlaying) {
          if (typeof svgRef.current.unpauseAnimations === 'function') {
            svgRef.current.unpauseAnimations();
          }
        } else {
          if (typeof svgRef.current.pauseAnimations === 'function') {
            svgRef.current.pauseAnimations();
            if (typeof svgRef.current.setCurrentTime === 'function') {
              svgRef.current.setCurrentTime(0);
            }
          }
        }
      } catch (err) {
        // Fallback
      }
    }
  }, [isPlaying]);

  // Animation Loop
  const tick = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      setF((prev) => {
        const next = prev + delta / 24000;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
      animFrameRef.current = requestAnimationFrame(tick);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(tick);
    } else if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, tick]);

  const pt = useCallback((frac) => {
    if (!pathRef.current || pathLength <= 0) return { x: 300, y: 153 };
    const clamped = Math.max(0, Math.min(1, frac));
    return pathRef.current.getPointAtLength(clamped * pathLength);
  }, [pathLength]);

  // Runner position & flip direction
  const runnerPos = useMemo(() => pt(f), [f, pt]);
  const runnerDir = useMemo(() => {
    const q2 = pt(Math.min(1, f + 0.004));
    const q3 = pt(Math.max(0, f - 0.004));
    return q2.x >= q3.x ? 1 : -1;
  }, [f, pt]);

  // Completed traced path
  const completedPathD = useMemo(() => {
    if (!pathRef.current || pathLength <= 0) return '';
    let d = '';
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const r = pt((f * i) / steps);
      d += (i ? ' L' : 'M') + r.x.toFixed(1) + ' ' + r.y.toFixed(1);
    }
    return d;
  }, [f, pathLength, pt]);

  // Precompute Landmark & Checkpoint Data for rendering SVG
  const checkpointsData = useMemo(() => {
    if (!pathRef.current || pathLength <= 0) return [];
    return CHECKPOINTS.map((n, i) => {
      const frac = fp(i);
      const q = pt(frac);
      const dx = q.x - 480;
      const dy = q.y - 420;
      const m = Math.hypot(dx, dy) || 1;
      const ox = q.x + (dx / m) * 34;
      const oy = q.y + (dy / m) * 30;
      const an = dx > 60 ? 'start' : dx < -60 ? 'end' : 'middle';
      const parts = n.includes(' – ') ? n.split(' – ') : [n];
      const yOffset = oy + (dy > 0 ? 10 : 0) - (parts.length - 1) * 8;
      const kmLabel = kmOf(i);
      return {
        index: i,
        name: n,
        frac,
        x: q.x,
        y: q.y,
        ox,
        oy: yOffset,
        anchor: an,
        parts,
        kmLabel,
      };
    });
  }, [pathLength, pt]);

  // Navigation handlers
  const go = (targetF) => {
    setIsPlaying(false);
    setF(targetF);
  };

  const togglePlay = () => {
    if (f >= 1) setF(0);
    setIsPlaying(!isPlaying);
  };

  // Stats calculations
  const k = f * T;
  const kmCovered = k.toFixed(1);
  const kmRemaining = Math.max(0, T - k).toFixed(1);
  const elapsedStr = fmt(k * pace);
  const finishStr = fmt(T * pace);

  // Determine closest checkpoint index
  let closestIndex = 0;
  for (let j = 1; j <= N; j++) {
    if (Math.abs(f - fp(j)) < Math.abs(f - fp(closestIndex))) {
      closestIndex = j;
    }
  }
  const isAtCheckpoint = Math.abs(f - fp(closestIndex)) < 0.02 || (closestIndex === N && f > 0.94);

  // Heading to index
  let headingIndex = 1;
  while (headingIndex < N && fp(headingIndex) < f) {
    headingIndex++;
  }

  return (
    <div id="marathon-map" className={`marathon-route-container w-full max-w-5xl mx-auto scroll-mt-28 ${className}`}>
      <style>{`
        .marathon-route-container {
          --bg: #fbf3e4;
          --card: #fffaf0;
          --ink: #2b1a0e;
          --mut: #7a6650;
          --route: #e8872b;
          --route2: #c0392b;
          --acc: #1f6f5c;
          --line: #e6d5b5;
          font-family: Georgia, 'Times New Roman', serif;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .marathon-route-container {
            --bg: #17120d;
            --card: #221a12;
            --ink: #f6ead6;
            --mut: #b8a48a;
            --route: #ffa13d;
            --route2: #ff6b57;
            --acc: #52d1b0;
            --line: #3a2d1f;
          }
        }
        :root[data-theme="dark"] .marathon-route-container {
          --bg: #17120d;
          --card: #221a12;
          --ink: #f6ead6;
          --mut: #b8a48a;
          --route: #ffa13d;
          --route2: #ff6b57;
          --acc: #52d1b0;
          --line: #3a2d1f;
        }
        .marathon-route-container .wrap {
          max-width: 1000px;
          margin: 0 auto;
          padding: 16px;
        }
        .marathon-route-container h2 {
          margin: 0;
          font-size: clamp(22px, 4vw, 32px);
          letter-spacing: .5px;
          color: var(--ink);
          font-weight: 700;
        }
        .marathon-route-container .sub {
          color: var(--mut);
          margin: 4px 0 14px;
          font-family: system-ui, sans-serif;
          font-size: 14px;
        }
        .marathon-route-container .board {
          background: var(--card);
          border: 3px solid var(--ink);
          border-radius: 14px;
          padding: 8px;
          position: relative;
        }
        .marathon-route-container svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .marathon-route-container .ctrl {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-top: 12px;
          font-family: system-ui, sans-serif;
          font-size: 14px;
        }
        .marathon-route-container .ctrl-btn {
          background: var(--ink);
          color: var(--bg);
          border: 0;
          border-radius: 8px;
          padding: 9px 18px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .marathon-route-container .ctrl-btn:hover {
          opacity: 0.9;
        }
        .marathon-route-container input[type=range] {
          flex: 1;
          min-width: 160px;
          accent-color: var(--route);
          cursor: pointer;
        }
        .marathon-route-container input[type=number] {
          width: 70px;
          padding: 6px;
          border-radius: 6px;
          border: 1px solid var(--line);
          background: var(--card);
          color: var(--ink);
        }
        .marathon-route-container .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
          margin-top: 12px;
          font-family: system-ui, sans-serif;
        }
        .marathon-route-container .stat {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 10px;
        }
        .marathon-route-container .stat b {
          display: block;
          font-size: 22px;
          color: var(--route2);
        }
        .marathon-route-container .stat span {
          font-size: 12px;
          color: var(--mut);
        }
        .marathon-route-container .info {
          margin-top: 12px;
          background: var(--card);
          border-left: 5px solid var(--route);
          border-radius: 8px;
          padding: 12px;
          font-family: system-ui, sans-serif;
          font-size: 14px;
          min-height: 60px;
          display: flex;
          align-items: center;
          color: var(--ink);
        }
        .marathon-route-container .note {
          font-size: 12px;
          color: var(--mut);
          margin-top: 10px;
          font-family: system-ui, sans-serif;
        }
        .marathon-route-container .km {
          cursor: pointer;
        }
        .marathon-route-container .km:hover ellipse {
          fill: var(--route);
        }
        .marathon-route-container .lm {
          cursor: pointer;
        }
        .marathon-route-container .pc {
          cursor: pointer;
          text-align: left;
          background: var(--card);
          color: var(--ink);
          border: 1px solid var(--line);
          font-weight: 400;
          padding: 8px 10px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .marathon-route-container .pc:hover,
        .marathon-route-container .pc.on {
          border-color: var(--route2);
          background: var(--bg);
        }
        .marathon-route-container .pc b {
          color: var(--route2);
          font-size: 13px;
        }
        .marathon-route-container .fig path {
          fill: none;
          stroke: var(--route2);
          stroke-width: 4.5;
          stroke-linecap: round;
        }
        .marathon-route-container .fig .hd {
          fill: var(--route2);
        }
        .marathon-route-container #runner {
          filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff);
        }
        .marathon-route-container text {
          font-family: system-ui, sans-serif;
        }
      `}</style>

      <div className="wrap">
        <h2>🏃 ANTI-DRUG MOVEMENT MARATHON - 7KM</h2>
        <p className="sub">Tap any checkpoint or drag the runner. 7 checkpoints along the 7 km loop route.</p>

        <div className="board">
          <svg
            id="m"
            ref={svgRef}
            viewBox="0 0 960 820"
            role="img"
            aria-label="Loop route map"
            className="select-none"
          >
            <defs>
              <pattern id="g-pattern-7k" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="var(--line)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid */}
            <rect width="960" height="820" fill="url(#g-pattern-7k)" />

            {/* Center Watermark */}
            <text x="480" y="400" textAnchor="middle" fontSize="40" fontWeight="700" fill="var(--line)" fontFamily="Georgia,serif">
              7 KM
            </text>
            <text x="480" y="432" textAnchor="middle" fontSize="16" fill="var(--mut)">
              LOOP RACE
            </text>

            {/* Background shadow track */}
            <path
              id="p"
              d={PATH_D}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="20"
              strokeLinejoin="round"
              opacity=".15"
            />

            {/* Done (covered) track */}
            {completedPathD && (
              <path
                id="done"
                d={completedPathD}
                fill="none"
                stroke="var(--route2)"
                strokeWidth="11"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Main orange track */}
            <path
              id="trk"
              ref={pathRef}
              d={PATH_D}
              fill="none"
              stroke="var(--route)"
              strokeWidth="11"
              strokeLinejoin="round"
              opacity=".55"
            />

            {/* Landmark text labels */}
            <g id="lms">
              {checkpointsData.map((item) => (
                <g
                  key={`lm-${item.index}`}
                  className="lm"
                  onClick={() => go(item.frac)}
                >
                  <text
                    x={item.ox}
                    y={item.oy}
                    textAnchor={item.anchor}
                    fontSize="14"
                    fontWeight="700"
                    fill="var(--ink)"
                  >
                    {item.parts.map((s, j) => (
                      <tspan key={j} x={item.ox} dy={j ? 16 : 0}>
                        {s}
                      </tspan>
                    ))}
                  </text>
                </g>
              ))}
            </g>

            {/* Checkpoint KM Badges */}
            <g id="kms">
              {checkpointsData.map((item) => {
                const isStart = item.index === 0;
                const isEnd = item.index === N;
                return (
                  <g
                    key={`km-${item.index}`}
                    className="km"
                    transform={`translate(${item.x},${item.y})`}
                    onClick={() => go(item.frac)}
                  >
                    <ellipse
                      rx="30"
                      ry="13"
                      fill={isStart ? 'var(--acc)' : isEnd ? 'var(--route2)' : 'var(--card)'}
                      stroke="var(--ink)"
                      strokeWidth="1.8"
                    />
                    <text
                      textAnchor="middle"
                      y="4"
                      fontSize="11"
                      fontWeight="700"
                      fill={isStart || isEnd ? '#fff' : 'var(--ink)'}
                    >
                      {isStart ? 'START' : isEnd ? 'END' : `${item.kmLabel} km`}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Animated Runner Figure */}
            {pathLength > 0 && (
              <g id="runner" transform={`translate(${runnerPos.x},${runnerPos.y - 17})`}>
                <ellipse cy="17" rx="18" ry="4" fill="#000" opacity=".25" />
                <g id="dir" transform={`scale(${runnerDir},1)`}>
                  <g className="fig" transform="scale(1.7)">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0 0;0 -3;0 0"
                      dur=".25s"
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <g>
                      <path d="M0 -12 L0 -1" />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="-55 0 -12;35 0 -12;-55 0 -12"
                        dur=".5s"
                        begin="-0.25s"
                        repeatCount="indefinite"
                      />
                      <g>
                        <path d="M0 -1 L0 10" />
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="30 0 -1;115 0 -1;30 0 -1"
                          dur=".5s"
                          begin="-0.25s"
                          repeatCount="indefinite"
                        />
                      </g>
                    </g>
                    <g transform="rotate(18 0 -12)">
                      <g>
                        <path d="M0 -26 L0 -17" />
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="55 0 -26;-55 0 -26;55 0 -26"
                          dur=".5s"
                          begin="-0.25s"
                          repeatCount="indefinite"
                        />
                        <g>
                          <path d="M0 -17 L0 -8" />
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="-80 0 -17;-100 0 -17;-80 0 -17"
                            dur=".5s"
                            begin="-0.25s"
                            repeatCount="indefinite"
                          />
                        </g>
                      </g>
                      <path d="M0 -28 L0 -12" />
                      <circle cx="0" cy="-35" r="6" className="hd" />
                      <g>
                        <path d="M0 -26 L0 -17" />
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="55 0 -26;-55 0 -26;55 0 -26"
                          dur=".5s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                        <g>
                          <path d="M0 -17 L0 -8" />
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="-80 0 -17;-100 0 -17;-80 0 -17"
                            dur=".5s"
                            begin="0s"
                            repeatCount="indefinite"
                          />
                        </g>
                      </g>
                    </g>
                    <g>
                      <path d="M0 -12 L0 -1" />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="-55 0 -12;35 0 -12;-55 0 -12"
                        dur=".5s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <g>
                        <path d="M0 -1 L0 10" />
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="30 0 -1;115 0 -1;30 0 -1"
                          dur=".5s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="ctrl">
          <button id="pb" type="button" onClick={togglePlay} className="ctrl-btn">
            {f >= 1 ? '🏁 Again' : isPlaying ? '⏸ Pause' : '▶ Run'}
          </button>
          <input
            type="range"
            id="sl"
            min="0"
            max="1000"
            value={Math.round(f * 1000)}
            onChange={(e) => {
              setIsPlaying(false);
              setF(Number(e.target.value) / 1000);
            }}
            aria-label="Position"
          />
          <label className="flex items-center gap-1.5 font-medium">
            Pace (min/km){' '}
            <input
              type="number"
              id="pc"
              value={pace}
              min="3"
              max="12"
              step="0.5"
              onChange={(e) => setPace(Number(e.target.value) || 6)}
            />
          </label>
        </div>

        {/* Stats Grid */}
        <div className="stats">
          <div className="stat">
            <b id="sd">{kmCovered}</b>
            <span>km covered</span>
          </div>
          <div className="stat">
            <b id="sr">{kmRemaining}</b>
            <span>km remaining</span>
          </div>
          <div className="stat">
            <b id="st">{elapsedStr}</b>
            <span>elapsed (h:mm)</span>
          </div>
          <div className="stat">
            <b id="sf">{finishStr}</b>
            <span>finish time at pace</span>
          </div>
        </div>

        {/* Dynamic Info Box */}
        <div className="info" id="info">
          {isAtCheckpoint ? (
            <div>
              <b>{CHECKPOINTS[closestIndex]}</b>
              <br />
              {closestIndex === 0
                ? 'Start line – warm up and flag off.'
                : closestIndex === N
                ? `Finish line! ${finishStr} at your pace.`
                : `${kmOf(closestIndex)} km done, ${(T - Number(kmOf(closestIndex))).toFixed(1)} km to go. ETA ${fmt(Number(kmOf(closestIndex)) * pace)} at ${pace} min/km. Next: ${CHECKPOINTS[closestIndex + 1]}.`}
            </div>
          ) : (
            <div>
              <b>{kmCovered} km</b> · heading to {CHECKPOINTS[headingIndex]}
            </div>
          )}
        </div>

        {/* Checkpoint Quick Select Buttons */}
        <div className="stats" id="pts" style={{ marginTop: '12px' }}>
          {CHECKPOINTS.map((n, i) => {
            const frac = fp(i);
            const at = Math.abs(f - frac) < 0.02 || (i === N && f > 0.94);
            return (
              <button
                key={i}
                type="button"
                className={`pc ${at ? 'on' : ''}`}
                onClick={() => go(frac)}
              >
                <b>{i === 0 ? 'Start' : i === N ? 'End' : `Km ${kmOf(i)}`}</b>
                <br />
                {n}
              </button>
            );
          })}
        </div>

        <p className="note">Checkpoints are spaced along the traced 7 km route. Confirm exact positions with the organisers.</p>
      </div>
    </div>
  );
};

export default MarathonRouteMap;
