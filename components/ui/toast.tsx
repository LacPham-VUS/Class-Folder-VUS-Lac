'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:top-4 sm:right-4 md:max-w-[440px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border-2 p-5 pr-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] hover:scale-[1.02] hover:-translate-y-0.5',
  {
    variants: {
      variant: {
        default: 
          'border-blue-300 bg-gradient-to-br from-blue-50 via-blue-50/95 to-blue-100/90 text-blue-950 dark:border-blue-700 dark:from-blue-950/95 dark:via-blue-950/90 dark:to-blue-900/80 dark:text-blue-50 shadow-blue-500/10',
        destructive:
          'destructive group border-red-400 bg-gradient-to-br from-red-50 via-red-50/95 to-red-100/90 text-red-950 dark:border-red-700 dark:from-red-950/95 dark:via-red-950/90 dark:to-red-900/80 dark:text-red-50 shadow-red-500/20',
        success:
          'success group border-green-400 bg-gradient-to-br from-green-50 via-green-50/95 to-green-100/90 text-green-950 dark:border-green-700 dark:from-green-950/95 dark:via-green-950/90 dark:to-green-900/80 dark:text-green-50 shadow-green-500/20',
        warning:
          'warning group border-amber-400 bg-gradient-to-br from-amber-50 via-amber-50/95 to-amber-100/90 text-amber-950 dark:border-amber-700 dark:from-amber-950/95 dark:via-amber-950/90 dark:to-amber-900/80 dark:text-amber-50 shadow-amber-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  // Determine icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400 animate-[toast-icon-bounce_0.5s_ease-out]" />
      case 'destructive':
        return <XCircle className="h-6 w-6 shrink-0 text-red-600 dark:text-red-400 animate-[toast-shake_0.5s_ease-out]" />
      case 'warning':
        return <AlertCircle className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400 animate-[toast-icon-bounce_0.5s_ease-out]" />
      default:
        return <Info className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400 animate-[toast-icon-bounce_0.5s_ease-out]" />
    }
  }

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {/* Icon */}
      <div className="mt-0.5">{getIcon()}</div>
      {/* Content wrapper */}
      <div className="flex-1 min-w-0">
        {props.children}
      </div>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-3 top-3 rounded-full p-1.5 transition-all opacity-70 hover:opacity-100 hover:bg-black/10 hover:scale-110 dark:hover:bg-white/10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 group-[.destructive]:hover:bg-red-200/60 group-[.destructive]:dark:hover:bg-red-800/60 group-[.success]:hover:bg-green-200/60 group-[.success]:dark:hover:bg-green-800/60 group-[.warning]:hover:bg-amber-200/60 group-[.warning]:dark:hover:bg-amber-800/60',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-base font-bold leading-tight tracking-tight', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm leading-relaxed mt-1.5 opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
