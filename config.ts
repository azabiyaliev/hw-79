import path from "path";

const rootPath  = __dirname;

const config =  {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    dataBase: {
    host: "localhost",
        user: "root",
    password: "root",
    database: "hw-79"
    }
};


export default config;