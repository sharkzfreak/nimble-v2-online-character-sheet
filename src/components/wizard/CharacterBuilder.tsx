import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save, Check } from "lucide-react";
import { useNimbleRuleset } from "@/hooks/useNimbleRuleset";
import { BuilderStep1Identity } from "./steps/BuilderStep1Identity";
import { BuilderStep2Class } from "./steps/BuilderStep2Class";
import { BuilderStep3AbilityScores } from "./steps/BuilderStep3AbilityScores";
import { BuilderStep4DerivedStats } from "./steps/BuilderStep4DerivedStats";
import { BuilderStep5Skills } from "./steps/BuilderStep5Skills";
import { BuilderStep6Features } from "./steps/BuilderStep6Features";
import { BuilderStep7Equipment } from "./steps/BuilderStep7Equipment";
import { BuilderStep8PowersSpells } from "./steps/BuilderStep8PowersSpells";
import { BuilderStep9Flavor } from "./steps/BuilderStep9Flavor";
import { BuilderStep10Review } from "./steps/BuilderStep10Review";
import { BuilderLivePreview } from "./BuilderLivePreview";

export interface WizardFormData {
  name: string;
  level: number;
  campaign: string;
  race: string;
  background: string;
  class: string;
  class_id: string | null;
  subclass_id: string | null;
  portrait_url: string;
  str_mod: number;
  dex_mod: number;
  int_mod: number;
  will_mod: number;
  stat_array_id: string | null;
  stat_array_values: number[];
  class_features: Array<{
    id: string;
    name: string;
    level: number;
    description: string;
    requires_choice: boolean;
    choice_type?: 'single' | 'multi';
    choice_count?: number;
    options?: Array<{ id: string; name: string; description?: string }>;
    selection?: string[];
  }>;
  hp_max: number;
  hp_current: number;
  armor: number;
  skill_arcana: number;
  skill_examination: number;
  skill_finesse: number;
  skill_influence: number;
  skill_insight: number;
  skill_lore: number;
  skill_might: number;
  skill_naturecraft: number;
  skill_perception: number;
  skill_stealth: number;
  custom_features: Array<{ id: string; name: string; description: string; rollFormula?: string }>;
  custom_spells: Array<{ id: string; name: string; description: string; rollFormula?: string }>;
  custom_inventory: Array<{ id: string; name: string; description: string; rollFormula?: string }>;
  notes: string;
  description: string;
  abilities: string;
  spells: string;
  powers: string;
}

const STEPS = [
  { id: 1, title: "Identity", component: BuilderStep1Identity },
  { id: 2, title: "Class", component: BuilderStep2Class },
  { id: 3, title: "Stat Array", component: BuilderStep3AbilityScores },
  { id: 4, title: "Derived Stats", component: BuilderStep4DerivedStats },
  { id: 5, title: "Skills", component: BuilderStep5Skills },
  { id: 6, title: "Features", component: BuilderStep6Features },
  { id: 7, title: "Equipment", component: BuilderStep7Equipment },
  { id: 8, title: "Powers & Spells", component: BuilderStep8PowersSpells },
  { id: 9, title: "Flavor", component: BuilderStep9Flavor },
  { id: 10, title: "Review", component: BuilderStep10Review },
];

