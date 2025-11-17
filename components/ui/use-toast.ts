// components/ui/use-toast.ts
import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  duration?: number
  type: "default" | "success" | "warning" | "error" | "info"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST
      toast: Toast
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST
      toast: Partial<Toast>
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST
      toastId?: string
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId?: string
    }

interface State {
  toasts: Toast[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action
      // ! Side effect ! - This will be executed only on the client
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                duration: 0,
              }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return state
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let state: State = {
  toasts: [],
}

function dispatch(action: Action) {
  state = reducer(state, action)
  listeners.forEach((listener) => {
    listener(state)
  })
}

const id = (() => {
  let count = 0
  return () => {
    count += 1
    return String(count)
  }
})()

function addToRemoveQueue(toastId: string) {
  if (state.toasts.find((t) => t.id === toastId)) {
    setTimeout(() => {
      // @ts-expect-error
      dispatch({
        type: actionTypes.REMOVE_TOAST,
        toastId: toastId,
      })
    }, TOAST_REMOVE_DELAY)
  }
}

export function toast({ ...props }: Omit<Toast, "id">) {
  const _id = id()
  const defaultDuration = 5000
  const toastId = _id

  // @ts-expect-error
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id: toastId,
      duration: props.duration || defaultDuration,
    },
  })

  return {
    id: toastId,
    dismiss: () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}

export function useToast() {
  const [snapshot, setSnapshot] = React.useState(state)

  React.useEffect(() => {
    listeners.push(setSnapshot)
    return () => {
      const index = listeners.indexOf(setSnapshot)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...snapshot,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}
