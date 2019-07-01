export function isProduction() {
  return !!(
    process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production'
  );
}

export const dbConfig = {
  productionDB: {
    user: 'mioa',
    password: 'msloa',
    connectString: `10.86.0.139:1521/mioa`,
  },
  // devDB: {
  //   user: 'mioa',
  //   password: 'msloa',
  //   connectString: `10.86.0.139:1521/mioa`,
  //   stmtCacheSize: 300,
  // },
  devDB: {
    user: 'mioa',
    password: 'msloa',
    connectString: `10.86.3.41:1531/mioa`,
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
  port: isProduction() ? 8092 : 8092,
};
