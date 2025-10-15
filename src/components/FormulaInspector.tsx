import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

export interface FormulaContributor {
  source: string;
  value: number;
  formula?: string;
}

export interface FormulaBreakdown {
  stat: string;
  contributors: FormulaContributor[];
  total: number;
  isOverridden: boolean;
  computedValue?: number;
  overrideNote?: string;
}

interface FormulaInspectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breakdown: FormulaBreakdown | null;
  onResetOverride?: () => void;
}

export const FormulaInspector = ({ 
  open, 
  onOpenChange, 
  breakdown,
  onResetOverride 
}: FormulaInspectorProps) => {
  if (!breakdown) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {breakdown.stat} Calculation
            </span>
            {breakdown.isOverridden && (
              <Badge variant="secondary" className="ml-2">
                Customized
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contributors */}
          <Card className="p-4 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              Contributors
            </h3>
            
            {breakdown.contributors.map((contributor, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium">{contributor.source}</span>
                  {contributor.formula && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({contributor.formula})
                    </span>
                  )}
                </div>
                <span className={`font-mono font-bold ${
                  contributor.value > 0 ? 'text-green-600' : 
                  contributor.value < 0 ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {contributor.value > 0 ? '+' : ''}{contributor.value}
                </span>
              </div>
            ))}
          </Card>

          {/* Total */}
          <Card className="p-4 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Final {breakdown.stat}</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {breakdown.total}
              </span>
            </div>
          </Card>

          {/* Override Info & Reset */}
          {breakdown.isOverridden && (
            <Card className="p-4 border-amber-500/50 bg-amber-500/5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      Custom Override Active
                    </p>
                    {breakdown.overrideNote && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {breakdown.overrideNote}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Computed value would be: <span className="font-bold">{breakdown.computedValue}</span>
                    </p>
                  </div>
                </div>
                
                {onResetOverride && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onResetOverride}
                    className="w-full"
                  >
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Reset to Computed Value
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Formula String */}
          <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-3 rounded-lg overflow-x-auto">
            {breakdown.contributors.map((c, i) => (
              <span key={i}>
                {i > 0 && ' + '}
                {c.source.replace(/\s/g, '_')}({c.value > 0 ? '+' : ''}{c.value})
              </span>
            ))}
            {' = '}
            <span className="font-bold">{breakdown.total}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
