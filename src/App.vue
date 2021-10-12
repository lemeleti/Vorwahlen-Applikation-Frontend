<template>
  <div id="app">
    <Header />
    <!-- Content -->
    <div class="columns sticky-footer">
      <div class="column main-content">
        <main class="section container is-widescreen">
          <div class="tile box is-radiusless">
            <div id="includeContent" class="tile is-child">
              <router-view />
            </div>
          </div>
        </main>
      </div>

      <div class="right-sidemenu">
        <RightMenu />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import RightMenu from "@/components/RightMenu.vue";

@Component({
  components: {
    Header,
    Footer,
    RightMenu,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: #f1f1f1;
}

.sticky-footer {
  flex: 1;
}

.box-header,
.box-content {
  margin: 20px 20px 20px 20px;
}

main.section {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
