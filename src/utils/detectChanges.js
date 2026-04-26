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