import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import {
  Character,
  ChoiceList,
  ChoiceStep,
  CC_EVENT_CHARACTER_UPDATED,
  CC_EVENT_READY_FOR_NEXT_STEP,
  CC_EVENT_CHOICES_LIST,
  CC_EVENT_START,
  CC_EVENT_SELECT_CHOICE,
  CC_EVENT_GET_CHOICES,
  Kingdom,
} from '@dungeon-maister/data-models';
import { SelectKingdom } from './steps/SelectKingdom';

interface CharacterCreationWizardProps {
  socket: Socket;
}

export function CharacterCreationWizard({ socket }: CharacterCreationWizardProps) {
  const [step, setStep] = useState<ChoiceStep | 'start' | 'complete'>('start');
  const [character, setCharacter] = useState<Character | null>(null);
  const [choices, setChoices] = useState<ChoiceList>([]);

  useEffect(() => {
    // Listen for updates from the backend
    socket.on(CC_EVENT_CHARACTER_UPDATED, ({ character: updatedCharacter }) => {
      setCharacter(updatedCharacter);
    });

    socket.on(CC_EVENT_READY_FOR_NEXT_STEP, ({ nextStep }) => {
      setStep(nextStep);
      // Clear previous choices and request new ones
      setChoices([]);
      if (nextStep !== 'complete') {
        socket.emit(CC_EVENT_GET_CHOICES, { step: nextStep });
      }
    });

    socket.on(CC_EVENT_CHOICES_LIST, ({ choices: newChoices }) => {
      setChoices(newChoices);
    });

    // Clean up listeners on component unmount
    return () => {
      socket.off(CC_EVENT_CHARACTER_UPDATED);
      socket.off(CC_EVENT_READY_FOR_NEXT_STEP);
      socket.off(CC_EVENT_CHOICES_LIST);
    };
  }, [socket]);

  const handleStart = () => {
    // In a real app, we'd get the player's desired name and a unique ID
    const characterId = `char-${Date.now()}`;
    const name = 'New Adventurer';
    socket.emit(CC_EVENT_START, { characterId, name });
  };

  if (step === 'start') {
    return (
      <div>
        <h1>Welcome to Dungeon mAIster</h1>
        <p>A new adventure awaits. Let's create your character.</p>
        <button onClick={handleStart}>Begin</button>
      </div>
    );
  }

  if (step === 'complete') {
    return (
        <div>
            <h1>Character Creation Complete!</h1>
            <p>Waiting for the game to start...</p>
        </div>
    );
  }

  const handleSelect = (choiceId: string) => {
    if (!character) return;
    socket.emit(CC_EVENT_SELECT_CHOICE, {
      characterId: character.id,
      step: step as ChoiceStep,
      choiceId: choiceId,
    });
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'kingdom':
        return <SelectKingdom kingdoms={choices as Kingdom[]} onSelect={handleSelect} />;
      // Other steps would be rendered here in other cases
      default:
        return <p>Loading {step}...</p>;
    }
  };

  return (
    <div style={{width: '80%', maxWidth: '1000px'}}>
      {renderCurrentStep()}
      <hr style={{margin: '32px 0'}}/>
      <div>
        <h3>Character Sheet Preview</h3>
        <pre style={{backgroundColor: '#222', padding: '16px', borderRadius: '4px'}}>
          {JSON.stringify(character, null, 2)}
        </pre>
      </div>
    </div>
  );
}
