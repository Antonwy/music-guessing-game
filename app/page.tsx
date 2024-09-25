'use client';

import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <section className="p-4 flex gap-2 flex-col">
      <h1 className="text-lg font-bold">Join Room</h1>
      <Button onClick={() => {}}>Create Room</Button>
    </section>
  );
}
