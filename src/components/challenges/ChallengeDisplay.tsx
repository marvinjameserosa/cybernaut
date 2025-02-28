// src/components/challenges/ChallengeDisplay.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Skull, Lock, Zap, Code } from 'lucide-react';
import Terminal from '@/components/challenges/Terminal';

interface ChallengeProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: string;
  points: number;
  hints: string[];
  flagFormat: string;
  content: React.ReactNode;
  onSubmit: (flag: string) => Promise<boolean>;
}

export default function ChallengeDisplay({
  id,
  title,
  description,
  difficulty,
  category,
  points,
  hints,
  flagFormat,
  content,
  onSubmit,
}: ChallengeProps) {
  const [activeTab, setActiveTab] = useState('challenge');
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [currentHint, setCurrentHint] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [scanlines, setScanlines] = useState(true);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, []);

  // Glitch effect on component mount and periodically
  useEffect(() => {
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 500);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 300);
      }
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    setGlitchEffect(true);

    try {
      const success = await onSubmit(flag);
      setResult(success ? 'success' : 'error');
    } catch {
      setResult('error');
    } finally {
      setSubmitting(false);
      setTimeout(() => setGlitchEffect(false), 500);
    }
  };

  const difficultyColor = {
    Easy: 'bg-gray-950 border-gray-800 text-gray-500',
    Medium: 'bg-gray-950 border-gray-800 text-gray-500',
    Hard: 'bg-gray-950 border-gray-800 text-gray-500',
    Expert: 'bg-gray-950 border-gray-800 text-gray-500',
  };

  const difficultyIcon = {
    Easy: <></>,
    Medium: <></>,
    Hard: <Zap className="w-3 h-3 mr-1" />,
    Expert: <Skull className="w-3 h-3 mr-1" />,
  };

  // Tab handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 300);
  };

  return (
    <div className="container max-w-4xl py-8 relative">
      {/* Matrix-like code rain background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
        <div className="matrix-code"></div>
      </div>

      {/* Scanlines overlay */}
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-15 z-10"></div>
      )}

      <motion.div
        animate={{
          x: glitchEffect ? [0, -5, 5, -2, 0] : 0,
          opacity: glitchEffect ? [1, 0.8, 0.9, 0.7, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-gray-900/80 bg-black shadow-xl relative overflow-hidden">
          {/* Terminal-like header */}
          <div className="absolute top-0 left-0 w-full h-8 bg-black border-b border-gray-900/80 flex items-center px-4">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-gray-900"></div>
              <div className="w-3 h-3 rounded-full bg-gray-900"></div>
              <div className="w-3 h-3 rounded-full bg-gray-900"></div>
            </div>
            <div className="text-gray-500 font-mono text-xs flex-1 text-center">
              /sys/secured/challenges/{id.substring(0, 6)}.xpl
            </div>
            <div className="text-gray-500 font-mono text-xs">
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          <CardHeader className="border-b border-gray-900/50 bg-black pt-12 pb-4 relative">
            <div className="absolute top-8 left-0 w-full h-px bg-gradient-to-r from-gray-800/0 via-gray-700/50 to-gray-800/0"></div>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <Code className="w-5 h-5 mr-2 text-gray-500" />
                  <CardTitle className="text-3xl font-bold font-mono text-gray-400">{title}</CardTitle>
                  <span className={`ml-2 ${cursorBlink ? 'opacity-100' : 'opacity-0'} text-gray-500 transition-opacity`}>▋</span>
                </div>
                <CardDescription className="text-gray-600 mt-2 font-mono text-sm">
                  {description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border border-gray-800 bg-black text-gray-400 font-mono">
                  {category}
                </Badge>
                <Badge className={`border flex items-center ${difficultyColor[difficulty]}`}>
                  {difficultyIcon[difficulty]} {difficulty}
                </Badge>
                <Badge variant="outline" className="border border-gray-800 bg-black text-gray-500 font-mono">
                  <Zap className="w-3 h-3 mr-1" /> {points} pts
                </Badge>
              </div>
            </div>
          </CardHeader>

          {/* Custom Terminal-style Tabs */}
          <div className="px-4 pt-2 bg-black">
            <div className="flex border-b border-gray-900/30 text-xs font-mono">
              <button
                onClick={() => handleTabChange('challenge')}
                className={`px-4 py-2 transition-colors flex items-center ${
                  activeTab === 'challenge'
                    ? 'text-gray-400 border-b-2 border-gray-600'
                    : 'text-gray-800 hover:text-gray-600'
                }`}
              >
                <span className="mr-1 text-gray-600">[0]</span> EXECUTE
              </button>
              <button
                onClick={() => handleTabChange('hints')}
                className={`px-4 py-2 transition-colors flex items-center ${
                  activeTab === 'hints'
                    ? 'text-gray-400 border-b-2 border-gray-600'
                    : 'text-gray-800 hover:text-gray-600'
                }`}
              >
                <span className="mr-1 text-gray-600">[1]</span> INTEL
              </button>
              <button
                onClick={() => handleTabChange('solution')}
                className={`px-4 py-2 transition-colors flex items-center ${
                  activeTab === 'solution'
                    ? 'text-gray-400 border-b-2 border-gray-600'
                    : 'text-gray-800 hover:text-gray-600'
                }`}
              >
                <span className="mr-1 text-gray-600">[2]</span> SUBMIT
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'challenge' && (
                  <div className="py-4">
                    <div className="bg-black border border-gray-900/50 rounded p-4">
                      <div className="min-h-64 text-gray-400 font-mono text-sm">
                        <div className="mb-2 text-gray-600"># Challenge Specifications</div>
                        {content}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'hints' && (
                  <div className="py-4">
                    <div className="bg-black border border-gray-900/50 rounded p-4">
                      <div className="min-h-64 flex flex-col gap-4">
                        <div className="text-gray-500 text-xs bg-gray-950/20 p-3 rounded border border-gray-900/30 flex items-start">
                          <AlertCircle className="inline-block w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          <div className="font-mono">
                            <span className="text-gray-400 font-bold">WARNING:</span> Intel access reduces reward by 15%. Proceed?
                          </div>
                        </div>

                        {showHint ? (
                          <div className="bg-black border border-gray-900/50 rounded-md p-4 text-gray-400 font-mono text-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-800/40"></div>
                            <div className="absolute top-0 left-0 w-0.5 h-full bg-gray-800/40"></div>
                            <div className="text-gray-600 mb-2"># Intel Package #{currentHint + 1}</div>
                            {hints[currentHint]}
                          </div>
                        ) : (
                          <Button
                            onClick={() => setShowHint(true)}
                            variant="outline"
                            className="border-gray-900 bg-black text-gray-500 hover:bg-gray-950/30 font-mono group relative overflow-hidden"
                          >
                            <Lock className="w-4 h-4 mr-2 group-hover:hidden" />
                            <span className="group-hover:hidden">ENCRYPTED_DATA</span>
                            <span className="hidden group-hover:inline">DECRYPT_INTEL</span>
                            <span className="ml-2 text-xs">({currentHint + 1}/{hints.length})</span>
                          </Button>
                        )}

                        {showHint && currentHint < hints.length - 1 && (
                          <Button
                            onClick={() => {
                              setCurrentHint(currentHint + 1);
                              setShowHint(false);
                            }}
                            variant="outline"
                            className="border-gray-900 bg-black text-gray-500 hover:bg-gray-950/30 font-mono self-start mt-2"
                          >
                            NEXT_INTEL_PACKAGE
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'solution' && (
                  <div className="py-4">
                    <div className="bg-black border border-gray-900/50 rounded p-4">
                      <div className="min-h-64 flex flex-col gap-4">
                        <Terminal className="h-40 mb-4 bg-black border border-gray-900">
                          <div className="text-gray-600 font-mono">
                            root@matrix:~# ssh -i key.pem secure@{id.substring(0, 8)}.node
                          </div>
                          <div className="text-gray-500 font-mono">
                            [CONNECTION] Establishing secure shell to target system...
                          </div>
                          <div className="text-gray-500 font-mono">
                            [AUTHENTICATION] Challenge verification required.
                          </div>
                          <div className="text-gray-500 font-mono">
                            Expected format: {flagFormat}
                          </div>
                          <div className="text-gray-400 font-mono flex">
                            <span>root@{id.substring(0, 8)}:/# </span>
                            <span className={`${cursorBlink ? 'opacity-100' : 'opacity-0'} transition-opacity`}>▋</span>
                          </div>
                        </Terminal>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              value={flag}
                              onChange={(e) => setFlag(e.target.value)}
                              placeholder={flagFormat}
                              className="bg-black border-gray-900 text-gray-400 placeholder:text-gray-900 font-mono pl-3"
                            />
                            <div className="absolute left-0 top-0 h-full w-1 bg-gray-800"></div>
                          </div>
                          <Button
                            onClick={handleSubmit}
                            disabled={submitting || !flag.trim()}
                            className="bg-gray-950 border border-gray-800 hover:bg-gray-900 text-gray-400 font-bold font-mono relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                            {submitting ? (
                              <>
                                <Clock className="mr-2 h-4 w-4 animate-spin" /> PROCESSING
                              </>
                            ) : (
                              <>INJECT</>
                            )}
                          </Button>
                        </div>

                        <AnimatePresence>
                          {result && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`p-4 rounded-md relative overflow-hidden font-mono text-sm ${
                                result === 'success'
                                  ? 'bg-gray-950/30 border border-gray-900 text-gray-400'
                                  : 'bg-gray-950/30 border border-gray-900 text-gray-400'
                              }`}
                            >
                              <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
                              {result === 'success' ? (
                                <div>
                                  <div className="flex items-center">
                                    <CheckCircle className="mr-2 h-5 w-5 text-gray-500" />
                                    <p className="font-bold">ACCESS GRANTED</p>
                                  </div>
                                  <div className="mt-2 text-gray-500">
                                    <div>root@{id.substring(0, 8)}:/# cat /etc/shadow</div>
                                    <div>Executing privilege escalation...</div>
                                    <div>System breach successful. {points} data fragments recovered.</div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center">
                                    <AlertCircle className="mr-2 h-5 w-5 text-gray-500" />
                                    <p className="font-bold">ACCESS DENIED</p>
                                  </div>
                                  <div className="mt-2 text-gray-500">
                                    <div>root@{id.substring(0, 8)}:/# Authentication failed</div>
                                    <div>Intrusion detected. Countermeasures deployed.</div>
                                    <div>Verify credentials format and retry.</div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <CardFooter className="border-t border-gray-900/50 bg-black p-4 text-xs text-gray-700 font-mono flex justify-between">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full ${cursorBlink ? 'bg-gray-500' : 'bg-gray-900'} mr-2`}></span>
              <span>SYSTEM:{id} • OPERATOR:0xDEADBEEF</span>
            </div>
            <button
              onClick={() => setScanlines(!scanlines)}
              className="text-gray-800 hover:text-gray-600"
            >
              [TOGGLE_CRT]
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}