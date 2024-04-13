const gulp = require("gulp");
const zip = require("gulp-zip");
const merge = require("merge2");
const cssmin = require("gulp-minify-css");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const del = require("del");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const tpl2js = require("hz-gulp-tpl2js");
const rev = require("gulp-rev"); //- 对文件名加MD5后缀
const revCollector = require("gulp-rev-collector"); //- 路径替换
const packageName = require("./package.json").name;
const packageVersion = require("./package.json").version;
const buildPath = "./build";

const paths = {
  env: "",
  baseDir: "",
  resDomain: `//res.qx.com/${packageName}`,
  staticDir: "./static",
  buildPath: buildPath,
  buildCiPath: "./build-ci",
  serverDir: `./build/qd/${packageName}`,
  resDir: `./build/qd/res.qx.com/${packageName}`,
  buildCiServerDir: "./build-ci/nodejs",
  buildCiStaticDir: "./build-ci/static",
};

function clean() {
  return del([paths.buildPath]);
}
function cleanCicd() {
  return del([`${paths.buildCiPath}/**`]);
}

gulp.task("move", function () {
  return merge(
    gulp
      .src([paths.staticDir + "/img/**"])
      .pipe(gulp.dest(paths.resDir + "/img")),

    gulp
      .src([paths.staticDir + "/font/**"])
      .pipe(gulp.dest(paths.resDir + "/font")),

    gulp
      .src([paths.staticDir + "/sass/**"])
      .pipe(
        replace('$imghost:"../img/"', '$imghost:"' + paths.resDomain + '/img/"')
      )
      .pipe(
        replace(
          '$imghost2:"../../img/"',
          '$imghost2:"' + paths.resDomain + '/img/"'
        )
      )
      .pipe(
        replace(
          '$imghost3:"../../../img/"',
          '$imghost3:"' + paths.resDomain + '/img/"'
        )
      )
      .pipe(
        replace(
          '$fonthost:"../font/"',
          '$fonthost:"' + paths.resDomain + '/font/"'
        )
      )
      .pipe(gulp.dest(paths.buildPath + "/sass")),

    gulp
      .src([
        paths.staticDir + "/js/**",
        "!/**/js/require.js",
        "!/**/js/underscore.js",
        "!/**/js/jquery.js",
        "!/**/js/plugin/jquery.lazyload.js",
        "!/**/js/plugin/layer/layer.js",
      ])
      .pipe(gulp.dest(paths.buildPath + "/js")),

    gulp
      .src([paths.staticDir + "/dist/**/*.js"])
      .pipe(gulp.dest(paths.buildPath + "/dist")),

    gulp
      .src([
        "./src/**",
        "!./src/node_modules{,/**}",
        "!./src/logs{,/**}",
        "!./src/config.js",
        "!./src/config/local.js",
        "!./src/tenant/*/static{,/**}",
      ])
      .pipe(replace("resDomain = ''", "resDomain = '" + paths.resDomain + "'"))
      .pipe(replace("imgDomain = ''", "imgDomain = '" + paths.resDomain + "'"))
      .pipe(gulp.dest(paths.serverDir))
  );
});
gulp.task("move:cicd", function () {
  return merge(
    gulp
      .src([paths.staticDir + "/img/**"])
      .pipe(gulp.dest(paths.buildCiStaticDir + "/img")),

    gulp
      .src([paths.staticDir + "/font/**"])
      .pipe(gulp.dest(paths.buildCiStaticDir + "/font")),

    gulp
      .src([paths.staticDir + "/sass/**"])
      .pipe(
        replace('$imghost:"../img/"', '$imghost:"' + paths.resDomain + '/img/"')
      )
      .pipe(
        replace(
          '$imghost2:"../../img/"',
          '$imghost2:"' + paths.resDomain + '/img/"'
        )
      )
      .pipe(
        replace(
          '$imghost3:"../../../img/"',
          '$imghost3:"' + paths.resDomain + '/img/"'
        )
      )
      .pipe(
        replace(
          '$fonthost:"../font/"',
          '$fonthost:"' + paths.resDomain + '/font/"'
        )
      )
      .pipe(gulp.dest(paths.buildCiPath + "/sass")),

    gulp
      .src([
        paths.staticDir + "/js/**",
        "!/**/js/require.js",
        "!/**/js/underscore.js",
        "!/**/js/jquery.js",
        "!/**/js/plugin/jquery.lazyload.js",
        "!/**/js/plugin/layer/layer.js",
      ])
      .pipe(gulp.dest(paths.buildCiPath + "/js")),

    gulp
      .src([paths.staticDir + "/dist/**/*.js"])
      .pipe(gulp.dest(paths.buildCiPath + "/dist")),

    gulp
      .src([
        "./src/**",
        "!./src/node_modules{,/**}",
        "!./src/logs{,/**}",
        "!./src/config.js",
        "!./src/config/local.js",
        "!./src/config/local-preview.js",
        "!./src/tenant/*/static{,/**}",
      ])
      // .pipe(
      //   replace(
      //     "serverDomain = ''",
      //     "serverDomain ='" + paths.serverDomain + "'"
      //   )
      // )
      .pipe(replace("resDomain = ''", "resDomain = '" + paths.resDomain + "'"))
      .pipe(replace("imgDomain = ''", "imgDomain = '" + paths.resDomain + "'"))
      .pipe(gulp.dest(paths.buildCiServerDir))
  );
});

