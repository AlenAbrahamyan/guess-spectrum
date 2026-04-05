import { useRef } from "react";
import { useGame } from "../state/GameContext";
import { useScreenTransition } from "../hooks/useScreenTransition";
import { useT } from "../hooks/useT";
import { Button } from "../components/Button";

export function CluePhaseScreen() {
  const { state, dispatch } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  useScreenTransition(ref);
  const t = useT();

  const round = state.rounds[state.currentRound];
  const clueGiver = state.players[state.clueGiverIndex];
  const category = round.category;

  return (
    <div ref={ref} style={screen}>
      <div style={giverRow}>
        <div style={giverDot}>{clueGiver.name.charAt(0).toUpperCase()}</div>
        <div>
          <div style={giverLabel}>{t.clueGiverLabel}</div>
          <div style={giverName}>{clueGiver.name}</div>
        </div>
      </div>

      <div style={spectrumCard}>
        <div style={spectrumLabel}>{t.theSpectrum}</div>
        <div style={spectrumRow}>
          <div style={conceptLeft}>{category.left}</div>
          <div style={arrowCol}>
            {/* <div style={specLine} /> */}
            <span style={arrowIcon}>↔</span>
            {/* <div style={specLine} /> */}
          </div>
          <div style={conceptRight}>{category.right}</div>
        </div>
      </div>

      <div style={instruction}>{t.lookAtNeedle}</div>

      <div style={{ flex: 1 }} />

      <Button
        fullWidth
        onClick={() => dispatch({ type: "SET_CLUE", clue: "" })}
      >
        {t.clueGivenPassPhone}
      </Button>
    </div>
  );
}

const screen: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  padding: "18px 20px 24px",
  height: "100%",
};
const giverRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};
const giverDot: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #5050ff, #9944ff)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
  fontWeight: 900,
  color: "#fff",
  flexShrink: 0,
  boxShadow: "0 0 16px rgba(80,80,255,0.5)",
};
const giverLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.14em",
  color: "#6666aa",
  textTransform: "uppercase",
};
const giverName: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "#e0e0ff",
};
const spectrumCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 22,
  padding: "22px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};
const spectrumLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.18em",
  color: "#555577",
  textTransform: "uppercase",
  textAlign: "center",
};
const spectrumRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};
const conceptLeft: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  color: "#44aaff",
  flex: 1,
  textAlign: "left",
  lineHeight: 1.1,
};
const conceptRight: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  color: "#ff7733",
  flex: 1,
  textAlign: "right",
  lineHeight: 1.1,
};
const arrowCol: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  flexShrink: 0,
};
const specLine: React.CSSProperties = {
  width: 16,
  height: 2,
  background: "rgba(255,255,255,0.15)",
  borderRadius: 1,
};
const arrowIcon: React.CSSProperties = {
  fontSize: 20,
  color: "rgba(255,255,255,0.25)",
};
const instruction: React.CSSProperties = {
  fontSize: 13,
  color: "#7070aa",
  lineHeight: 1.6,
  textAlign: "center",
  padding: "0 8px",
};
