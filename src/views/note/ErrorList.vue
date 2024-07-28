<template>
    <div class="container mx-auto p-4">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold"><a href="/">笔记</a>>错题</h1>
            <span class="text-gray-500">ID: {{ nid }}</span>
        </div>
        <div class="mb-8">
            <Switch :checked="showAll" @update:checked="showAll == true ? showAll = false : showAll = true" />
            <Label>显示所有题目</Label>
        </div>
        <div v-for="(section) in sections" :key="section.name" class="mb-12">
            <h2 class="text-xl font-bold mb-4"
                v-show="section.questions.length > 0 && (!currentQuestion || showAll || isQuestionContains(section, currentQuestion))">
                {{
                    section.name
                }}</h2>
            <div v-for="(question, qIndex) in section.questions" :key="qIndex">
                <div v-show="showAll || currentQuestion == question" :class="['mb-8']">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold">{{ qIndex + 1 }}. {{ question.title }}</span>
                        <Dialog>
                            <DialogTrigger as-child>
                                <Button size="sm" variant="outline">
                                    <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path
                                            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                                        </path>
                                    </svg>
                                    解析
                                </Button>
                            </DialogTrigger>
                            <DialogContent class="sm:max-w-[425px]">
                                <div class="mb-4">
                                    <p class="text-lg">题目:{{ question?.title }}</p>
                                    <p v-if="question?.type !== '翻译题'">
                                        正确答案:{{ question?.answer }}
                                    </p>
                                    <p v-else>
                                        参考译文:{{ question?.answer }}
                                    </p>
                                </div>
                                <div>
                                    <p class="mb-2 font-bold">AI解析:</p>
                                    <p>{{ question?.explanation }}</p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div v-if="question.type === '选择题'">
                        <RadioGroup v-model="question.myAnswer" :value="question.myAnswer">
                            <div v-for="(option, oindex) in question.options" :key="option" class="mb-2">
                                <RadioGroupItem :id="option" :value="option"
                                    :disabled="question.status !== 'notAnswered'"
                                    @click="checkAnswer(question, oindex.toString())"
                                    :checked="getOptionStatus(question, oindex.toString())"> </RadioGroupItem>
                                &nbsp; <Label for="r1" :disabled="question.status !== 'notAnswered'"
                                    @click="checkAnswer(question, oindex.toString())" class="cursor-pointer"> {{ option
                                    }}</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div v-if="question.type === '填空题'">
                        <Input v-model="question.myAnswer" @change="checkAnswer(question, undefined)"
                            :disabled="question.status !== 'notAnswered'" class="mb-2" />
                    </div>

                    <div v-if="question.type === '判断题'">
                        <RadioGroup v-model="question.myAnswer">
                            <div class="mb-2">
                                <RadioGroupItem :value="question.options ? question.options[0] : '正确'"
                                    :disabled="question.status !== 'notAnswered'" @click="checkAnswer(question, '正确')">
                                </RadioGroupItem> <Label for="r1" :disabled="question.status !== 'notAnswered'"
                                    class="cursor-pointer"
                                    @click="checkAnswer(question, question.options ? question.options[0] : '正确')">{{
                                        question.options ?
                                            question.options[0] : '正确' }}</Label>
                            </div>
                            <div class="mb-2">
                                <RadioGroupItem :value="question.options ? question.options[1] : '错误'"
                                    :disabled="question.status !== 'notAnswered'"
                                    @click="checkAnswer(question, question.options ? question.options[1] : '错误')">
                                </RadioGroupItem> <Label for="r1" class="cursor-pointer"
                                    @click="checkAnswer(question, question.options ? question.options[0] : '错误')">{{
                                        question.options ? question.options[1] :
                                            '错误' }}</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div v-if="question.type === '翻译题'">
                        <Textarea v-model="question.myAnswer" @change="checkAnswer(question, undefined)"
                            :disabled="question.status !== 'notAnswered'" class="mb-2"></Textarea>
                    </div>

                    <Button size="sm" variant="outline" disabled="!question.myAnswer">
                        结果
                    </Button>

                    <Alert v-if="question.status === 'correct'" severity="success" class="mb-2">
                        回答正确
                    </Alert>
                    <Alert v-if="question.status === 'wrong'" severity="error" class="mb-2">
                        回答错误
                    </Alert>
                    <div v-if="question.status !== 'notAnswered'" class="text-sm text-gray-500">
                        <p>解释:{{ question.explanation }}</p>
                    </div>
                </div>
            </div>
        </div>
        <Toaster />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Question, Section } from '../../lib/models'
