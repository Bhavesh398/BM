'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
}

export function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = (): TimeLeft => {
            const targetDate = new Date('2030-01-01T00:00:00');
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                return { years: 0, months: 0, days: 0, hours: 0, minutes: 0 };
            }

            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const hours = Math.floor((difference / 1000 / 60 / 60) % 24);
            const days = Math.floor(difference / 1000 / 60 / 60 / 24);

            // Calculate years and remaining months
            const years = Math.floor(days / 365);
            const remainingDays = days % 365;
            const months = Math.floor(remainingDays / 30);
            const finalDays = remainingDays % 30;

            return {
                years,
                months,
                days: finalDays,
                hours,
                minutes,
            };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second (even if we don't show seconds, we need to update minutes)
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        { value: timeLeft.years, label: 'Years' },
        { value: timeLeft.months, label: 'Months' },
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
    ];

    return (
        <div className="w-full flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8 md:mb-12 text-center"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide uppercase drop-shadow-lg">
                    Time to 2030
                </h2>
            </motion.div>

            <div className="flex flex-nowrap justify-center items-start w-full px-1">
                {timeUnits.map((unit, index) => (
                    <div key={unit.label} className="flex items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="text-[10vw] font-bold text-white font-sans leading-none tracking-tight drop-shadow-xl">
                                {String(unit.value).padStart(2, '0')}
                            </div>
                            <div className="text-[2vw] text-white/80 uppercase tracking-widest mt-[0.5vw] font-medium">
                                {unit.label}
                            </div>
                        </motion.div>

                        {index < timeUnits.length - 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="text-[8vw] font-light text-white/50 mx-[0.5vw] mt-[0.5vw]"
                            >
                                :
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-12"
            >
                <div className="text-lg md:text-xl font-bold text-white tracking-widest uppercase drop-shadow-md">
                    Join the Mission
                </div>
            </motion.div>
        </div>
    );
}
