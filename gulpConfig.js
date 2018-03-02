const
    srcPath = 'src',
    srcScssPath = `${srcPath}/scss`,
    srcLibPath = `${srcPath}/lib`,
    distPath = 'static';

const config = {
    all: {
        html: `views/**`,
        scss: `${srcScssPath}/**`,
        lib: `${srcLibPath}/**`,
    },
    srcPath: {
        scss: {
            base: [
                'src/scss/pages/base.scss'
            ],
            home: [
                'src/scss/pages/home.scss'
            ],
            solution: [
                'src/scss/pages/solution.scss'
            ],
            case: [
                'src/scss/pages/case.scss'
            ],
            product: [
                'src/scss/pages/product.scss'
            ]
        }
    },
    outPath: {
        path: `${distPath}/**`,
        css: `${distPath}/css`,
        lib: `${distPath}/lib`
    }
};

module.exports = config;
