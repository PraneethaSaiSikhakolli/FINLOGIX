import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaStop, FaTrash, FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import API from '../services/axiosInstance';

interface Props {
  transactionId: number;
  existingUrl?: string;
  onUpload: () => void;
  onDelete: () => void;
}

const AudioRecorder: React.FC<Props> = ({ transactionId, existingUrl, onUpload, onDelete }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasServerAudio, setHasServerAudio] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showBox, setShowBox] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);

  // ✅ HEAD request to verify file exists
  useEffect(() => {
    const checkFileExists = async () => {
      if (!existingUrl) return;
      try {
        const res = await fetch(existingUrl, { method: 'HEAD' });
        if (res.ok) {
          setHasServerAudio(true);
          setAudioUrl(existingUrl);
        } else {
          setHasServerAudio(false);
        }
      } catch {
        setHasServerAudio(false);
      }
    };
    checkFileExists();
  }, [existingUrl]);

  const formatTime = (s: number) =>
    isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url); // local preview

        const formData = new FormData();
        formData.append('audio', blob, `${transactionId}.webm`);
        try {
          const res = await API.post(`/audio/upload/${transactionId}`, formData);
          toast.success('Upload success');
          setAudioUrl(res.data.url);
          setHasServerAudio(true);
          onUpload();
        } catch (err) {
          toast.error('❌ Upload failed');
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch {
      toast.error('🎤 Mic permission denied');
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
    setMediaRecorder(null);
  };

  const playPause = () => {
    if (!audioUrl) {
      toast.error('No audio available');
      return;
    }
    setShowBox(true);
  };

  useEffect(() => {
    if (showBox && audioRef.current && !isPlaying) {
      const audio = audioRef.current;
      audio.volume = volume;

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          rafRef.current = requestAnimationFrame(updateProgress);
        })
        .catch(err => {
          toast.error('Playback failed');
        });
    }
  }, [showBox, audioUrl]);

  const updateProgress = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      setAudioUrl(null);
      setHasServerAudio(false);
      setShowBox(false);
      setIsPlaying(false);
    } catch {
      toast.error('Delete failed');
    } finally {
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4 border-gray-300 dark:border-gray-700">
      <div className="flex items-center gap-3">
        {recording ? (
          <button onClick={stopRecording} className="p-2 rounded-full bg-red-600 text-white" title="Stop">
            <FaStop />
          </button>
        ) : (
          <button onClick={startRecording} className="p-2 rounded-full bg-indigo-600 text-white" title="Record">
            <FaMicrophone />
          </button>
        )}

        {!recording && hasServerAudio && (
          <>
            <button onClick={playPause} className="p-2 rounded-full bg-green-600 text-white" title="Play">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 rounded-full bg-gray-600 text-white"
              title="Delete"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>

      {/* ▶️ Audio Playback UI */}
      <AnimatePresence>
        {audioUrl && showBox && !recording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 bg-indigo-50 border border-indigo-200 rounded p-3 shadow-inner space-y-2"
          >
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
              onLoadedMetadata={() => {
                const dur = audioRef.current?.duration;
                if (dur && isFinite(dur)) setDuration(dur);
              }}
              onEnded={() => {
                setIsPlaying(false);
                setCurrentTime(0);
                setShowBox(false);
                cancelAnimationFrame(rafRef.current!);
              }}
              hidden
            />

            {/* Fake waveform */}
            <motion.div className="flex items-end gap-[2px] h-8 mt-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-indigo-500 rounded"
                  animate={
                    isPlaying
                      ? { height: [10, 22, 14, 20, 18][Math.floor(Math.random() * 5)] }
                      : { height: 8 }
                  }
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              ))}
            </motion.div>

            {/* Progress & Volume */}
            {duration > 0 && (
              <>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={currentTime}
                  onChange={e => {
                    const t = parseFloat(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = t;
                    setCurrentTime(t);
                  }}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex items-center gap-2">
                    <FaVolumeUp className="text-indigo-600" />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={e => {
                        const v = parseFloat(e.target.value);
                        setVolume(v);
                        if (audioRef.current) audioRef.current.volume = v;
                      }}
                      className="w-24 accent-indigo-600"
                    />
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧨 Delete Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-sm w-full text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Delete Audio Memo</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete this recording?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioRecorder;
