import { proxy, subscribe } from 'valtio';

const statePersistenceKey = 'state';

type State = {
  room?: string;
  username?: string;
  register(username: string, room: string): void;
};

export const state = proxy<State>({
  ...(JSON.parse(localStorage.getItem(statePersistenceKey) ?? '{}') ?? {
    room: undefined,
    username: undefined,
  }),
  register(username: string, room: string) {
    state.username = username;
    state.room = room;
  },
});

subscribe(state, () => {
  localStorage.setItem(statePersistenceKey, JSON.stringify(state));
});
