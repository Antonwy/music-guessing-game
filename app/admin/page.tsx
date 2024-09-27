"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createRoom, startRound } from "@/lib/rooms";
import { useSongsOfRound } from "@/lib/songs";
import { SpotifyTrackDetail } from "@/lib/spotify";
import { state } from "@/lib/state";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import Image from "next/image";

export default function Page() {
  const [topic, setTopic] = useState("");
  const { topic: submittedTopic, room } = useSnapshot(state);

  const songs = useSongsOfRound(room, submittedTopic);

  console.log("Songs:", songs);

  const handleCreateRoomClick = async () => {
    const roomCode = await createRoom();

    if (!roomCode) {
      return;
    }

    state.setRoom(roomCode);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };

  const handleNewRoundClick = async () => {
    if (!topic || !room) {
      return;
    }

    console.log("Starting new round with topic:", topic);

    startRound(room!, topic);
    state.setTopic(topic);
  };

  return (
    <section className="p-4 flex gap-2 flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Create a room</CardTitle>
        </CardHeader>
        <CardContent>
          Create a new room for the music guessing game and share this room code
          with friends.
          {room && <div>Room Code: {room}</div>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateRoomClick} disabled={!!room}>
            Create Room
          </Button>
        </CardFooter>
      </Card>

      {room && (
        <Card>
          <CardHeader>
            <CardTitle>Begin the next round</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Start the next round of the game by entering a new topic for music
              and clicking &quot;Begin round&quot;.
            </p>
            <p>
              Topics could be anything from &quot;Main Character Vibes&quot; to
              &quot;Love Song&quot; to &quot;Looking out the window during a
              train ride&quot;. Be creative!
            </p>
            <p>
              Be careful this will end the current round and all already
              submitted songs.
            </p>
            <Input
              placeholder="Topic for the songs"
              value={topic}
              onChange={handleTopicChange}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleNewRoundClick}>
              Begin round &quot;{topic}&quot;
            </Button>
          </CardFooter>
        </Card>
      )}

      {topic && (
        <Card>
          <CardHeader>
            <CardTitle>
              Submitted Songs for Round &quot;{submittedTopic}&quot;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Below you will find a list of submitted songs for the topic &quot;
              {submittedTopic}&quot;.
            </p>
            <ul>
              {songs.map((song, index) => (
                <SongPreview
                  key={song.songId}
                  song={song}
                  index={index}
                  user="leon"
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

type SongPreviewProps = {
  song: SpotifyTrackDetail;
  index: number;
  user: string;
};

const SongPreview: FC<SongPreviewProps> = ({ song, index, user }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const isPlayable = song.previewUrl != "";

  return (
    <li key={index} className={`p-2 border-b`}>
      <div className="flex items-center space-x-4">
        <Button
          asChild
          variant="ghost"
          onClick={handlePlayPause}
          className="p-0"
        >
          <div className="relative">
            <Image
              src={song.thumbnailUrl}
              alt={`${song.name} thumbnail`}
              width={48}
              height={48}
              className="object-cover rounded-full"
            />
            <div
              className={`absolute bg-black bg-opacity-60 rounded-full w-12 h-12 flex items-center justify-center ${
                isPlayable ? "hidden" : ""
              }`}
            >
              <XIcon className="w-8 h-8 text-white" />
            </div>
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center ${
                !isPlayable ? "hidden" : ""
              }`}
            >
              {!isPlaying ? (
                <PlayIcon className="w-8 h-8 text-white" />
              ) : (
                <PauseIcon className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        </Button>
        <div className="space-y-2">
          <p className="truncate w-[500px] text-xl font-semibold">
            {song.name}
          </p>
          <p className="truncate w-[450px]">{song.artist}</p>
        </div>
        <audio ref={audioRef} controls className="hidden">
          <source src={song.previewUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </li>
  );
};