gulp.task("css", function () {
  return (
    gulp
      .src(paths.buildPath + "/sass/**/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(
        cssmin({
          advanced: false,
          compatibility: "ie7",
          keepBreaks: true,
          keepSpecialComments: "*",
        })
      )
      //.pipe(cleanCSS())
      .pipe(gulp.dest(paths.resDir + "/css"))
  );
});
gulp.task("css:cicd", function () {
  return (
    gulp
      .src(paths.buildCiPath + "/sass/**/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(
        cssmin({
          advanced: false,
          compatibility: "ie7",
          keepBreaks: true,
          keepSpecialComments: "*",
        })
      )
      //.pipe(cleanCSS())
      .pipe(gulp.dest(paths.buildCiStaticDir + "/css"))
  );
});

gulp.task("concat", function () {
  return merge(
    // ejs模板
    gulp
      .src(paths.staticDir + "/tpl/**/*.ejs")
      .pipe(tpl2js({ template: "underscore", context: "" }))
      .pipe(concat("tpl.js"))
      .pipe(gulp.dest(paths.buildPath + "/js/tpl")),
    // 合并共用文件
    gulp
      .src([
        paths.staticDir + "/js/moment.js",
        paths.staticDir + "/js/require.js",
        paths.staticDir + "/js/underscore.js",
        paths.staticDir + "/js/jquery.js",
        paths.staticDir + "/js/plugin/jquery.lazyload.js",
        paths.staticDir + "/js/plugin/layer/layer.js",
      ])
      .pipe(concat("main.js"))
      .pipe(gulp.dest(paths.buildPath + "/js"))
  );
});
gulp.task("concat:cicd", function () {
  return merge(
    // ejs模板
    gulp
      .src(paths.staticDir + "/tpl/**/*.ejs")
      .pipe(tpl2js({ template: "underscore", context: "" }))
      .pipe(concat("tpl.js"))
      .pipe(gulp.dest(paths.buildCiPath + "/js/tpl")),
    // 合并共用文件
    gulp
      .src([
        paths.staticDir + "/js/moment.js",
        paths.staticDir + "/js/require.js",
        paths.staticDir + "/js/underscore.js",
        paths.staticDir + "/js/jquery.js",
        paths.staticDir + "/js/plugin/jquery.lazyload.js",
        paths.staticDir + "/js/plugin/layer/layer.js",
      ])
      .pipe(concat("main.js"))
      .pipe(gulp.dest(paths.buildCiPath + "/js"))
  );
});

