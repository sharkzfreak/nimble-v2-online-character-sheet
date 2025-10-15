import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LevelUpSummary } from "./LevelUpSummary";
import { LevelUpFeatureStep } from "./LevelUpFeatureStep";
import { LevelUpHPStep } from "./LevelUpHPStep";
import { LevelUpReview } from "./LevelUpReview";
import { getFeaturesBetweenLevels } from "@/config/classFeatures";
import { ClassFeature } from "@/config/classFeatures";

interface LevelUpWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: {
    id: string;
    level: number;
    class: string;
    str_mod: number;
    dex_mod: number;
    hp_max: number;
    hp_current: number;
    class_features: ClassFeature[];
  };
  onLevelUpComplete: (updates: any) => void;
}

interface LevelUpDraft {
  targetLevel: number;
  newFeatures: ClassFeature[];
  featureSelections: Record<string, string[]>;
  hpIncrease: number;
  hpCustomized: boolean;
  refillHP: boolean;
}

export const LevelUpWizard = ({ open, onOpenChange, character, onLevelUpComplete }: LevelUpWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<LevelUpDraft>({
    targetLevel: character.level + 1,
    newFeatures: [],
    featureSelections: {},
    hpIncrease: 0,
    hpCustomized: false,
    refillHP: true,
  });

  // Load new features when wizard opens
  useEffect(() => {
    if (open) {
      const targetLevel = character.level + 1;
      const newFeatures = getFeaturesBetweenLevels(character.class, character.level, targetLevel);
      
      // Calculate HP increase based on class
      const baseHPIncrease = 6 + character.str_mod; // Basic calculation, adjust per class
      
      setDraft({
        targetLevel,
        newFeatures,
        featureSelections: {},
        hpIncrease: baseHPIncrease,
        hpCustomized: false,
        refillHP: true,
      });
      setCurrentStep(0);
    }
  }, [open, character]);

  // Auto-save draft
  useEffect(() => {
    if (!open) return;
    
    const timer = setTimeout(() => {
      localStorage.setItem(`levelup_draft_${character.id}`, JSON.stringify(draft));
    }, 400);

    return () => clearTimeout(timer);
  }, [draft, character.id, open]);

  const steps = [
    { id: 'summary', title: 'Summary', component: LevelUpSummary },
    ...(draft.newFeatures.length > 0 ? [{ id: 'features', title: 'New Features', component: LevelUpFeatureStep }] : []),
    { id: 'hp', title: 'Hit Points', component: LevelUpHPStep },
    { id: 'review', title: 'Review', component: LevelUpReview },
  ];

  const validateCurrentStep = (): boolean => {
    const step = steps[currentStep];
    
    if (step.id === 'features') {
      // Check all required feature choices are made
      for (const feature of draft.newFeatures) {
        if (feature.requires_choice) {
          const selections = draft.featureSelections[feature.id] || [];
          const required = feature.choice_count || 1;
          if (selections.length !== required) {
            toast({
              title: "Incomplete Choices",
              description: `Please complete all feature selections for ${feature.name}`,
              variant: "destructive",
            });
            return false;
          }
        }
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApply = async () => {
    if (!validateCurrentStep()) return;

    // Prepare updates
    const updates = {
      level: draft.targetLevel,
      hp_max: character.hp_max + draft.hpIncrease,
      hp_current: draft.refillHP ? character.hp_max + draft.hpIncrease : character.hp_current,
      class_features: [
        ...character.class_features,
        ...draft.newFeatures.map(f => ({
          ...f,
          selection: draft.featureSelections[f.id] || [],
        })),
      ],
      level_history: {
        from: character.level,
        to: draft.targetLevel,
        at: new Date().toISOString(),
        changes: {
          hp_increase: draft.hpIncrease,
          features_gained: draft.newFeatures.map(f => f.id),
          hp_refilled: draft.refillHP,
        },
      },
    };

    // Clear draft
    localStorage.removeItem(`levelup_draft_${character.id}`);
    
    // Notify parent
    onLevelUpComplete(updates);
    
    toast({
      title: "Level Up Complete!",
      description: `You are now level ${draft.targetLevel}!`,
    });
    
    onOpenChange(false);
  };

  const CurrentStepComponent = steps[currentStep]?.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Level Up: {character.level} → {draft.targetLevel}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{steps[currentStep]?.title}</span>
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Step Content */}
          {CurrentStepComponent && (
            <CurrentStepComponent
              character={character}
              draft={draft}
              setDraft={setDraft}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleApply} className="bg-gradient-to-r from-primary to-accent">
                <Save className="mr-2 h-4 w-4" />
                Save & Apply
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
