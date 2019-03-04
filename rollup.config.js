import { resolve } from "path";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import nodeResolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const DEV = !!process.env.ROLLUP_WATCH;

const commonPlugins = [
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
    })
];

function prodBuild() {
    return {
        input: "src/index.ts",
        plugins: commonPlugins,
        output: [{
            file: pkg.main,
            format: "umd",
            name: pkg.name
        }]
    };
}

function devBuild () {
    const exampleFolders = ["dist", "static"];

    return {
        input: "src/index.ts",
        plugins: [
            ...commonPlugins,
            serve({
                contentBase: exampleFolders,
                host: "0.0.0.0",
                port: 8080
            }),
            livereload({
                watch: exampleFolders
            })
        ],
        output: [{
            file: pkg.main,
            format: "iife"
        }]
    };
}

const build = (DEV) ? devBuild : prodBuild;

export default build();
