import React from 'react';

interface RoomListProps {
  rooms: string[];
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  return (
    <ul>
      {rooms.map((room, index) => (
        <li key={index}>{room}</li>
      ))}
    </ul>
  );
};

export default RoomList;
