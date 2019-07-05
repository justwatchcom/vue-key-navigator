<template>
  <div class="keyboard" :class="{ focus: isFocused }" ref="keyboard" style="background-color: coral">
    <div style="width: 400px; display: flex">
      <div style="width: 300px">
        <div
          style="display: flex"
          v-for="(row, i) in currentLayout" :key="i"
        >
          <div style="width: 40px" v-for="(keyboardKey, j) in row" :key="j">
            <KeyRouterLink
              :nodePath="[
                { name: 'main' },
                { name: 'keyboard' },
                { name: 'key', params: { keyboardKey } },
              ]"
              v-slot="{ isFocused }"
            >
              <div class="button" :class="{ focus: isFocused }">
                {{ keyboardKey }}
              </div>
            </KeyRouterLink>
          </div>
        </div>
      </div>
      <div style="width: 100px" size="1">
        <div>
          <div>
            <KeyRouterLink
              :nodePath="[
									{ name: 'main' },
									{ name: 'key', params: { keyboardKey: 'delete-character' } },
								]"
              @select="deleteCharater()"
              v-slot="{ isFocused }"
            >
              <div class="button" :class="{ focus: isFocused }">&#9003;</div>
            </KeyRouterLink>
          </div>
        </div>
        <div>
          <div>
            <KeyRouterLink
              :nodePath="[{ name: 'main' }, { name: 'key', params: { keyboardKey: 'change-layout' } }]"
              @select="changeLayout()"
              v-slot="{ isFocused }"
            >
              <div class="button" :class="{ focus: isFocused }">
                {{ currentChangeButton }}
              </div>
            </KeyRouterLink>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 400px; display: flex;">
      <div style="width: 100px">
        <KeyRouterLink
          :nodePath="[{ name: 'main' }, { name: 'key', params: { keyboardKey: 'space' } }]"
          @select="typeInput(' ')"
          v-slot="{ isFocused }"
        >
          <div class="button" :class="{ focus: isFocused }">
            Space
          </div>
        </KeyRouterLink>
      </div>
      <div style="width: 100px">
        <KeyRouterLink
          :nodePath="[{ name: 'main' }, { name: 'key', params: { keyboardKey: 'delete' } }]"
          @select="clearInput()"
          v-slot="{ isFocused }"
        >
          <div class="button" :class="{ focus: isFocused }">
            Del
          </div>
        </KeyRouterLink>
      </div>
      <div style="width: 100px">
        <KeyRouterLink
          :nodePath="[{ name: 'main' }, { name: 'key', params: { keyboardKey: 'search' } }]"
          @select="search()"
          v-slot="{ isFocused }"
        >
          <div class="button" :class="{ focus: isFocused }">
            Search
          </div>
        </KeyRouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component({
  name: 'Keyboard',
})
export default class Keyboard extends Vue {
  layouts = [
    {
      changeButton: '&123',
      rows: [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
        ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
        ['V', 'W', 'X', 'Y', 'Z', '-', '\''],
      ],
    },
    {
      changeButton: 'ABC',
      rows: [
        ['1', '2', '3', '&', '#', '(', ')'],
        ['4', '5', '6', '@', '!', '?', ':'],
        ['7', '8', '9', '0', '.', '_', '"'],
      ],
    },
  ]
  private selectedLayout: number = 0
  input: string = ''

  mounted () {
    document.addEventListener('keydown', this.onBackspace)
    document.addEventListener('keypress', this.onKeypress)
  }

  destroyed () {
    document.removeEventListener('keydown', this.onBackspace)
    document.removeEventListener('keypress', this.onKeypress)
  }

  get currentChangeButton () {
    return this.layouts[this.selectedLayout].changeButton
  }

  get currentLayout () {
    return this.layouts[this.selectedLayout].rows
  }

  private onBackspace (e: KeyboardEvent) {
    const keyboard = this.$refs['keyboard']
    if (!keyboard || !(keyboard instanceof Element)) {
      return
    }
    if (!this.isFocused) {
      return
    }
    if (e.key !== 'Backspace') {
      return
    }

    this.deleteCharater()
  }

  private onKeypress (e: KeyboardEvent) {
    // TODO Not sure if we even need keyboard support here.
    const keyboard = this.$refs['keyboard']
    if (!keyboard || !(keyboard instanceof Element)) {
      return
    }
    if (!this.isFocused) {
      return
    }
    if (e.key.length !== 1) {
      return
    }

    this.typeInput(e.key)
  }

  changeLayout () {
    this.selectedLayout = (this.selectedLayout + 1) % this.layouts.length
  }

  typeInput (character: string) {
    this.input += character
    this.$emit('search', this.input)
  }

  clearInput () {
    this.input = ''
    this.$emit('search', this.input)
  }

  deleteCharater () {
    this.input = this.input.slice(0, -1)
    this.$emit('search', this.input)
  }

  search () {
    this.$emit('search', this.input)
  }

  isFocused (): boolean {
    if (!this.$keyRouter.nodePath[1]) {
      return false
    }

    return this.$keyRouter.nodePath[1].name === 'keyboard'
  }
}
</script>

<style lang="scss">
.keyboard {
  .button {
    text-align: center;

    &.focus {
      background-color: white;
      color: black;
    }
  }
}
</style>
