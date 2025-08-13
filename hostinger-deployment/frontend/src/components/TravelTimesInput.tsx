import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, X } from 'lucide-react';

interface TravelTime {
  destination: string;
  duration: string;
}

interface TravelTimesInputProps {
  travelTimes: TravelTime[];
  onTravelTimesChange: (travelTimes: TravelTime[]) => void;
}

const TravelTimesInput: React.FC<TravelTimesInputProps> = ({ travelTimes, onTravelTimesChange }) => {
  const [newDestination, setNewDestination] = useState('');
  const [newDuration, setNewDuration] = useState('');

  const handleAdd = () => {
    if (newDestination && newDuration) {
      onTravelTimesChange([...travelTimes, { destination: newDestination, duration: newDuration }]);
      setNewDestination('');
      setNewDuration('');
    }
  };

  const handleRemove = (index: number) => {
    const newTimes = [...travelTimes];
    newTimes.splice(index, 1);
    onTravelTimesChange(newTimes);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Destination"
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Duration (e.g., 15 mins)"
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="outline"
          className="px-3"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {travelTimes.map((time, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
            <span className="flex-1">{time.destination}</span>
            <span className="flex-1">{time.duration}</span>
            <Button
              type="button"
              onClick={() => handleRemove(index)}
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelTimesInput; 