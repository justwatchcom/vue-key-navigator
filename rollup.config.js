import typescriptPlugin from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import vuePlugin from 'rollup-plugin-vue'
import typescript from 'typescript'

export default {
  input: 'src/lib/index.ts',
  output: {
    file: 'dist/src/index.esm.js',
    format: 'esm',
  },
  plugins: [
    commonjs(),
    typescriptPlugin({ typescript }),
    vuePlugin(),
  ],
  external: ['vue', 'tslib', 'vue-property-decorator', 'vue-mixin-decorator'],
}