export const CharacterBuilder = () => {
  const navigate = useNavigate();
  const { data: ruleset } = useNimbleRuleset();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<WizardFormData>({
    name: "",
    level: 1,
    campaign: "",
    race: "",
    background: "",
    class: "",
    class_id: null,
    subclass_id: null,
    portrait_url: "",
    str_mod: 0,
    dex_mod: 0,
    int_mod: 0,
    will_mod: 0,
    stat_array_id: null,
    stat_array_values: [],
    class_features: [],
    hp_max: 0,
    hp_current: 0,
    armor: 10,
    skill_arcana: 0,
    skill_examination: 0,
    skill_finesse: 0,
    skill_influence: 0,
    skill_insight: 0,
    skill_lore: 0,
    skill_might: 0,
    skill_naturecraft: 0,
    skill_perception: 0,
    skill_stealth: 0,
    custom_features: [],
    custom_spells: [],
    custom_inventory: [],
    notes: "",
    description: "",
    abilities: "",
    spells: "",
    powers: "",
  });

  // Autosave draft
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft();
    }, 400);
    return () => clearTimeout(timer);
  }, [formData]);

  const saveDraft = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if draft exists
      const { data: existingDraft } = await supabase
        .from("characters")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_draft", true)
        .single();

      const characterData = {
        ...formData,
        user_id: user.id,
        is_draft: true,
        hit_dice_remaining: formData.level,
        hit_dice_total: formData.level,
      };

      if (existingDraft) {
        await supabase
          .from("characters")
          .update(characterData)
          .eq("id", existingDraft.id);
      } else {
        await supabase
          .from("characters")
          .insert([characterData]);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleSaveAndExit = async () => {
    await saveDraft();
    toast({ title: "Draft saved", description: "You can resume later from the dashboard" });
    navigate("/dashboard");
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // Identity
        if (!formData.name.trim()) {
          toast({ title: "Name required", description: "Please enter a character name", variant: "destructive" });
          return false;
        }
        return true;
      case 2: // Class
        if (!formData.class) {
          toast({ title: "Class required", description: "Please select a class", variant: "destructive" });
          return false;
        }
        // Validate all required feature choices are made
        const incompleteFeatures = formData.class_features.filter(f => {
          if (!f.requires_choice) return false;
          const selectionCount = f.selection?.length || 0;
          const requiredCount = f.choice_count || 1;
          return selectionCount !== requiredCount;
        });
        if (incompleteFeatures.length > 0) {
          toast({ 
            title: "Feature choices required", 
            description: `Please complete all feature selections (${incompleteFeatures[0].name})`, 
            variant: "destructive" 
          });
          return false;
        }
        return true;
      case 3: // Stat Array
        if (!formData.stat_array_id) {
          toast({ title: "Array required", description: "Please select a stat array", variant: "destructive" });
          return false;
        }
        const mods = [formData.str_mod, formData.dex_mod, formData.int_mod, formData.will_mod];
        if (mods.some(m => m === null || m === undefined)) {
          toast({ title: "Array incomplete", description: "Please assign all stat modifiers", variant: "destructive" });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleCreateCharacter = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Generate dice presets
      const dicePresets = [
        {
          id: "initiative",
          name: "Initiative",
          formula: `1d20${formData.dex_mod >= 0 ? '+' : ''}${formData.dex_mod}`,
        },
        {
          id: "attack",
          name: "Attack",
          formula: `1d20${Math.max(formData.str_mod, formData.dex_mod) >= 0 ? '+' : ''}${Math.max(formData.str_mod, formData.dex_mod)}`,
        },
        {
          id: "damage",
          name: "Damage",
          formula: `1d8${formData.str_mod >= 0 ? '+' : ''}${formData.str_mod}`,
        },
      ];

      // Prepare character data, excluding fields that aren't DB columns
      const { class_features, stat_array_id, stat_array_values, ...restFormData } = formData;
      
      const characterData = {
        ...restFormData,
        user_id: user.id,
        is_draft: false,
        dice_presets: dicePresets,
        hp_current: formData.hp_max,
        hit_dice_remaining: formData.level,
        hit_dice_total: formData.level,
      };

      // Delete any existing draft
      await supabase
        .from("characters")
        .delete()
        .eq("user_id", user.id)
        .eq("is_draft", true);

      const { data, error } = await supabase
        .from("characters")
        .insert([characterData])
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Character created!", description: `${formData.name} is ready for adventure` });
      navigate(`/character/${data.id}`);
    } catch (error) {
      console.error("Error creating character:", error);
      toast({ title: "Error", description: "Failed to create character", variant: "destructive" });
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex">
      {/* Live Preview - Left Side */}
      <div className="hidden lg:block w-80 border-r border-border bg-card/50 backdrop-blur-sm">
        <BuilderLivePreview formData={formData} ruleset={ruleset} />
      </div>

      {/* Main Content - Right Side */}
      <div className="flex-1 flex flex-col">
        {/* Header with Progress */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Character Builder
              </h1>
              <Button onClick={handleSaveAndExit} variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save & Exit
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center cursor-pointer ${
                      currentStep === step.id ? "text-primary font-medium" : ""
                    }`}
                    onClick={() => completedSteps.includes(step.id - 1) || step.id === 1 ? setCurrentStep(step.id) : null}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                      completedSteps.includes(step.id)
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-muted"
                    }`}>
                      {completedSteps.includes(step.id) ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <span className="text-xs">{step.id}</span>
                      )}
                    </div>
                    <span className="hidden sm:block">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8 max-w-4xl">
            <CurrentStepComponent
              formData={formData}
              setFormData={setFormData}
              ruleset={ruleset}
            />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-border bg-card/80 backdrop-blur-sm sticky bottom-0">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              {currentStep === STEPS.length ? (
                <Button onClick={handleCreateCharacter} variant="hero">
                  <Check className="mr-2 h-4 w-4" />
                  Create Character
                </Button>
              ) : (
                <Button onClick={handleNext} variant="hero">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
