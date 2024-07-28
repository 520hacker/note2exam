<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">{{ note != null ? note.title : 'Note' }}</h1>
    <p class="text-gray-700 text-base mb-8">{{ truncatedContent }}</p>
    <div class="relative pt-1 mb-8">
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
        <div :style="{ width: progress + '%' }"
          class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500">
        </div>
      </div>
      <div class="text-center" v-if="generating">{{ information }}</div>
      <div class="text-center text-green-500" v-if="completed">Questions generated successfully!</div>
    </div>
    <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8" role="alert">
      <p class="font-bold">Tip</p>
      <p>{{ tip }}</p>
    </div>
    <div class="flex justify-between">
      <button @click="cancelGeneration" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Cancel
      </button>
      <button @click="completeGeneration" :disabled="!completed"
        :class="{ 'bg-green-500 hover:bg-green-700': completed, 'bg-gray-500 cursor-not-allowed': !completed }"
        class="text-white font-bold py-2 px-4 rounded">
        {{ completed ? 'Start Exam' : 'Generating...' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Note, Question, Message } from '../../lib/models'
import { getExamQuestionsPrompt, getExamQuestionSysPrompt } from '../../lib/prompts'
import { initBaseMessage, getJsonFromMarkdown } from '../../lib/messages'
import { makeSingleChat } from '../../api/sse'
import { LoadNotes, LoadQuestions, SaveQuestions } from '../../lib/storage'

const note = ref<Note | undefined>({
  id: '0',
  category: '',
  tags: '',
  errors: 0,
  title: 'Generate ...',
  content: '',
  date: new Date().toString()
});
const progress = ref(0);
const generating = ref(true);
const completed = ref(false);
const tip = ref('页面使用AI创建试卷，需要一定时间加载，请耐心等待。');
const information = ref('Generating questions...')

const truncatedContent = computed(() => {
  if (note.value == null) {
    return ''
  }

  if (note.value.content.length <= 300) {
    return note.value.content;
  } else {
    return note.value.content.slice(0, 300) + '...';
  }
});

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  // console.log(route.params.nid)
  const nid = route.params.nid as string;
  note.value = await loadNote(nid);
  // console.log(note.value)
  await generateQuestions(nid);
});

async function loadNote(nid: string): Promise<Note | undefined> {
  const notes = LoadNotes();
  return notes.find((note: Note) => note.id === nid);
}

async function generateQuestions(nid: string): Promise<void> {
  var questions = LoadQuestions();
  questions = questions.filter(function (item) { return item.status === 'notAnswered' && item.nid == nid; });
  if (questions.length < 15) {
    questions = await createQuestion(note.value)
  }

  generating.value = false;
  completed.value = true;
}

function createMessages(data: Note, content: string, type: string): Message[] {
  var messages: Message[] = [{
    role: "system",
    content: getExamQuestionSysPrompt(data.tags, type, data.category)
  }, {
    role: "user",
    content: content
  }]

  return messages
}

function appendAndSaveQuestions(questions: Question[]): void {
  // console.log('appendAndSaveQuestions:' + questions.length)
  var oldQuestion = LoadQuestions();
  SaveQuestions(oldQuestion.concat(questions));

}

function getTypes(category: string): string[] {
  return category === 'English' ? ['选择题', '判断题', '填空题', '翻译题'] : ['选择题', '判断题', '填空题'];
}

async function createQuestion(d: Note | undefined): Promise<Question[]> {
  if (!d) {
    return [];
  }

  const contentList = getContentArr(d.content);
  let questions: Question[] = [];
  const types = getTypes(d.category);

  const createQuestionsForTypeAndContent = async (type: string, content: string) => {
    const prompt = getExamQuestionsPrompt(content);
    const messages = createMessages(d, prompt, type);
    const param = initBaseMessage(messages, "gpt-4o-mini", false);

    try {
      const data = await makeSingleChat(param);
      const json = getJsonFromMarkdown(data.choices[0].message.content);
      const qs: Question[] = JSON.parse(json);
      qs.forEach(question => {
        question.nid = d.id;
        question.date = new Date().toISOString();
      });
      return qs;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const promises: Promise<Question[]>[] = [];

  for (const type of types) {
    for (const content of contentList) {
      promises.push(createQuestionsForTypeAndContent(type, content));
      information.value += "\n AI正在为您创建 " + type + ' ...'
    }
  }

  const results = await Promise.all(promises);
  questions = results.flat();

  progress.value = 100;
  appendAndSaveQuestions(questions);

  return questions;
}


function getContentArr(contents: string): string[] {
  if (contents.length > 3000) {
    var list = [];
    for (var i = 0; i < contents.length; i += 3000) {
      list.push(contents.substring(i, i + 3000));
    }

    return list;
  }

  return [contents];
};

function cancelGeneration(): void {
  // Cancel the question generation process
  generating.value = false;

  // Navigate to the "/notes" route
  router.push('/notes');
}

function completeGeneration(): void {
  if (note.value == undefined) {
    return;
  }
  // Navigate to the next page or perform any necessary actions
  router.push(`/exam/${note.value.id}`);
}


</script>

<style scoped>
/* Add any component-specific styles here */
</style>