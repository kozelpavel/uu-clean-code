class UserService {
  constructor(pdfReportEngine, xlsxReportEngine) {
    this.pdfReportEngine = pdfReportEngine;
    this.xlsxReportEngine = xlsxReportEngine;
  }

  login(credentials) {}

  logout() {}

  createUser(userDto) {}

  updateUser(userDto) {}

  getUser(userId) {}

  deleteUser(user) {}

  listUsers(filterParams) {}

  generateActiveUsersReport(reportParams) {}

  createUserPermission(user, permission) {}

  removeUserPermission(user, permission) {}

  listPermissions(user) {}

  getBillingInfoForUser(user) {}

  generateBillForUser(user, billingPeriod) {}
}
