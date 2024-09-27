'use client';

import { AccessToken } from '@spotify/web-api-ts-sdk';
import { proxy, subscribe } from 'valtio';

const statePersistenceKey = 'state';

type State = {
  room?: string;
  username?: string;
  topic?: string;
  accessToken?: AccessToken;
  register(username: string, room: string): void;
  setTopic(topic: string): void;
  setRoom(room: string): void;
  setAccessToken(accessToken: AccessToken): void;
};

const safeLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage;
  }

  return {
    getItem: () => null,
    setItem: () => null,
  };
};

export const state = proxy<State>({
  ...(JSON.parse(safeLocalStorage().getItem(statePersistenceKey) ?? '{}') ?? {
    room: undefined,
    username: undefined,
    topic: undefined,
    accessToken: undefined,
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
  setAccessToken(accessToken: AccessToken) {
    state.accessToken = accessToken;
  }
});

subscribe(state, () => {
  safeLocalStorage().setItem(statePersistenceKey, JSON.stringify(state));
});
