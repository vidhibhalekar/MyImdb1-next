let undoTimer: any = null;
let pendingAction: any = null;

export function scheduleUndo(action: any, revert: () => void) {
  clearTimeout(undoTimer);

  pendingAction = { action, revert };

  undoTimer = setTimeout(() => {
    pendingAction = null;
  }, 3000);
}

export function undoLastAction() {
  if (!pendingAction) return false;

  pendingAction.revert();
  pendingAction = null;

  clearTimeout(undoTimer);
  return true;
}

export function hasUndo() {
  return !!pendingAction;
}