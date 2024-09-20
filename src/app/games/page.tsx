"use client";

import Link from 'next/link';

export default function Games() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ul>
          <li>
            <Link href="/games/play?data=eyJuYW1lIjoiTmF1Z2h0cyBhbmQgQ3Jvc3NlcyIsImdyaWRTaXplIjozLCJ3aW5uaW5nU3RhdGVzIjpbNzMsMTQ2LDI5Miw3LDU2LDQ0OCwyNzMsODRdfQ%3D%3D">
              Play Naughts and Crosses
            </Link>
          </li>
        
        </ul>
      </main>
    </div>
  );
}