import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DemoCard {
    id: string;
    title: string;
    tag: string;
    tagColor: string;
    tagBg: string;
    avatar?: string;
    avatarColor?: string;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    checked: boolean;
}

export interface DemoColumn {
    id: string;
    label: string;
    dotColor: string;
    cards: DemoCard[];
}

interface KanbanState {
    columns: DemoColumn[];
    selectedCard: string | null;
    selectedCardCol: string | null;
}

const initialState: KanbanState = {
    columns: [
        {
            id: "backlog",
            label: "Backlog",
            dotColor: "#94a3b8",
            cards: [
                { id: "c1", title: "Research competitor pricing", tag: "Research", tagColor: "#6554c0", tagBg: "#f3f0ff", priority: "low", checked: false },
                { id: "c2", title: "Define Q3 OKRs & key results", tag: "Strategy", tagColor: "#6C5CE7", tagBg: "#F0EDFF", priority: "medium", dueDate: "Apr 30", checked: false },
            ],
        },
        {
            id: "inprogress",
            label: "In Progress",
            dotColor: "#2563eb",
            cards: [
                { id: "c3", title: "Redesign onboarding flow", tag: "Design", tagColor: "#ff5630", tagBg: "#ffebe6", priority: "high", avatar: "SC", avatarColor: "#6554c0", dueDate: "Apr 18", checked: false },
                { id: "c4", title: "API rate limit refactor", tag: "Engineering", tagColor: "#00875a", tagBg: "#e3fcef", priority: "medium", avatar: "MR", avatarColor: "#00875a", dueDate: "Apr 22", checked: false },
            ],
        },
        {
            id: "review",
            label: "In Review",
            dotColor: "#f59e0b",
            cards: [
                { id: "c5", title: "Mobile nav accessibility audit", tag: "QA", tagColor: "#f59e0b", tagBg: "#fef3c7", priority: "high", dueDate: "Apr 15", checked: false },
                { id: "c6", title: "Update API documentation", tag: "Docs", tagColor: "#64748b", tagBg: "#f1f5f9", priority: "low", checked: false },
            ],
        },
        {
            id: "done",
            label: "Done",
            dotColor: "#16a34a",
            cards: [
                { id: "c7", title: "Launch v2.4 release", tag: "Release", tagColor: "#00875a", tagBg: "#e3fcef", priority: "low", checked: true },
                { id: "c8", title: "Fix mobile nav bug", tag: "Bug", tagColor: "#ff5630", tagBg: "#ffebe6", priority: "medium", checked: true },
            ],
        },
    ],
    selectedCard: null,
    selectedCardCol: null,
};

const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        selectCard(state, action: PayloadAction<{ cardId: string; colId: string } | null>) {
            if (!action.payload) {
                state.selectedCard = null;
                state.selectedCardCol = null;
            } else {
                state.selectedCard = action.payload.cardId;
                state.selectedCardCol = action.payload.colId;
            }
        },
        moveCard(state, action: PayloadAction<{ cardId: string; fromColId: string; toColId: string }>) {
            const { cardId, fromColId, toColId } = action.payload;
            const fromCol = state.columns.find((c) => c.id === fromColId);
            const toCol = state.columns.find((c) => c.id === toColId);
            if (!fromCol || !toCol) return;
            const idx = fromCol.cards.findIndex((c) => c.id === cardId);
            if (idx === -1) return;
            const [card] = fromCol.cards.splice(idx, 1);
            // Mark as checked if moved to done
            if (toColId === "done") card.checked = true;
            else card.checked = false;
            toCol.cards.push(card);
            state.selectedCard = null;
            state.selectedCardCol = null;
        },
        toggleCheck(state, action: PayloadAction<string>) {
            for (const col of state.columns) {
                const card = col.cards.find((c) => c.id === action.payload);
                if (card) { card.checked = !card.checked; break; }
            }
        },
    },
});

export const { selectCard, moveCard, toggleCheck } = kanbanSlice.actions;
export default kanbanSlice.reducer;