let hasInAppNavigation = false;

export const recordInAppNavigation = () => {
  hasInAppNavigation = true;
};

export const hasNavigatedInApp = () => hasInAppNavigation;
