import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Buefy from "buefy";
import axios from 'axios';
import VueAxios from 'vue-axios';
import "buefy/dist/buefy.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faUser,
  faEdit,
  faCogs,
  faSignOutAlt,
  faDownload,
  faChevronDown,
  faChartPie,
  faArrowUp,
  faSquare,
  faCheck,
  faPlus,
  faBell,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faHome,
  faUser,
  faEdit,
  faCogs,
  faSignOutAlt,
  faDownload,
  faChevronDown,
  faChartPie,
  faArrowUp,
  faSquare,
  faCheck,
  faPlus,
  faBell,
  faSearch
);

Vue.component("vue-fontawesome", FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas",
});
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
