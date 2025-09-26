"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, RotateCcw, BarChart3 } from "lucide-react"
import { toast } from "sonner"

interface ResetStatsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  stats: {
    total: number
    answered: number
    correct: number
    wrong: number
    pct: number
  }
  loading?: boolean
}

export function ResetStatsModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  stats, 
  loading = false 
}: ResetStatsModalProps) {
  const [confirmText, setConfirmText] = useState("")

  const handleConfirm = () => {
    if (confirmText.toLowerCase() === "reset") {
      onConfirm()
      onClose()
      setConfirmText("")
    } else {
      toast.error("Digite 'reset' para confirmar")
    }
  }

  const handleClose = () => {
    onClose()
    setConfirmText("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Resetar Estatísticas
          </DialogTitle>
          <DialogDescription>
            Esta ação irá apagar permanentemente todas as suas estatísticas de estudo para este conjunto de questões.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Stats Display */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estatísticas Atuais
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total de questões:</span>
                <span className="ml-2 font-medium">{stats.total}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Respondidas:</span>
                <span className="ml-2 font-medium">{stats.answered}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Corretas:</span>
                <span className="ml-2 font-medium text-success">{stats.correct}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Incorretas:</span>
                <span className="ml-2 font-medium text-destructive">{stats.wrong}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Taxa de acerto:</span>
                <span className="ml-2 font-medium">{stats.pct}%</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Atenção!</p>
                <p className="text-destructive/80 mt-1">
                  Esta ação não pode ser desfeita. Todas as suas respostas, progresso e estatísticas serão perdidas permanentemente.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Para confirmar, digite <span className="font-mono bg-muted px-1 rounded">reset</span>:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite 'reset' aqui"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={loading || confirmText.toLowerCase() !== "reset"}
            className="gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Resetando...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Resetar Estatísticas
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