gulp.task("js", function () {
  return merge(
    gulp
      .src([paths.buildPath + "/dist/**"])
      .pipe(gulp.dest(paths.resDir + "/dist/")),

    // 暂时兼容部分js未添加到require-config文件中
    gulp
      .src([paths.buildPath + "/js/**/*.js", "!/**/js/require.config.js"])
      .pipe(gulp.dest(paths.resDir + "/js")),

    gulp
      .src([paths.buildPath + "/dist/**/*.js"])
      .pipe(rev())
      .pipe(gulp.dest(paths.resDir + "/dist"))
      .pipe(rev.manifest("webpack-manifest.json"))
      .pipe(gulp.dest(paths.baseDir + "/rev")),

    gulp
      .src([
        paths.buildPath + "/js/**/*.css",
        paths.buildPath + "/js/**/*.png",
        paths.buildPath + "/js/**/*.gif",
      ])
      .pipe(gulp.dest(paths.resDir + "/js/")),

    gulp
      .src([
        paths.buildPath + "/js/**/*.js",
        "!/**/js/require.config.js",
        "!" + paths.buildPath + "/js/plugin/**",
        "!" + paths.buildPath + "/js/huize-service/**",
      ])
      .pipe(uglify())
      .pipe(rev())
      .pipe(gulp.dest(paths.resDir + "/js"))
      .pipe(rev.manifest())
      .pipe(gulp.dest(paths.baseDir + "/rev")),
    gulp
      .src([paths.buildPath + "/js/huize-service/**"])
      .pipe(rev())
      .pipe(gulp.dest(paths.resDir + "/js"))
      .pipe(rev.manifest())
      .pipe(gulp.dest(paths.baseDir + "/rev"))
  );
});
gulp.task("js:cicd", function () {
  return merge(
    gulp
      .src([paths.buildCiPath + "/dist/**"])
      .pipe(gulp.dest(paths.buildCiStaticDir + "/dist/")),

    // 暂时兼容部分js未添加到require-config文件中
    gulp
      .src([paths.buildCiPath + "/js/**/*.js", "!/**/js/require.config.js"])
      .pipe(gulp.dest(paths.buildCiStaticDir + "/js")),

    gulp
      .src([paths.buildCiPath + "/dist/**/*.js"])
      .pipe(rev())
      .pipe(gulp.dest(paths.buildCiStaticDir + "/dist"))
      .pipe(rev.manifest("webpack-manifest.json"))
      .pipe(gulp.dest(paths.baseDir + "/rev")),

    gulp
      .src([
        paths.buildCiPath + "/js/**/*.css",
        paths.buildCiPath + "/js/**/*.png",
        paths.buildCiPath + "/js/**/*.gif",
      ])
      .pipe(gulp.dest(paths.buildCiStaticDir + "/js/")),

    gulp
      .src([
        paths.buildPath + "/js/**/*.js",
        "!/**/js/require.config.js",
        "!" + paths.buildPath + "/js/plugin/**",
        "!" + paths.buildPath + "/js/huize-service/**",
      ])
      .pipe(uglify())
      .pipe(rev())
      .pipe(gulp.dest(paths.resDir + "/js"))
      .pipe(rev.manifest())
      .pipe(gulp.dest(paths.baseDir + "/rev")),
    gulp
      .src([paths.buildPath + "/js/huize-service/**"])
      .pipe(rev())
      .pipe(gulp.dest(paths.resDir + "/js"))
      .pipe(rev.manifest())
      .pipe(gulp.dest(paths.baseDir + "/rev"))
  );
});

