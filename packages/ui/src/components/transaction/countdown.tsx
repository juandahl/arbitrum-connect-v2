import { intervalToDuration, addDays, formatDuration } from "date-fns";

interface CountdownProps {
    startTimestamp: number | undefined;
    daysToAdd: number; 
}

function calculateTimeRemaining(timestamp: number, daysToAdd: number): string | null {
 const endDate = addDays(timestamp, daysToAdd);
 const now = Date.now();

 if (now >= endDate.getTime()) {
     return null;
 }

 const duration = intervalToDuration({ start: now, end: endDate });
 return formatDuration(duration, { delimiter: ", " });
}

export function Countdown({ startTimestamp, daysToAdd }: CountdownProps) {
    if (!startTimestamp) return null;

    const timeRemaining = calculateTimeRemaining(startTimestamp, daysToAdd);

    return (
        <div className="text-sm text-gray-600">
            {timeRemaining ? (
                <p>Time remaining: {timeRemaining}</p>
            ) : (
                <p className="text-green-500">Time to claim!</p>
            )}
        </div>
    );
}
