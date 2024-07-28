<template>
    <div class="container mx-auto p-4">
        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8" role="alert">
            <p class="font-bold">说明</p>
            <p>- 本站点的功能为，您录入笔记之后，可以自动依据您的笔记使用AI创建问卷。 你可以在问卷中进行自测，以实现加深记忆的效果。</p>
            <p>- 当前数据为英文课程测试，您可以自行新增笔记，点击编辑按钮可以编辑或者删除笔记。</p>
            <p>- 如存在问题请联系<a href="https://t.me/Odinluo">Odin</a>或自行尝试清空试题重试。</p>
        </div>
        <div class="  flex justify-between items-center">
            <div>
                <Button @click="showForm = true"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                    新增笔记
                </Button>
            </div>
            <div>
                <Button @click="clearQuestions"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
                    清空试题
                </Button>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="note in notes" :key="note.id" class="bg-white rounded-lg shadow-md p-4">
                <h2 @click="editNote(note)" class="text-xl font-bold mb-2 cursor-pointer">{{ note.title }}</h2>
                <p class="text-gray-600 mb-2">分类: {{ note.category }}</p>
                <p class="text-gray-600 mb-2">考点: {{ note.tags }}</p>
                <p class="text-gray-600 mb-2">错题:
                    <a href="javascript:void(0)" class="text-blue-500" @click="goToExam(note.id)"
                        v-if="getQuestionNum(note) <= 0">未初始化，点击AI创建题库</a>
                    <a :href="'/errors/' + note.id" class="text-blue-500" v-if="getQuestionNum(note) > 0">错 {{
                        getErrorNum(note)
                        }} / 对 {{ getCorrectNum(note) }} / 总 {{ getQuestionNum(note) }}</a>
                </p>
                <p class="text-gray-600 mb-4">日期: {{ note.date }}</p>
                <Button @click="editNote(note)"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    编辑
                </Button>
                <Button @click="goToExam(note.id)"
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    考试
                </Button>
            </div>
        </div>

        <Dialog :open="showForm" @close="showForm = false">
            <DialogContent class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                <Button @click="showForm = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Button>
                <h2 class="text-2xl font-bold mb-4">{{ formTitle }}</h2>
                <form @submit.prevent="saveNote">
                    <div class="mb-4">
                        <label for="category" class="block text-gray-700 font-bold mb-2">分类</label>
                        <Select v-model="currentNote.category">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue placeholder="选择分类" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="category in categories" :value="category" :key="category">{{
                                        category }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="mb-4">
                        <label for="title" class="block text-gray-700 font-bold mb-2">标题</label>
                        <Input v-model="currentNote.title" type="text" id="title" class="w-full" required />
                    </div>
                    <div class="mb-4">
                        <label for="content" class="block text-gray-700 font-bold mb-2">内容</label>
                        <Textarea v-model="currentNote.content" id="content" rows="4" class="w-full" required />
                    </div>
                    <div class="mb-4">
                        <label for="tags" class="block text-gray-700 font-bold mb-2">考点</label>
                        <Input v-model="currentNote.tags" type="text" id="tags" class="w-full" />
                    </div>
                    <div class="mb-6">
                        <label for="date" class="block text-gray-700 font-bold mb-2">日期</label>
                        <Input v-model="currentNote.date" type="date" id="date" class="w-full" required />
                    </div>
                    <div class="flex justify-between">
                        <Button type="submit"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            保存
                        </Button>
                        <Button type="button" @click="goToExam(currentNote.id)"
                            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            考试
                        </Button>
                        <Button v-if="currentNote.id" type="button" @click="deleteNote"
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            删除
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { LoadNotes, SaveNotes, LoadQuestions, SaveQuestions } from '../../lib/storage'
import { Note } from '../../lib/models'
// import { Save } from 'lucide-vue-next'


const notes = ref<Note[]>([])
const currentNote = ref<Note>({
    id: '',
    category: '',
    title: '',
    content: '',
    tags: '',
    errors: 0,
    date: ''
})
const showForm = ref(false)
const categories = ref(['English', '数学', '语文', '历史', '自然', '物理', '化学'])
const formTitle = computed(() => {
    return currentNote.value.id ? '编辑笔记' : '新增笔记'
})

const clearQuestions = () => {
    SaveQuestions([])
    alert('清空成功')
    loadNotesFromStorage()
}

const getCorrectNum = (note: Note) => {
    const questions = LoadQuestions();
    var qs = questions.filter(function (item) {
        return item.status == 'correct' && item.nid == note.id;
    });

    return qs.length
}

const getErrorNum = (note: Note) => {
    const questions = LoadQuestions();
    var qs = questions.filter(function (item) {
        return item.status == 'wrong' && item.nid == note.id;
    });

    return qs.length
}

const getQuestionNum = (note: Note) => {
    const questions = LoadQuestions();
    var qs = questions.filter(function (item) {
        return item.nid == note.id;
    });

    return qs.length
}

const editNote = (note: Note) => {
    currentNote.value = { ...note }
    showForm.value = true
}

const saveNote = () => {
    if (currentNote.value.id) {
        const index = notes.value.findIndex(note => note.id === currentNote.value.id)
        notes.value.splice(index, 1, currentNote.value)
    } else {
        currentNote.value.id = Date.now().toString()
        notes.value.push(currentNote.value)
    }

    resetForm()
    saveNotesToStorage()
}

const deleteNote = () => {
    const index = notes.value.findIndex(note => note.id === currentNote.value.id)
    notes.value.splice(index, 1)
    resetForm()
    saveNotesToStorage()
}

const goToExam = (noteId: string) => {
    window.location.href = `/generate/${noteId}`
}

const resetForm = () => {
    currentNote.value = {
        id: '',
        category: '',
        title: '',
        content: '',
        tags: '',
        errors: 0,
        date: ''
    }

    showForm.value = false
}

const saveNotesToStorage = () => {
    SaveNotes(notes.value)
}

const loadNotesFromStorage = () => {
    const storedNotes = LoadNotes()
    if (storedNotes) {
        notes.value = storedNotes
    }
}

onMounted(() => {
    loadNotesFromStorage()
})
</script>