gulp.task("rev", () => {
  return merge(
    //替换html里的引用
    gulp
      .src([paths.baseDir + "/rev/*.json", paths.serverDir + "/**/*.html"]) //- 读取 rev-manifest.json 文件以及需要进行替换的文件
      .pipe(revCollector()) //- 执行文件内名字的替换
      .pipe(gulp.dest(paths.serverDir)),

    //替换main**.js里requirejs.config的引用
    gulp
      .src([
        paths.baseDir + "./rev/*.json",
        paths.buildPath + "/js/require.config.js",
      ])
      .pipe(revCollector())
      .pipe(replace("baseUrl: '/js'", "baseUrl: '" + paths.resDomain + "/js'"))
      .pipe(gulp.dest(paths.resDir + "/js/"))
  );
});
gulp.task("rev:cicd", () => {
  return merge(
    //替换html里的引用
    gulp
      .src([
        paths.baseDir + "/rev/*.json",
        paths.buildCiServerDir + "/**/*.html",
      ]) //- 读取 rev-manifest.json 文件以及需要进行替换的文件
      .pipe(revCollector()) //- 执行文件内名字的替换
      .pipe(gulp.dest(paths.buildCiServerDir)),

    //替换main**.js里requirejs.config的引用
    gulp
      .src([
        paths.baseDir + "./rev/*.json",
        paths.buildCiPath + "/js/require.config.js",
      ])
      .pipe(revCollector())
      .pipe(replace("baseUrl: '/js'", "baseUrl: '" + paths.resDomain + "/js'"))
      .pipe(gulp.dest(paths.buildCiStaticDir + "/js/"))
  );
});

gulp.task("other", function () {
  return merge(
    gulp.src(["bin/pm2.json"]).pipe(gulp.dest(paths.serverDir + "/bin")),
    gulp.src(["bin/server.sh"]).pipe(gulp.dest(paths.serverDir + "/bin")),
    gulp.src("./src/.npmrc").pipe(gulp.dest(paths.serverDir))
  );
});
gulp.task("other:cicd", function () {
  return merge(
    gulp
      .src(["bin/pm2-cicd.json"])
      .pipe(gulp.dest(paths.buildCiServerDir + "/bin")),
    gulp
      .src(["bin/entrypoint.sh"])
      .pipe(gulp.dest(paths.buildCiServerDir + "/bin")),
    gulp.src("./src/.npmrc").pipe(gulp.dest(paths.buildCiServerDir))
  );
});

gulp.task("tenant-static", () => {
  return gulp
    .src(["./src/tenant/*/static/**"])
    .pipe(gulp.dest(paths.resDir + "/static-tenant"));
  // .pipe(gulp.dest(paths.serverDir + "/bin"));
});
gulp.task("tenant-static:cicd", () => {
  return gulp
    .src(["./src/tenant/*/static/**"])
    .pipe(gulp.dest(paths.buildCiStaticDir + "/static-tenant"));
});

gulp.task("zip", function () {
  return gulp
    .src("build/qd/**", { base: "build/", dot: true })
    .pipe(zip(`${packageName}-v${packageVersion}.zip`))
    .pipe(gulp.dest("./build"));
});

gulp.task("remove:cicd", function () {
  return del([
    `${paths.buildCiPath}/dist`,
    `${paths.buildCiPath}/js`,
    `${paths.buildCiPath}/sass`,
  ]);
});

gulp.task(
  "build",
  gulp.series([
    clean,
    "move",
    "css",
    "concat",
    "js",
    "rev",
    "other",
    "tenant-static",
  ])
);

gulp.task(
  "build-odms",
  gulp.series([
    clean,
    "move",
    "css",
    "concat",
    "js",
    "rev",
    "other",
    "tenant-static",
    "zip",
  ])
);
gulp.task(
  "build-cicd",
  gulp.series([
    cleanCicd,
    "move:cicd",
    "css:cicd",
    "concat:cicd",
    "js:cicd",
    "rev:cicd",
    "other:cicd",
    "tenant-static:cicd",
    "remove:cicd",
  ])
);
