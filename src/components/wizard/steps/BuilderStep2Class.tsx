import { WizardFormData } from "../CharacterBuilder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NimbleRuleset } from "@/hooks/useNimbleRuleset";
import { Badge } from "@/components/ui/badge";

interface BuilderStepProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  ruleset: NimbleRuleset | undefined;
}

export const BuilderStep2Class = ({ formData, setFormData, ruleset }: BuilderStepProps) => {
  const handleClassSelect = (classData: any) => {
    setFormData({
      ...formData,
      class: classData.name,
      class_id: null, // We'll use the class name for now
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Choose Your Path
        </h2>
        <p className="text-muted-foreground">
          Select a class that defines your combat style and abilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ruleset?.classes.map((classOption) => (
          <Card
            key={classOption.name}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              formData.class === classOption.name
                ? "border-primary border-2 shadow-[var(--shadow-glow)]"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleClassSelect(classOption)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{classOption.name}</CardTitle>
                <Badge variant={classOption.complexity === 1 ? "default" : classOption.complexity === 2 ? "secondary" : "destructive"}>
                  {classOption.complexity === 1 ? "Simple" : classOption.complexity === 2 ? "Moderate" : "Complex"}
                </Badge>
              </div>
              <CardDescription className="text-sm line-clamp-2">
                {classOption.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {!ruleset && (
        <div className="text-center text-muted-foreground">
          <p>Loading class options...</p>
        </div>
      )}
    </div>
  );
};
