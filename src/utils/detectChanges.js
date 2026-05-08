/**
 * Detect changes between old and new loan scheme data
 * Used for identifying what fields have been updated
 */
export const detectChanges = (oldData, newData) => {
  const changes = [];

  if (oldData.interestRate !== newData.interestRate) {
    changes.push({
      field: "interestRate",
      old: oldData.interestRate,
      new: newData.interestRate,
    });
  }

  if (oldData.tenure !== newData.tenure) {
    changes.push({
      field: "tenure",
      old: oldData.tenure,
      new: newData.tenure,
    });
  }

  if (oldData.processingFee !== newData.processingFee) {
    changes.push({
      field: "processingFee",
      old: oldData.processingFee,
      new: newData.processingFee,
    });
  }

  return changes;
};

/**
 * Deep compare two objects and return all differences
 * More comprehensive than detectChanges
 */
export const compareObjects = (oldData, newData) => {
  const changes = {};

  for (let key in newData) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = {
        old: oldData[key],
        new: newData[key],
      };
    }
  }

  return changes;
};
