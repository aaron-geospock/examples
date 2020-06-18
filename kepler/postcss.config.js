module.exports = ({env}) => ({
    plugins: {
        precss: {},
        "postcss-color-mod-function": {},
        "postcss-lab-function": {},
        autoprefixer: {},
        cssnano: env === "production" ? {} : false,
    },
});
