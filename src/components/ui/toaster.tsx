import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      closeButton
      duration={3500}
      toastOptions={{
        classNames: {
          toast:
            'rounded-lg border border-border bg-white text-ink shadow-md font-sans !gap-3',
          title: 'text-sm font-medium text-ink',
          description: 'text-sm text-ink/60',
          success: '!border-mint/35',
          error: '!border-destructive/35',
          closeButton:
            'border-border bg-white text-ink/45 hover:bg-paper hover:text-ink',
        },
      }}
    />
  )
}
