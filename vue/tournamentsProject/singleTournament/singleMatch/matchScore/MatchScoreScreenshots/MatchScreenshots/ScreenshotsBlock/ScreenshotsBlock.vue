<template>
  <div class="screenshots_line" :class="type">
    <div class="screenshot"
         v-for="(screenshot, index) in screenshots"
         :key="index"
         @click="openScreenshots(index)"
         :class="{loaded: screenshot.isLoad}"
    >
      <svg class="screenshot__delete"
           v-if="canUChange"
           @click.stop="deleteScreenshot(screenshot, index)"
           viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="7" fill="#3A3A3A"/>
        <path d="M3.9375 3.9375L10.0625 10.0625M10.0625 3.9375L3.9375 10.0625" stroke="white"/>
      </svg>

      <spinner v-if="screenshot.isLoad" />

      <img class="screenshot__img"
           :src="screenshot.attributes.url"
           alt="#"
      />
    </div>

    <FsLightbox
        :toggler="toggler"
        :sources="imageUrls"
        :slide="slide"
        type="image"
    />
  </div>
</template>

<script>
import FsLightbox from "fslightbox-vue";
import {mapActions} from "vuex";
import Spinner from "@/components/UIElements/spinner";

export default {
  name: "ScreenshotsBlock",
  components: {Spinner, FsLightbox},
  props: {
    /**
     * Массив скриншотов
     * */
    screenshots: {
      type: Array,
      default: function() {
        return [];
      }
    },

    /**
     * Строка, обозначающая место расположения скриншотов. Добавляется в класс блока "screenshots_line"
     *
     * first - скриншоты к верхнему участнику
     * second - скриншоты к нижнему партисипанту
     * */
    type: {
      type: String,
      default: ''
    },

    canUChange: {
      type: Boolean,
       default: false
    }
  },
  data() {
    return {
      /**
       * Отвечает за показ/сокрытие увеличеных изображений
       * */
      toggler: false,

      /**
       * Номер изображения, с которого откроется галерея
       * */
      slide: 1
    }
  },
  computed: {
    /**
     * Собираем массив урлов картинок, чтобы передать их в FsLightbox
     * */
    imageUrls() {
      let urls = []

      for (let i = 0; i < this.screenshots.length; i++) {
        urls.push(this.screenshots[i].attributes.url)
      }

      return urls
    }
  },
  methods: {
    ...mapActions([
        'DELETE_MATCH_SCREENSHOT'
    ]),
    /**
     * Открываем галерею картинок на определенной картинке
     *
     * @param idx - индекс изображения
     * */
    openScreenshots(idx) {
      this.slide = idx + 1;
      this.toggler = !this.toggler
    },

    /**
     * Удаляем скриншот
     * */
    deleteScreenshot(screenshot, idx) {
      this.$set(this.screenshots, idx, {...screenshot, isLoad: true});
      this.DELETE_MATCH_SCREENSHOT(screenshot);
      const event = new Event('match-screenshot-deleted');
      window.dispatchEvent(event);
    }
  }
}
</script>

<style lang="scss" scoped></style>
