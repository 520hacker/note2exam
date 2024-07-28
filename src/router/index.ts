import { createRouter, createWebHistory } from 'vue-router'
// import HomePage from '../views/main/HomePage.vue'
// import NewsList from '../views/news/NewsList.vue'
// import OddsListOne from '../views/odds/OddsList.vue'
import UserLogin from '../views/user/UserLogin.vue'
import UserRegister from '../views/user/UserRegister.vue'
import ExamView from '../views/exam/ExamView.vue'
import GenerateView from '../views/exam/GenerateView.vue'
import NoteList from '../views/note/NoteList.vue'
import ErrorList from '../views/note/ErrorList.vue'


const routes = [
  { path: '/', component: NoteList },
  { path: '/notes', component: NoteList },
  { path: '/errors/:nid', component: ErrorList },
  { path: '/generate/:nid', component: GenerateView },
  { path: '/exam', component: ExamView },
  { path: '/exam/:nid/:eid', component: ExamView },
  { path: '/exam/:nid', component: ExamView },
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  // { path: '/news/list', component: NewsList },
  // { path: '/odds/list/:sid/:cid/:tid', component: OddsListOne }, 
  // { path: '/odds/list', component: OddsListOne },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;