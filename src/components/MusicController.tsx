"use client"
import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const MusicController = () => {
    const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [initialMusicPlay, setInitialMusicPlay] = useState<boolean>(false);
    // Audio setup on mount
    useEffect(() => {
        const audio = new Audio('/celestial-ambient.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        audio.preload = 'auto';
        setAudioElement(audio);

        return () => {
            if (audio) {
                audio.pause();
            }
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = () => {
            if (audioElement && !isMusicPlaying && initialMusicPlay === false) {
                const playPromise = audioElement.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsMusicPlaying(true);
                            setInitialMusicPlay(true);
                            window.removeEventListener('mousemove', handleMouseMove);
                        })
                        .catch((error: Error) => {
                            console.error('Error playing audio on mouse move:', error);
                        });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [audioElement, isMusicPlaying]);



    // Toggle music function with direct audio element reference
    const toggleMusic = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!audioElement) {
            console.error("Audio element not available");
            return;
        }

        try {
            if (isMusicPlaying) {
                audioElement.pause();
                setIsMusicPlaying(false);
            } else {
                // Play with user gesture
                const playPromise = audioElement.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsMusicPlaying(true);
                        })
                        .catch(err => {
                            console.error('Error playing audio:', err);
                        });
                }
            }
        } catch (err) {
            console.error("Error toggling music:", err);
        }
    };


    return (
        <Button
            onClick={toggleMusic}
            className="cursor-pointer fixed bottom-6 right-6 z-[9999] bg-slate-800/95 backdrop-blur-md py-5 rounded-full border border-white/10 text-white hover:bg-slate-700 transition-all shadow-lg flex items-center justify-center"
            aria-label={isMusicPlaying ? "Pause celestial ambient music" : "Play celestial ambient music"}
        >
            {isMusicPlaying ? (
                <Volume2 size={20} className="h-7 w-7" />
            ) : (
                <VolumeX size={20} className="h-7 w-7" />
            )}
        </Button>
    );
};

export default MusicController; 