import { LoadQuestions, SaveQuestions } from '../../lib/storage'
import { useRoute } from 'vue-router';
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const showAll = ref(false)
const currentQuestion = ref<Question | null>(null)
const sections = ref<Section[]>([])
const nid = ref("");
const route = useRoute();
const { toast } = useToast()

onMounted(() => {
    nid.value = route.params.nid as string;
    const questions = LoadQuestions();

    var types = ['选择题', '判断题', '填空题', '翻译题']
    for (var type in types) {
        var qs = questions.filter(function (item) {
            return item.type == types[type] && item.status == 'wrong' && item.nid == nid.value;
        });

        qs.forEach(q => {
            q.myAnswer = undefined,
                q.status = 'notAnswered'
        })

        var section = {
            name: types[type],
            questions: qs
        };
        sections.value.push(section);
    }

    currentQuestion.value = showAll.value ? null : sections.value.flatMap(s => s.questions).find(q => q.status === 'notAnswered') || null

});

const isQuestionContains = (section: Section, question?: Question): boolean => {
    if (!question) {
        return true;
    }

    if (section.questions.find(q => q.title === question.title)) {
        return true;
    }

    return false;
};

const getOptionStatus = (question: Question, option: string | undefined): boolean => {
    if (!question.myAnswer || !option) {
        return false;
    }

    if (option) {
        if (option == "0") {
            option = "a"
        }

        if (option == "1") {
            option = "b"
        }

        if (option == "2") {
            option = "c"
        }

        if (option == "3") {
            option = "d"
        }
    }

    return question.myAnswer.replace(/\s+/g, '').toLowerCase() === option.replace(/\s+/g, '').toLowerCase();
}

const checkAnswer = (curQuestion: Question, option: string | undefined) => {

    const optionsMap: { [key: string]: number } = { "0": 0, "1": 1, "2": 2, "3": 3 };
    let cleanedOption = '';
    if (option && curQuestion.options) {
        cleanedOption = option.replace(/\s+/g, '').toLowerCase();
        curQuestion.myAnswer = optionsMap.hasOwnProperty(cleanedOption) ?
            curQuestion.options[optionsMap[cleanedOption]].replace(/\s+/g, '').toLowerCase() :
            cleanedOption;
    }

    let verifyAnswer = curQuestion.answer.replace(/\s+/g, '').toLowerCase();
    const answerMap: { [key: string]: number } = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };

    if (curQuestion.type == '选择题' && curQuestion.options) {
        verifyAnswer = answerMap.hasOwnProperty(verifyAnswer) ?
            curQuestion.options[answerMap[verifyAnswer]].replace(/\s+/g, '').toLowerCase() :
            verifyAnswer;
    }

    // console.log(curQuestion.myAnswer + "|" + verifyAnswer)

    if (curQuestion.type == '判断题' && curQuestion.options && option) {
        curQuestion.myAnswer = option.replace(/\s+/g, '').toLowerCase();
    }

    if (curQuestion.myAnswer) {
        curQuestion.myAnswer = curQuestion.myAnswer.replace(/\s+/g, '').toLowerCase();
    }

    if (!curQuestion.myAnswer) {
        curQuestion.status = 'notAnswered';
    } else if (curQuestion.myAnswer === verifyAnswer) {
        curQuestion.status = 'correct';
        curQuestion.myAnswer = curQuestion.answer;

        toast({
            title: '回答正确!',
            description: curQuestion.explanation,
        });
    } else {
        curQuestion.status = 'wrong';
        console.log(option)
        if (option) {
            if (curQuestion.type == '选择题' && curQuestion.options) {
                curQuestion.myAnswer = curQuestion.options[optionsMap[cleanedOption]]
            }
            else {
                curQuestion.myAnswer = option;
            }
        }

        toast({
            title: '回答错误!',
            description: curQuestion.explanation,
        });
    }

    currentQuestion.value = showAll.value ? null : sections.value.flatMap(s => s.questions).find(q => q.status === 'notAnswered') || null;
    saveToStorage(curQuestion);
}

const saveToStorage = (currentQuestion: Question) => {
    const questions = LoadQuestions();
    questions.forEach(q => {
        if (q.nid == currentQuestion.nid &&
            q.title == currentQuestion.title &&
            q.type == currentQuestion.type &&
            q.answer == currentQuestion.answer &&
            q.explanation == currentQuestion.explanation) {
            q.myAnswer = currentQuestion.myAnswer
            q.status = currentQuestion.status
            q.answerDate = new Date().toISOString()
        }
    })

    SaveQuestions(questions);
}
</script>