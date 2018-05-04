module.exports = {
  userIsValid: (user) => {
    if (!user.password ||
        !user.username) return false;
    else return true;
  },
  stripUserObject: (user) => {
    user.password = undefined;
    return user;
  },
  stripUserArray: (arr) => {
    for (var i = 0; i < arr.length; i++) {
      arr[i].password = undefined;
    }
    return arr;
  },
  userFactory: (user, data) => {
    user.username = data.username;
    return user;
  },
  invoiceIsValid: (invoice) => {
    if (!invoice.ownerId) return false;
    else return true;
  },
  invoiceFactory: (invoice, data) => {
    invoice.ownerId = data.ownerId;
    invoice.amountOriginal = data.amountOriginal;
    invoice.amountPrivate = data.amountPrivate;
    invoice.amountToSplit = data.amountToSplit;
    invoice.month = data.month;
    invoice.year = data.year;
    invoice.date = data.date;
    return invoice;
  },
  monthIsValid: (month) => {
    if (!month.month ||
        !month.year ||
        !month.createdAt) return false;
    else return true;
  },
  monthFactory: (month, data) => {
    month.month = data.month;
    month.year = month.year;
    month.createdAt = data.createdAt;
    month.users = data.users;
    return month;
  }
}
