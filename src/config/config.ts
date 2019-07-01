export function isProduction() {
  return !!(
    process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production'
  );
}

export const dbConfig = {
  productionDB: {
    user: 'mil',
    password: 'milacgs',
    connectString: `10.86.0.146:1521/milgs`,
    stmtCacheSize: 3000,
  },
  // devDB: {
  //   user: 'mil',
  //   password: 'milacgs',
  //   connectString: `10.86.0.146:1521/milgs`,
  //   stmtCacheSize: 300,
  // },
  devDB: {
    user: 'mil',
    password: 'milquer',
    connectString: `10.86.0.157:1531/milgs`,
    stmtCacheSize: 3000,
  },
  mioaProductionDB: {
    user: 'mioa',
    password: 'msloa',
    connectString: `10.86.0.139:1521/mioa`,
  },
  mioaDevDB: {
    user: 'mioa',
    password: 'msloa',
    connectString: `10.86.3.41:1531/mioa`,
  },
  // productionDB: {
  //   user: 'ihubdba',
  //   password: 'ihubdba',
  //   connectString: `10.86.20.113:1528/ohub`,
  // },
  // devDB: {
  //   user: 'ihubdba',
  //   password: 'ihubdba',
  //   connectString: `10.86.20.113:1528/ohub`,
  // },
};

export const serverConfig = {
  port: isProduction() ? 8084 : 8084,
};
