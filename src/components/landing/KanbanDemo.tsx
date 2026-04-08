
"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectCard, moveCard } from "@/lib/features/kanban/kanbanSlice";

const AV_COLORS: Record<string, string> = {
  SC: "#6C5CE7",
  MR: "#216e4e",
  PN: "#5e4db2",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function KanbanDemo() {
  const dispatch = useAppDispatch();
  const { columns, selectedCard, selectedCardCol } = useAppSelector((s) => s.kanban);

  const handleCardClick = useCallback(
    (cardId: string, colId: string) => {
      if (selectedCard === cardId) {
        dispatch(selectCard(null));
      } else {
        dispatch(selectCard({ cardId, colId }));
      }
    },
    [dispatch, selectedCard]
  );

  const handleMove = useCallback(
    (toColId: string) => {
      if (!selectedCard || !selectedCardCol) return;
      dispatch(moveCard({ cardId: selectedCard, fromColId: selectedCardCol, toColId }));
    },
    [dispatch, selectedCard, selectedCardCol]
  );

  return (
    <div className="kb-demo-wrap">
      {/* Chrome */}
      <div className="kb-chrome">
        <div className="kb-dots">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </div>
        <div className="kb-title-bar">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="4.5" height="12" rx="1.2" fill="#fff" />
            <rect x="8.5" y="2" width="5.5" height="8" rx="1.2" fill="#fff" opacity=".7" />
          </svg>
          <span>Website Redesign · Sprint 12</span>
        </div>
        <div className="kb-chrome-right">
          {["SC", "MR", "PN"].map((av, i) => (
            <div
              key={av}
              className="kb-av"
              style={{
                background: AV_COLORS[av],
                marginLeft: i > 0 ? -8 : 0,
              }}
            >
              {av}
            </div>
          ))}
          <button className="kb-invite-btn">+ Invite</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="kb-toolbar">
        <div className="kb-toolbar-left">
          <button className="kb-tb-btn kb-tb-btn--active">Board</button>
          <button className="kb-tb-btn">Timeline</button>
          <button className="kb-tb-btn">List</button>
        </div>
        <div className="kb-toolbar-right">
          <button className="kb-tb-btn">Filter</button>
          <button className="kb-tb-btn">+ Column</button>
        </div>
      </div>

      {/* Board */}
      <div className="kb-board">
        {columns.map((col) => (
          <div key={col.id} className="kb-col">
            <div className="kb-col-header">
              <div className="kb-col-left">
                <span className="kb-col-dot" style={{ background: col.dotColor }} />
                <span className="kb-col-label">{col.label}</span>
                <span className="kb-col-count">{col.cards.length}</span>
              </div>
              {selectedCard && selectedCardCol !== col.id && (
                <button className="kb-move-btn" onClick={() => handleMove(col.id)}>
                  Move →
                </button>
              )}
            </div>
            <div className="kb-col-cards">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className={`kb-card${selectedCard === card.id ? " kb-card--selected" : ""}${card.checked ? " kb-card--done" : ""}`}
                  onClick={() => handleCardClick(card.id, col.id)}
                >
                  {card.tag && (
                    <span className="kb-card-tag" style={{ background: card.tagBg, color: card.tagColor }}>
                      {card.tag}
                    </span>
                  )}
                  <p className={`kb-card-title${card.checked ? " kb-card-title--done" : ""}`}>
                    {card.title}
                  </p>
                  <div className="kb-card-footer">
                    <div className="kb-card-meta">
                      <span className="kb-priority-dot" style={{ background: PRIORITY_DOT[card.priority] }} />
                      {card.dueDate && <span className="kb-due">📅 {card.dueDate}</span>}
                    </div>
                    {card.avatar && (
                      <div className="kb-card-av" style={{ background: card.avatarColor }}>
                        {card.avatar}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button className="kb-add-card">+ Add a card</button>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="kb-hint">
          <span>✨ Click <strong>Move →</strong> on another column to move this card</span>
          <button onClick={() => dispatch(selectCard(null))} className="kb-hint-close">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}