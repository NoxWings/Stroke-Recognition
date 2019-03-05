import { resolve } from "path";
import commonjs from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import nodeResolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const DEV = !!process.env.ROLLUP_WATCH;

const config = {
    input: "src/index.ts",
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs({
            include: "node_modules/**",
            sourceMap: false
        }),
        typescript({
            typescript: require("typescript"),
            cacheRoot: resolve(".cache", "rpt2")
        }),
        copy({
            "static": "dist"
        })
    ],
    output: [{
        file: pkg.main,
        format: "umd",
        name: pkg.name
    }]
};

if (DEV) {
    config.plugins.push(
        serve({
            contentBase: "dist",
            host: "0.0.0.0",
            port: 8080
        }),
        livereload({ watch: "dist" })
    );
}

export default config;
