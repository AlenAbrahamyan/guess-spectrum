import { useRef, useState } from "react";
import { useGame } from "../state/GameContext";
import { useScreenTransition } from "../hooks/useScreenTransition";
import { useT } from "../hooks/useT";
import { Button } from "../components/Button";
import { CATEGORIES_BY_LANG } from "../data/categoriesByLang";

export function LobbyScreen() {
  const { state, dispatch } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  useScreenTransition(ref);

  const count = state.players.length;
  const [modalOpen, setModalOpen] = useState(false);
  const [newLeft, setNewLeft] = useState("");
  const [newRight, setNewRight] = useState("");

  function changeCount(delta: number) {
    dispatch({ type: "SET_PLAYER_COUNT", count: count + delta });
  }

  function openModal() {
    setNewLeft("");
    setNewRight("");
    setModalOpen(true);
  }

  function submitTopic() {
    const left = newLeft.trim();
    const right = newRight.trim();
    if (!left || !right) return;
    dispatch({ type: "ADD_CUSTOM_CATEGORY", category: { left, right } });
    setModalOpen(false);
  }

  const t = useT();
  const langCats = CATEGORIES_BY_LANG[state.language];
  const allCategories = [...langCats, ...state.customCategories];

  return (
    <div ref={ref} style={screen}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <button
          onClick={() => dispatch({ type: "GO_MAIN_MENU" })}
          style={backBtn}
        >
          ←
        </button>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e0e0ff" }}>
          {t.gameSetup}
        </div>
      </div>

      {/* Player count */}
      <div style={card}>
        <div style={label}>{t.players}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            justifyContent: "center",
          }}
        >
          <button
            style={playerCountBtn}
            onClick={() => changeCount(-1)}
            disabled={count <= 2}
          >
            −
          </button>
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#e0e0ff",
              minWidth: 32,
              textAlign: "center",
            }}
          >
            {count}
          </span>
          <button
            style={playerCountBtn}
            onClick={() => changeCount(1)}
            disabled={count >= 8}
          >
            +
          </button>
        </div>
      </div>

      {/* Rounds */}
      <div style={card}>
        <div style={label}>{t.rounds}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {[1, 2, 3].map((times) => {
            const rounds = Math.min(10, times * count);
            const active = state.maxRounds === rounds;
            return (
              <button
                key={times}
                style={roundPreset(active)}
                onClick={() => dispatch({ type: "SET_MAX_ROUNDS", count: rounds })}
              >
                ×{times} <span style={{ opacity: 0.6, fontSize: 11 }}>({rounds})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Player names */}
      <div style={card}>
        <div style={label}>{t.playerNames}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.players.map((p, i) => (
            <input
              key={p.id}
              value={p.name}
              onChange={(e) =>
                dispatch({
                  type: "SET_PLAYER_NAME",
                  id: p.id,
                  name: e.target.value,
                })
              }
              placeholder={t.playerPlaceholder(i + 1)}
              maxLength={20}
              style={input}
            />
          ))}
        </div>
      </div>

      {/* Topic selection */}
      <div style={card}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={label}>
            {t.topicsCount(state.selectedCategories.length, allCategories.length)}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={pillBtn}
              onClick={() => dispatch({ type: "SELECT_ALL_CATEGORIES" })}
            >
              {t.all}
            </button>
            <button style={pillBtn} onClick={openModal}>
              {t.addTopic}
            </button>
          </div>
        </div>

        <div style={scrollBox}>
          <div style={chipGrid}>
            {allCategories.map((cat, i) => {
              const selected = state.selectedCategories.includes(i);
              const isCustom = i >= langCats.length;
              const localIdx = i - langCats.length;
              return (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <button
                    style={chip(selected)}
                    onClick={() =>
                      dispatch({ type: "TOGGLE_CATEGORY", index: i })
                    }
                  >
                    {cat.left} ↔ {cat.right}
                  </button>
                  {isCustom && (
                    <button
                      style={deleteBtn}
                      onClick={() =>
                        dispatch({
                          type: "DELETE_CUSTOM_CATEGORY",
                          localIndex: localIdx,
                        })
                      }
                      title="Remove topic"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Button fullWidth onClick={() => dispatch({ type: "START_GAME" })}>
        {t.startGame}
      </Button>

      {/* Add topic modal */}
      {modalOpen && (
        <div style={overlay} onClick={() => setModalOpen(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#e0e0ff",
                marginBottom: 16,
              }}
            >
              {t.addTopicModalTitle}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                autoFocus
                value={newLeft}
                onChange={(e) => setNewLeft(e.target.value)}
                placeholder={t.leftPlaceholder}
                maxLength={30}
                style={input}
                onKeyDown={(e) => e.key === "Enter" && submitTopic()}
              />
              <div
                style={{
                  textAlign: "center",
                  color: "#4a4aff",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ↔
              </div>
              <input
                value={newRight}
                onChange={(e) => setNewRight(e.target.value)}
                placeholder={t.rightPlaceholder}
                maxLength={30}
                style={input}
                onKeyDown={(e) => e.key === "Enter" && submitTopic()}
              />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button
                style={{ ...pillBtn, flex: 1 }}
                onClick={() => setModalOpen(false)}
              >
                {t.cancel}
              </button>
              <button
                style={{
                  ...pillBtn,
                  flex: 1,
                  background: "rgba(74,74,255,0.25)",
                  borderColor: "rgba(74,74,255,0.5)",
                  color: "#a0a0ff",
                }}
                onClick={submitTopic}
                disabled={!newLeft.trim() || !newRight.trim()}
              >
                {t.add}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const screen: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  padding: "24px 20px",
  maxWidth: 480,
  margin: "0 auto",
  height: "100%",
  overflowY: "auto",
};
const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  padding: "18px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};
const backBtn: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#c0c0e8",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
const label: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: "#7070aa",
  textTransform: "uppercase",
};
function roundPreset(active: boolean): React.CSSProperties {
  return {
    padding: "5px 14px",
    borderRadius: 20,
    border: active ? "1px solid rgba(74,74,255,0.7)" : "1px solid rgba(255,255,255,0.1)",
    background: active ? "rgba(74,74,255,0.22)" : "rgba(255,255,255,0.05)",
    color: active ? "#a0a0ff" : "#666688",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
  };
}
const playerCountBtn: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#e0e0ff",
  fontSize: 22,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const input: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "#e0e0ff",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const scrollBox: React.CSSProperties = {
  maxHeight: 130,
  overflowY: "auto",
  overflowX: "hidden",
  marginRight: -4,
  paddingRight: 4,
};
const chipGrid: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};
function chip(selected: boolean): React.CSSProperties {
  return {
    padding: "5px 12px",
    borderRadius: 20,
    border: selected
      ? "1px solid rgba(80,80,255,0.7)"
      : "1px solid rgba(255,255,255,0.09)",
    background: selected ? "rgba(80,80,255,0.22)" : "rgba(255,255,255,0.05)",
    color: selected ? "#b0b0ff" : "#666688",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  };
}
const pillBtn: React.CSSProperties = {
  padding: "5px 12px",
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#c0c0e8",
  fontSize: 12,
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
};
const deleteBtn: React.CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: "50%",
  border: "1px solid rgba(255,80,80,0.4)",
  background: "rgba(255,80,80,0.15)",
  color: "#ff6060",
  fontSize: 13,
  lineHeight: "1",
  fontFamily: "inherit",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  padding: 0,
  flexShrink: 0,
};
const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  padding: "0 24px",
};
const modal: React.CSSProperties = {
  background: "#12122a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 20,
  padding: "24px 20px",
  width: "100%",
  maxWidth: 340,
};
