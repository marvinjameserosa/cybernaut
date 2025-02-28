'use client';
import { useState, useEffect } from 'react';
import ChallengeDisplay from '@/components/challenges/ChallengeDisplay';
import Terminal from '@/components/challenges/Terminal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

export default function ClassicalCipherChallenge() {
  const [decodedMessage, setDecodedMessage] = useState('');
  const [caesarShift, setCaesarShift] = useState(3);
  const [cipherText, setCipherText] = useState('FVOREQDXW-RULJLQ');
  const [vigenereKey, setVigenereKey] = useState('KEY');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [scanlineEffect, setScanlineEffect] = useState(false);
  const [flickerEffect, setFlickerEffect] = useState(false);
  const [dataCorruption, setDataCorruption] = useState(false);
  const [activeCipher, setActiveCipher] = useState<'caesar' | 'vigenere'>('caesar');

  useEffect(() => {
    // Initialize terminal with startup sequence
    const startupSequence = [
      '> Initializing Ghost Protocol terminal...',
      '> Establishing encrypted connection...',
      '> WARNING: System integrity compromised',
      '> Accessing restricted archives...',
      '> Phantom protocol activated',
      '> Ready for decryption sequence',
    ];

    let timeout = 0;
    startupSequence.forEach((line) => {
      timeout += Math.random() * 300 + 100;
      setTimeout(() => {
        setTerminalHistory((prev) => [...prev, line]);
      }, timeout);
    });

    // Trigger random glitch effects
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150 + Math.random() * 200);
    }, 2000 + Math.random() * 1000);

    // Trigger scanline effect
    const scanlineInterval = setInterval(() => {
      setScanlineEffect(true);
      setTimeout(() => setScanlineEffect(false), 2000);
    }, 5000);

    // Trigger flicker effect
    const flickerInterval = setInterval(() => {
      setFlickerEffect(true);
      setTimeout(() => setFlickerEffect(false), 80 + Math.random() * 50);
    }, 3000 + Math.random() * 2000);

    // Trigger data corruption effect
    const corruptionInterval = setInterval(() => {
      setDataCorruption(true);
      setTimeout(() => setDataCorruption(false), 120);
    }, 4000 + Math.random() * 3000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanlineInterval);
      clearInterval(flickerInterval);
      clearInterval(corruptionInterval);
    };
  }, []);

  const applyCaesarShift = (text: string, shift: number) => {
    return text
      .split('')
      .map((char) => {
        if (/[A-Z]/i.test(char)) {
          const code = char.charCodeAt(0);
          const isUpperCase = char === char.toUpperCase();
          const offset = isUpperCase ? 65 : 97;
          return String.fromCharCode(((code - offset + shift + 26) % 26) + offset);
        }
        return char;
      })
      .join('');
  };

  const applyVigenereCipher = (text: string, key: string) => {
    return text
      .split('')
      .map((char, index) => {
        if (/[A-Z]/i.test(char)) {
          const code = char.charCodeAt(0);
          const isUpperCase = char === char.toUpperCase();
          const offset = isUpperCase ? 65 : 97;
          const keyChar = key[index % key.length].toUpperCase();
          const keyShift = keyChar.charCodeAt(0) - 65;
          return String.fromCharCode(((code - offset - keyShift + 26) % 26) + offset);
        }
        return char;
      })
      .join('');
  };

  const handleDecodeAttempt = () => {
    setTerminalHistory((prev) => [
      ...prev,
      `> Attempting decryption with ${activeCipher === 'caesar' ? `shift key: ${caesarShift}` : `key: ${vigenereKey}`}`,
    ]);

    setGlitchEffect(true);
    setDataCorruption(true);

    setTimeout(() => {
      setGlitchEffect(false);
      setDataCorruption(false);
      const decoded = activeCipher === 'caesar'
        ? applyCaesarShift(cipherText, 26 - caesarShift)
        : applyVigenereCipher(cipherText, vigenereKey);
      setDecodedMessage(decoded);
      setTerminalHistory((prev) => [...prev, '> Decryption attempt complete']);

      if (Math.random() > 0.7) {
        setTimeout(() => {
          setTerminalHistory((prev) => [
            ...prev,
            `> WARNING: Memory sector ${Math.floor(Math.random() * 999)} integrity failing`,
          ]);
        }, 600);
      }
    }, 600);
  };

  const handleSubmit = async (flag: string) => {
    setTerminalHistory((prev) => [...prev, `> Validating flag: ${flag}`]);
    setGlitchEffect(true);

    const isCorrect = flag.trim().toUpperCase() === 'CYBERNAUT-ORIGIN';

    setTimeout(() => {
      setGlitchEffect(false);
      if (isCorrect) {
        setTerminalHistory((prev) => [
          ...prev,
          '> FLAG ACCEPTED. Access granted to restricted archives.',
        ]);
        setTerminalHistory((prev) => [
          ...prev,
          '> Initiating secure connection to mainframe...',
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          '> FLAG REJECTED. Security protocols engaged.',
        ]);
        setTerminalHistory((prev) => [
          ...prev,
          '> Access attempt logged. Tracing connection...',
        ]);
      }
    }, 800);

    return isCorrect;
  };

  const renderGlitchedText = (text: string) => {
    return text.split('').map((char, i) => {
      const shouldGlitch = glitchEffect && Math.random() > 0.7;
      const shouldDisplace = glitchEffect && Math.random() > 0.9;
      const shouldReplace = dataCorruption && Math.random() > 0.9;

      const glitchChar = shouldReplace
        ? String.fromCharCode(Math.floor(Math.random() * 26) + 65)
        : char;

      return (
        <span
          key={i}
          className={`inline-block transition-all duration-75 ${
            shouldGlitch
              ? 'opacity-0'
              : flickerEffect && Math.random() > 0.8
              ? 'opacity-60'
              : ''
          }`}
          style={{
            transform: shouldDisplace
              ? `translateY(${Math.random() > 0.5 ? -2 : 2}px)`
              : 'none',
            color: dataCorruption && Math.random() > 0.9 ? '#ff2d6a' : '',
          }}
        >
          {glitchChar}
        </span>
      );
    });
  };

  const challengeContent = (
    <div
      className={`space-y-6 relative max-w-3xl mx-auto ${
        flickerEffect ? 'opacity-95' : ''
      }`}
    >
      {/* Decorative elements - monochrome noise patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -z-10"></div>

      {/* Glitch overlay */}
      {glitchEffect && (
        <div className="absolute inset-0 bg-transparent z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-0 w-full h-1 bg-white/20"
            style={{ transform: `translateY(${Math.random() * 10}px)` }}
          ></div>
          <div
            className="absolute top-2/3 left-0 w-full h-px bg-white/20"
            style={{ transform: `translateY(${Math.random() * 10}px)` }}
          ></div>
          <div
            className="absolute top-1/2 left-0 w-1/3 h-px bg-white/30"
            style={{ transform: `translateX(${Math.random() * 100}px)` }}
          ></div>
        </div>
      )}

      {/* Data corruption effect */}
      {dataCorruption && (
        <div className="absolute inset-0 bg-transparent z-20 overflow-hidden pointer-events-none">
          <div
            className="absolute w-full h-8 bg-white/5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `-${Math.random() * 10}%`,
            }}
          ></div>
          <div
            className="absolute h-full w-1 bg-white/10"
            style={{ left: `${Math.random() * 100}%` }}
          ></div>
        </div>
      )}

      {/* Scanline effect */}
      {scanlineEffect && (
        <div className="absolute inset-0 bg-transparent z-10 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-white/5"
              style={{ top: `${i * 2.5}%` }}
            ></div>
          ))}
        </div>
      )}

      <div
        className={`bg-black border border-zinc-900 rounded-md p-5 backdrop-blur-sm relative overflow-hidden shadow-lg ${
          flickerEffect ? 'brightness-110' : ''
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/10 via-white/50 to-white/10"></div>
        <h3 className="text-lg font-bold text-white mb-3">Mission Briefing</h3>
        <p className="text-zinc-400 leading-relaxed">
          We&apos;ve intercepted an encrypted communication from the early days of the Cybernaut
          program. It appears to be encrypted using a classical cipher from the pre-quantum era.
          Decrypt the message to reveal the origin program name.
        </p>
        <p className="text-white/60 text-sm mt-2 italic">
          Warning: This data is classified. Unauthorized access will be traced and prosecuted.
        </p>
      </div>

      <Terminal className="h-64 border border-zinc-900 bg-black shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-md overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-white/10"></div>
        <div className="flex items-center gap-1 mb-3 opacity-70">
          <div className="w-2 h-2 rounded-full bg-white/70"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/30"></div>
          <span className="text-xs text-gray-600 ml-2">phantom-terminal</span>
        </div>

        {terminalHistory.map((line, index) => (
          <div
            key={index}
            className={`text-${
              line.includes('WARNING') ? 'red-500' : 'gray-400'
            } text-sm font-mono pb-1 opacity-80`}
          >
            {glitchEffect && Math.random() > 0.9
              ? line
                  .split('')
                  .map((char) =>
                    Math.random() > 0.8
                      ? String.fromCharCode(Math.floor(Math.random() * 26) + 65)
                      : char
                  )
                  .join('')
              : line}
          </div>
        ))}

        <div className="text-white/80 mt-2">Intercepted message:</div>
        <div className="text-white font-bold text-lg my-2 font-mono tracking-wider">
          {renderGlitchedText(cipherText)}
        </div>
        <div className="text-white/80">Analysis complete. Probable encryption: {activeCipher === 'caesar' ? 'Caesar cipher' : 'Vigenère cipher'}</div>
        <div className="text-white/80">
          Required key: <span className="text-white/90">[UNKNOWN]</span>
        </div>
        <div className={`text-white/90 ${flickerEffect ? 'animate-pulse' : ''}`}>
          Warning: Terminal access limited. Manual decryption required.
        </div>
      </Terminal>

      <Tabs defaultValue="decoder" className="mt-4">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-950 border border-zinc-900">
          <TabsTrigger
            value="decoder"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            Decoder Tool
          </TabsTrigger>
          <TabsTrigger
            value="reference"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            Cipher Reference
          </TabsTrigger>
        </TabsList>

        <TabsContent value="decoder">
          <Card className="border border-zinc-900 bg-black backdrop-blur-sm p-5 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="text-white/90 block mb-2 font-medium">Cipher:</label>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setActiveCipher('caesar')}
                    className={`${
                      activeCipher === 'caesar' ? 'bg-zinc-900' : 'bg-zinc-950'
                    } text-white border border-zinc-800`}
                  >
                    Caesar
                  </Button>
                  <Button
                    onClick={() => setActiveCipher('vigenere')}
                    className={`${
                      activeCipher === 'vigenere' ? 'bg-zinc-900' : 'bg-zinc-950'
                    } text-white border border-zinc-800`}
                  >
                    Vigenère
                  </Button>
                </div>
              </div>

              {activeCipher === 'caesar' ? (
                <div>
                  <label className="text-white/90 block mb-2 font-medium">Caesar Shift:</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[caesarShift]}
                        min={1}
                        max={25}
                        step={1}
                        onValueChange={(value) => setCaesarShift(value[0])}
                        className="flex-1"
                      />
                      <div className="w-12 h-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded text-white font-mono">
                        {caesarShift}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-white/90 block mb-2 font-medium">Vigenère Key:</label>
                  <Input
                    value={vigenereKey}
                    onChange={(e) => setVigenereKey(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              )}

              <Button
                onClick={handleDecodeAttempt}
                className="bg-gradient-to-r from-zinc-900 to-black hover:from-black hover:to-zinc-900 text-white border border-zinc-800 shadow-lg shadow-black/50 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_ease-in-out]"></span>
                <span className="relative flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Decrypt Message
                </span>
              </Button>

              {decodedMessage && (
                <div className="mt-4 p-4 bg-zinc-950 border border-zinc-900 rounded-md shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <div className="text-white/90 mb-2 font-medium">Decrypted Output:</div>
                  <div className="text-zinc-300 font-mono tracking-wide">
                    {renderGlitchedText(decodedMessage)}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reference">
          <Card className="border border-zinc-900 bg-black backdrop-blur-sm p-5 shadow-lg">
            <div className="space-y-4 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl -z-10"></div>

              <h4 className="text-lg font-medium text-white/90 border-b border-zinc-900 pb-2">
                {activeCipher === 'caesar' ? 'Caesar Cipher' : 'Vigenère Cipher'}
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                {activeCipher === 'caesar'
                  ? 'The Caesar cipher is one of the earliest known encryption techniques from the pre-digital era. It works by shifting each letter in the plaintext a certain number of places down the alphabet.'
                  : 'The Vigenère cipher is a method of encrypting alphabetic text by using a simple form of polyalphabetic substitution. It uses a keyword to determine the shift for each letter, making it more secure than the Caesar cipher.'}
              </p>

              <div className="font-mono text-sm text-zinc-500 border border-zinc-900 rounded p-3 bg-zinc-950 shadow-inner">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-white/80 mb-1">Encryption</div>
                    <div>{activeCipher === 'caesar' ? 'A → D' : 'A + KEY → K'}</div>
                    <div>{activeCipher === 'caesar' ? 'B → E' : 'B + KEY → L'}</div>
                    <div>{activeCipher === 'caesar' ? 'C → F' : 'C + KEY → M'}</div>
                    <div className="text-zinc-700">...</div>
                    <div>{activeCipher === 'caesar' ? 'Z → C' : 'Z + KEY → J'}</div>
                  </div>
                  <div>
                    <div className="text-white/80 mb-1">Decryption</div>
                    <div>{activeCipher === 'caesar' ? 'D → A' : 'K - KEY → A'}</div>
                    <div>{activeCipher === 'caesar' ? 'E → B' : 'L - KEY → B'}</div>
                    <div>{activeCipher === 'caesar' ? 'F → C' : 'M - KEY → C'}</div>
                    <div className="text-zinc-700">...</div>
                    <div>{activeCipher === 'caesar' ? 'C → Z' : 'J - KEY → Z'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-3 rounded text-sm">
                <div className="text-white/90 font-medium mb-1">Phantom Tip:</div>
                <p className="text-zinc-500">
                  {activeCipher === 'caesar'
                    ? 'For decryption, use a negative shift or subtract your shift value from 26. Example: To decrypt a shift of 3, use a decryption shift of 23 (26-3).'
                    : 'The Vigenère cipher is more secure than the Caesar cipher because it uses a keyword to determine the shift for each letter, making frequency analysis more difficult.'}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-8 px-4">
      {/* Static noise background overlay */}
      <div className="fixed inset-0 bg-black opacity-95 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.9)_70%)]"></div>
        {/* Static scanlines */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white/2"
            style={{ top: `${i * 1}%` }}
          ></div>
        ))}

        {/* Random digital noise */}
        {dataCorruption &&
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-8 bg-white/5"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2,
              }}
            ></div>
          ))}
      </div>

      <ChallengeDisplay
        id="crypto-classical-01"
        title="Decrypting the Origin"
        description="Break the classical encryption to reveal the original Cybernaut program name."
        difficulty="Easy"
        category="Cryptography"
        points={100}
        hints={[
          "The Caesar cipher works by shifting each letter by a fixed amount in the alphabet.",
          "Try different shift values between 1 and 25. The decrypted message should be readable English.",
          "The answer is the program name that's revealed after correct decryption.",
        ]}
        flagFormat="CYBERNAUT-XXXXXX"
        content={challengeContent}
        onSubmit={handleSubmit}
      />
    </div>
  );
}