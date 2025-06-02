import { create } from 'zustand';

interface TrainingState {
    socket: WebSocket | null;

    isTraining: boolean;
    isTrainingCompleted: boolean;

    setSocket: (s: WebSocket | null) => void;
    closeSocket: () => void;

    setIsTraining: (v: boolean) => void;
    setIsTrainingCompleted: (v: boolean) => void;
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
    socket: null,

    isTraining: false,
    isTrainingCompleted: false,

    setSocket: (s) => set({ socket: s }),
    closeSocket: () => {
        const sock = get().socket;
        if (sock && sock.readyState === WebSocket.OPEN) {
            sock.close();
        }
        set({ socket: null });
    },

    // TODO: Разобраться с хелпером
    // closeSocket: () => {
    //     const s = get().socket;
    //     if (s) s.close();
    //     set({ socket: null });
    // },

    setIsTraining: (v) => set({ isTraining: v }),
    setIsTrainingCompleted: (v) => set({ isTrainingCompleted: v }),
}));
