import { proxy, subscribe } from 'valtio';

const statePersistenceKey = 'state';

type State = {
  room?: string;
  username?: string;
  topic?: string;
  register(username: string, room: string): void;
  setTopic(topic: string): void;
  setRoom(room: string): void;
};

export const state = proxy<State>({
  ...(JSON.parse(localStorage.getItem(statePersistenceKey) ?? '{}') ?? {
    room: undefined,
    username: undefined,
    topic: undefined,
  }),
  register(username: string, room: string) {
    state.username = username;
    state.room = room;
  },
  setTopic(topic: string) {
    state.topic = topic;
  },
  setRoom(room: string) {
    state.room = room;
  },
});

subscribe(state, () => {
  localStorage.setItem(statePersistenceKey, JSON.stringify(state));
});
